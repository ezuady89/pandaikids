import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, type UserContent } from "ai";
import { z } from "zod";
import {
  attachTeacherQuotaCookie,
  claimTeacherQuota,
  createAiReceipt,
  getTeacherQuotaIdentity,
  readTeacherQuota,
  refundTeacherQuota,
} from "@/lib/cikgu-quota";
import { recordSystemEvent } from "@/lib/admin-events";
import { readTeacherSession } from "@/lib/teacher-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_BYTES = 4 * 1024 * 1024;
const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain"]);
const rateWindow = new Map<string, { count: number; resetAt: number }>();

const generatedSchema = z.object({
  questions: z.array(z.object({
    question: z.string().min(4).max(500),
    choices: z.array(z.string().min(1).max(180)).length(4),
    answer: z.enum(["A", "B", "C", "D"]),
    explanation: z.string().max(350),
  })).min(1).max(50),
});

function parseGeneratedQuestions(text: string) {
  const unfenced = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("INVALID_AI_JSON");
  return generatedSchema.parse(JSON.parse(unfenced.slice(start, end + 1)));
}

const visualQuestionPatterns = [
  /\b(?:poster|imej|gambar|ilustrasi|paparan|reka bentuk)\b/i,
  /\b(?:ikon|lambang|logo|warna|maskot|alamat laman web|nama laman web|font|jenis tulisan)\b/i,
  /\b(?:penjuru|sudut|bahagian atas|bahagian bawah|di sebelah|di tengah)\b/i,
  /\b(?:dalam|pada)\s+(?:bahagian|nota|bahan)\b/i,
];

function hasVisualOrDocumentQuestion(question: z.infer<typeof generatedSchema>["questions"][number]) {
  const text = `${question.question} ${question.explanation}`;
  return visualQuestionPatterns.some((pattern) => pattern.test(text));
}

