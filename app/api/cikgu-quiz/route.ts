import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";
import { getCikguDb } from "@/lib/cikgu-db";

export const runtime = "nodejs";

type QuestionEdit = { question: string; choices: string[]; answer: string; explanation: string };
type Correction = { questionId: string; original: unknown; corrected: unknown };
type QuizBody = { id?: string; ownerToken?: string; bankKey?: string; questionIds?: string[]; edits?: Record<string, QuestionEdit>; corrections?: Correction[]; theme?: string };

const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
const valid = (body: QuizBody) => Boolean(body.id && body.ownerToken && body.bankKey && Array.isArray(body.questionIds) && body.questionIds.length);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as QuizBody;
    if (!valid(body)) return NextResponse.json({ error: "Maklumat kuiz tidak lengkap." }, { status: 400 });
    const db = getCikguDb();
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        "INSERT INTO teacher_quizzes (id, owner_token_hash, source_bank, question_ids, question_overrides, theme) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6)",
        [body.id, tokenHash(body.ownerToken!), body.bankKey, JSON.stringify(body.questionIds), JSON.stringify(body.edits ?? {}), body.theme ?? "coral"],
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
