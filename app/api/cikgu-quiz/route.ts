import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";
import { getCikguDb } from "@/lib/cikgu-db";

export const runtime = "nodejs";

type QuestionEdit = { question: string; choices: string[]; answer: string; explanation: string };
type CustomQuestion = QuestionEdit & { id: string; subject: string; year: number; topic: string };
type Correction = { questionId: string; original: unknown; corrected: unknown };
type QuizBody = { id?: string; ownerToken?: string; bankKey?: string; questionIds?: string[]; edits?: Record<string, QuestionEdit>; customQuestions?: CustomQuestion[]; corrections?: Correction[]; theme?: string; accessMode?: "delima" | "open" };

const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
const validQuestion = (question: CustomQuestion) => Boolean(
  question?.id && question.subject && Number.isInteger(question.year) && question.year >= 1 && question.year <= 6 &&
  question.topic && question.question && Array.isArray(question.choices) && question.choices.length === 4 &&
  question.choices.every((choice) => String(choice).trim()) && /^[A-D]$/.test(question.answer),
);
const valid = (body: QuizBody) => Boolean(
  body.id && body.ownerToken && body.bankKey && Array.isArray(body.questionIds) && body.questionIds.length &&
  (body.bankKey !== "custom" || (Array.isArray(body.customQuestions) && body.customQuestions.length === body.questionIds.length && body.customQuestions.every(validQuestion))),
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as QuizBody;
    if (!valid(body)) return NextResponse.json({ error: "Maklumat kuiz tidak lengkap." }, { status: 400 });
    const db = getCikguDb();
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const questionOverrides = body.bankKey === "custom"
        ? Object.fromEntries(body.customQuestions!.map((question) => [question.id, question]))
        : { ...(body.edits ?? {}) };
      const storedOverrides = { ...questionOverrides, __settings: { accessMode: body.accessMode === "delima" ? "delima" : "open" } };
      await client.query(
        "INSERT INTO teacher_quizzes (id, owner_token_hash, source_bank, question_ids, question_overrides, theme) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6)",
        [body.id, tokenHash(body.ownerToken!), body.bankKey, JSON.stringify(body.questionIds), JSON.stringify(storedOverrides), body.theme ?? "coral"],
      );
      for (const correction of body.corrections ?? []) {
        await client.query(
          "INSERT INTO bank_question_corrections (id, quiz_id, question_id, original_question, corrected_question) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)",
          [randomUUID(), body.id, correction.questionId, JSON.stringify(correction.original), JSON.stringify(correction.corrected)],
        );
      }
      await client.query("COMMIT");
      return NextResponse.json({ id: body.id });
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  } catch (error) {
    console.error("Tidak dapat menerbitkan kuiz cikgu", error);
    return NextResponse.json({ error: "Kuiz belum dapat diterbitkan. Cuba sebentar lagi." }, { status: 500 });
  }
}