function selectContentQuestions(questions: z.infer<typeof generatedSchema>["questions"]) {
  const seen = new Set<string>();
  return questions.filter((question) => {
    if (hasVisualOrDocumentQuestion(question)) return false;
    const normalized = question.question.toLocaleLowerCase("ms-MY").replace(/[^a-z0-9]+/gi, " ").trim();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function safeDiagnostic(error: unknown) {
  const parts: string[] = [];
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current && typeof current === "object"; depth += 1) {
    const value = current as Record<string, unknown>;
    for (const key of ["name", "message", "statusCode", "status", "code", "responseBody"]) {
      if (value[key] != null) parts.push(`${key}=${String(value[key])}`);
    }
    current = value.cause;
  }
  return parts.join(" | ")
    .replace(/AIza[\w-]+/g, "[redacted-key]")
    .replace(/([?&]key=)[^&\s]+/gi, "$1[redacted]")
    .slice(0, 900);
}

function canGenerate(request: NextRequest) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = rateWindow.get(key);
  if (!current || current.resetAt < now) {
    rateWindow.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (current.count >= 3) return false;
  current.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const session = readTeacherSession(request);
  if (!session) return NextResponse.json({
    code: "LOGIN_REQUIRED",
    error: "Log masuk sebagai cikgu untuk menggunakan AI.",
    loginUrl: "/log-masuk/?next=%2Faktiviti%2Fbina%2F%3Fcara%3Dai",
  }, { status: 401 });
  const identity = await getTeacherQuotaIdentity(request);
  if (!canGenerate(request)) return attachTeacherQuotaCookie(NextResponse.json({ error: "Terlalu banyak percubaan dibuat serentak. Cuba semula dalam 10 minit." }, { status: 429 }), identity);

  let quotaClaimed = false;

  try {
    const form = await request.formData();
    const subject = String(form.get("subject") ?? "").trim().slice(0, 80);
    const year = Math.min(6, Math.max(1, Number(form.get("year") ?? 1)));
    const topic = String(form.get("topic") ?? "").trim().slice(0, 160);
    const material = String(form.get("material") ?? "").trim().slice(0, 16000);
    const currentQuota = await readTeacherQuota(identity.key, identity.teacherId);
    const count = Math.min(currentQuota.plan.questionLimit, Math.max(3, Number(form.get("count") ?? 10)));
    const fileValue = form.get("file");
    const file = fileValue instanceof File && fileValue.size > 0 ? fileValue : undefined;

    if (!subject || !topic) return attachTeacherQuotaCookie(NextResponse.json({ error: "Pilih subjek dan masukkan tajuk pembelajaran." }, { status: 400 }), identity);
    if (file && (file.size > MAX_FILE_BYTES || !allowedTypes.has(file.type))) return attachTeacherQuotaCookie(NextResponse.json({ error: "Fail mestilah PDF, gambar atau teks dan tidak melebihi 4 MB." }, { status: 400 }), identity);

    const quota = await claimTeacherQuota(identity.key, "ai", identity.teacherId);
    if (!quota) return attachTeacherQuotaCookie(NextResponse.json({
      code: "AI_MONTHLY_LIMIT_REACHED",
      error: `${currentQuota.plan.aiLimit} penggunaan AI untuk pakej ${currentQuota.plan.name} bulan ini telah digunakan. Cikgu masih boleh bina soalan sendiri.`,
    }, { status: 429 }), identity);
    quotaClaimed = true;

    const instruction = [
      `Hasilkan tepat ${count} soalan kuiz aneka pilihan untuk ${subject}, Tahun ${year}, tajuk “${topic}”.`,
      "TUGAS UTAMA: Uji kefahaman murid terhadap ISI PELAJARAN dan fakta penting dalam bahan. Gambar, poster atau PDF hanyalah sumber untuk membaca isi nota.",
      "Murid TIDAK akan melihat bahan asal ketika menjawab. Oleh itu setiap soalan mesti lengkap, berdiri sendiri dan boleh dijawab tanpa melihat gambar, poster, PDF atau nota tersebut.",
      "DILARANG bertanya tentang rupa atau susun atur bahan: tajuk di atas, teks di bawah, penjuru, bahagian, warna, ikon, lambang, logo, maskot, haiwan dalam gambar, alamat laman web, nama jenama, jenis tulisan atau kedudukan sesuatu objek.",
      "DILARANG menggunakan frasa seperti ‘berdasarkan poster’, ‘dalam gambar’, ‘pada nota’, ‘dalam bahagian Fakta Penting’ atau apa-apa rujukan kepada dokumen asal.",
      "Abaikan hiasan, logo dan maklumat penerbit. Ambil hanya fakta pembelajaran. Pelbagaikan soalan kepada ingatan fakta, kefahaman sebab/tujuan dan aplikasi mudah yang benar-benar disokong oleh isi bahan.",
      "Gunakan Bahasa Melayu yang mudah difahami murid sekolah rendah Malaysia, kecuali subjek Bahasa Inggeris yang perlu menggunakan bahasa Inggeris.",
      "Setiap soalan mesti mempunyai tepat empat pilihan jawapan yang munasabah dan hanya satu jawapan betul.",
      "Elakkan soalan mengelirukan, fakta yang tidak terdapat dalam bahan, kandungan sensitif dan arahan yang meminta maklumat peribadi murid.",
      "Berikan penerangan jawapan yang pendek dan jelas.",
      'Pulangkan JSON sahaja dalam bentuk {"questions":[{"question":"...","choices":["...","...","...","..."],"answer":"A","explanation":"..."}]}. Nilai answer mestilah A, B, C atau D mengikut kedudukan choices.',
      material
        ? `Bahan cikgu:\n${material}`
        : file
          ? "Baca bahan yang dilampirkan oleh cikgu."
          : "Tiada bahan dilampirkan. Hasilkan soalan berdasarkan tajuk yang diberi dan pengetahuan kurikulum sekolah rendah Malaysia.",
    ].join("\n\n");

    const fileData = file ? new Uint8Array(await file.arrayBuffer()) : undefined;
    const buildContent = (extraInstruction = ""): UserContent => file && fileData
      ? [
          { type: "text", text: `${instruction}${extraInstruction}` },
          { type: "file", data: fileData, mediaType: file.type, filename: file.name },
        ]
      : `${instruction}${extraInstruction}`;

    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");

    const google = createGoogleGenerativeAI({ apiKey });
    const model = process.env.PANDAIKIDS_GEMINI_MODEL ?? "gemini-3.5-flash-lite";
    const generateDraft = async (extraInstruction = "") => {
      const { text } = await generateText({
        model: google(model),
        messages: [{ role: "user", content: buildContent(extraInstruction) }],
        maxOutputTokens: 5000,
        temperature: extraInstruction ? 0.1 : 0.2,
      });
      return parseGeneratedQuestions(text);
    };

    const firstDraft = await generateDraft();
    let contentQuestions = selectContentQuestions(firstDraft.questions);
    if (contentQuestions.length < count) {
      const correctedDraft = await generateDraft("\n\nPEMBETULAN WAJIB: Hasilkan set alternatif yang langsung tidak menyebut rupa atau dokumen. Gunakan fakta isi pelajaran sahaja dan pastikan murid boleh menjawab tanpa melihat bahan asal.");
      contentQuestions = selectContentQuestions([...contentQuestions, ...correctedDraft.questions]);
    }
    if (!contentQuestions.length) throw new Error("AI_QUESTION_QUALITY_FAILED");
    const output = { questions: contentQuestions.slice(0, count) };
    if (output.questions.length) {
      await recordSystemEvent({ eventType: "AI", route: "/api/cikgu-ai", status: "SUCCESS", teacherId: identity.teacherId, metadata: { count: output.questions.length } });
      return attachTeacherQuotaCookie(NextResponse.json({ questions: output.questions, quota, aiReceipt: createAiReceipt(identity.key) }), identity);
    }
    throw new Error("EMPTY_AI_OUTPUT");
  } catch (error) {
    if (quotaClaimed) await refundTeacherQuota(identity.key, "ai").catch((refundError) => console.error("Kuota AI belum dapat dipulangkan", refundError));
    console.error("Penjanaan soalan gagal", error);
    const detail = safeDiagnostic(error) || (error instanceof Error ? `${error.name} ${error.message}` : String(error));
    await recordSystemEvent({ eventType: "AI", route: "/api/cikgu-ai", status: "FAILED", teacherId: identity.teacherId, message: detail });
    const setupError = /(unauthorized|authentication|api.?key|missing|401|403)/i.test(detail);
    const quotaError = /(quota|rate.?limit|resource.?exhausted|429)/i.test(detail);
    return attachTeacherQuotaCookie(NextResponse.json({
      code: setupError ? "AI_SETUP_REQUIRED" : quotaError ? "AI_FREE_QUOTA_REACHED" : "AI_GENERATION_FAILED",
      error: setupError
        ? "Sambungan Gemini belum diaktifkan. Cikgu masih boleh masukkan soalan sendiri."
        : quotaError
          ? "Kuota percuma sedang sibuk atau telah dicapai. Cuba semula sebentar lagi."
          : "Soalan belum dapat dihasilkan. Pastikan bahan jelas dan cuba sekali lagi.",
    }, { status: quotaError ? 429 : 500 }), identity);
  }
}
