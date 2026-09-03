import { NextRequest, NextResponse } from "next/server";
import { generateText, Output, type UserContent } from "ai";
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

    const models = [...new Set([process.env.PANDAIKIDS_AI_MODEL, "alibaba/qwen3.5-flash", "google/gemini-2.5-flash-lite"].filter(Boolean))] as string[];
    let lastError: unknown;
    for (const model of models) {
      try {
        const { output } = await generateText({
          model,
          output: Output.object({ schema: generatedSchema }),
          messages: [{ role: "user", content }],
          maxOutputTokens: 5000,
          temperature: 0.2,
          providerOptions: { gateway: { tags: ["feature:quiz-builder", "app:pandaikids"] } },
        });
        if (output?.questions?.length) return NextResponse.json({ questions: output.questions });
        lastError = new Error("EMPTY_AI_OUTPUT");
      } catch (error) { lastError = error; }
    }
    throw lastError ?? new Error("EMPTY_AI_OUTPUT");
  } catch (error) {
    console.error("Penjanaan soalan gagal", error);
    const detail = error instanceof Error ? `${error.name} ${error.message}` : String(error);
    const setupError = /(unauthorized|authentication|api.?key|oidc|credit|billing|payment|401|402|403)/i.test(detail);
    return NextResponse.json({
      code: setupError ? "AI_SETUP_REQUIRED" : "AI_GENERATION_FAILED",
      error: setupError ? "Sambungan AI belum diaktifkan. Cikgu masih boleh masukkan soalan sendiri." : "Soalan belum dapat dihasilkan. Pastikan bahan jelas dan cuba sekali lagi.",
    }, { status: 500 });
  }
}
