import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, type UserContent } from "ai";
import { z } from "zod";

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
  })).min(1).max(20),
});

function parseGeneratedQuestions(text: string) {
  const unfenced = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("INVALID_AI_JSON");
  return generatedSchema.parse(JSON.parse(unfenced.slice(start, end + 1)));
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
  if (!canGenerate(request)) return NextResponse.json({ error: "Had percubaan sementara telah dicapai. Cuba semula dalam 10 minit." }, { status: 429 });

  try {
    const form = await request.formData();
    const subject = String(form.get("subject") ?? "").trim().slice(0, 80);
    const year = Math.min(6, Math.max(1, Number(form.get("year") ?? 1)));
    const topic = String(form.get("topic") ?? "").trim().slice(0, 160);
    const material = String(form.get("material") ?? "").trim().slice(0, 16000);
    const count = Math.min(20, Math.max(3, Number(form.get("count") ?? 10)));
    const fileValue = form.get("file");
    const file = fileValue instanceof File && fileValue.size > 0 ? fileValue : undefined;

    if (!subject || !topic) return NextResponse.json({ error: "Pilih subjek dan masukkan tajuk pembelajaran." }, { status: 400 });
    if (file && (file.size > MAX_FILE_BYTES || !allowedTypes.has(file.type))) return NextResponse.json({ error: "Fail mestilah PDF, gambar atau teks dan tidak melebihi 4 MB." }, { status: 400 });

    const instruction = [
      `Hasilkan tepat ${count} soalan kuiz aneka pilihan untuk ${subject}, Tahun ${year}, tajuk “${topic}”.`,
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

    const content: UserContent = file
      ? [
          { type: "text", text: instruction },
          { type: "file", data: new Uint8Array(await file.arrayBuffer()), mediaType: file.type, filename: file.name },
        ]
      : instruction;

    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");

    const google = createGoogleGenerativeAI({ apiKey });
    const model = process.env.PANDAIKIDS_GEMINI_MODEL ?? "gemini-2.5-flash-lite";
    const { text } = await generateText({
      model: google(model),
      messages: [{ role: "user", content }],
      maxOutputTokens: 5000,
      temperature: 0.2,
    });
    const output = parseGeneratedQuestions(text);
    if (output.questions.length) return NextResponse.json({ questions: output.questions });
    throw new Error("EMPTY_AI_OUTPUT");
  } catch (error) {
    console.error("Penjanaan soalan gagal", error);
    const detail = safeDiagnostic(error) || (error instanceof Error ? `${error.name} ${error.message}` : String(error));
    const setupError = /(unauthorized|authentication|api.?key|missing|401|403)/i.test(detail);
    const quotaError = /(quota|rate.?limit|resource.?exhausted|429)/i.test(detail);
    return NextResponse.json({
      code: setupError ? "AI_SETUP_REQUIRED" : quotaError ? "AI_FREE_QUOTA_REACHED" : "AI_GENERATION_FAILED",
      error: setupError
        ? "Sambungan Gemini belum diaktifkan. Cikgu masih boleh masukkan soalan sendiri."
        : quotaError
          ? "Kuota percuma sedang sibuk atau telah dicapai. Cuba semula sebentar lagi."
          : "Soalan belum dapat dihasilkan. Pastikan bahan jelas dan cuba sekali lagi.",
      ...(request.headers.get("x-pandaikids-diagnostic") === "owner-check" ? { diagnostic: detail } : {}),
    }, { status: quotaError ? 429 : 500 });
  }
}
