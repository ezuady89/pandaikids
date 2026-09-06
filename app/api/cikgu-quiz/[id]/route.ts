import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID, timingSafeEqual } from "crypto";
import { getCikguDb } from "@/lib/cikgu-db";

export const runtime = "nodejs";

type QuestionEdit = { question: string; choices: string[]; answer: string; explanation: string };
type CustomQuestion = QuestionEdit & { id: string; subject: string; year: number; topic: string };
type Correction = { questionId: string; original: unknown; corrected: unknown };
type QuizBody = { ownerToken?: string; edits?: Record<string, QuestionEdit>; customQuestions?: CustomQuestion[]; corrections?: Correction[]; theme?: string; accessMode?: "delima" | "open"; teacherName?: string };
const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
const sameToken = (left: string, right: string) => timingSafeEqual(Buffer.from(left), Buffer.from(right));

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await getCikguDb().query("SELECT id, source_bank, question_ids, question_overrides, theme, published_at FROM teacher_quizzes WHERE id = $1", [id]);
    if (!result.rowCount) return NextResponse.json({ error: "Kuiz tidak ditemui." }, { status: 404 });
    const row = result.rows[0];
    const stored = row.question_overrides && typeof row.question_overrides === "object" ? row.question_overrides : {};
    const { __settings, ...questionOverrides } = stored;
    const accessMode = __settings?.accessMode === "delima" ? "delima" : "open";
    const teacherName = String(__settings?.teacherName ?? "");
    const questions = row.source_bank === "custom"
      ? row.question_ids.map((questionId: string) => questionOverrides[questionId]).filter(Boolean)
      : undefined;
    return NextResponse.json({ ...row, question_overrides: questionOverrides, access_mode: accessMode, teacher_name: teacherName, questions });
  } catch (error) {
    console.error("Tidak dapat membaca kuiz cikgu", error);
    return NextResponse.json({ error: "Kuiz belum dapat dibuka." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as QuizBody;
    if (!body.ownerToken) return NextResponse.json({ error: "Sesi cikgu tidak ditemui pada peranti ini." }, { status: 403 });
    const db = getCikguDb();
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const owner = await client.query("SELECT owner_token_hash, source_bank FROM teacher_quizzes WHERE id = $1 FOR UPDATE", [id]);
      if (!owner.rowCount) { await client.query("ROLLBACK"); return NextResponse.json({ error: "Kuiz tidak ditemui." }, { status: 404 }); }
      if (!sameToken(owner.rows[0].owner_token_hash, tokenHash(body.ownerToken))) { await client.query("ROLLBACK"); return NextResponse.json({ error: "Kuiz ini hanya boleh dikemas kini oleh cikgu yang menerbitkannya." }, { status: 403 }); }
      const sourceBank = owner.rows[0].source_bank;
      if (sourceBank === "custom" && (!Array.isArray(body.customQuestions) || !body.customQuestions.length)) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "Soalan kuiz sendiri tidak lengkap." }, { status: 400 });
      }
      const questionOverrides = sourceBank === "custom"
        ? Object.fromEntries(body.customQuestions!.map((question) => [question.id, question]))
        : { ...(body.edits ?? {}) };
      const storedOverrides = { ...questionOverrides, __settings: { accessMode: body.accessMode === "delima" ? "delima" : "open", teacherName: String(body.teacherName ?? "").trim().replace(/^(?:Cikgu+\s*)+/i, "").replace(/\s+/g, " ").slice(0, 80) } };
      await client.query("UPDATE teacher_quizzes SET question_overrides = $1::jsonb, theme = $2, updated_at = NOW() WHERE id = $3", [JSON.stringify(storedOverrides), body.theme ?? "coral", id]);
      for (const correction of body.corrections ?? []) {
        await client.query("DELETE FROM bank_question_corrections WHERE quiz_id = $1 AND question_id = $2", [id, correction.questionId]);
        await client.query("INSERT INTO bank_question_corrections (id, quiz_id, question_id, original_question, corrected_question) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb)", [randomUUID(), id, correction.questionId, JSON.stringify(correction.original), JSON.stringify(correction.corrected)]);
      }
      await client.query("COMMIT");
      return NextResponse.json({ id });
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  } catch (error) {
    console.error("Tidak dapat mengemas kini kuiz cikgu", error);
    return NextResponse.json({ error: "Perubahan belum dapat disimpan." }, { status: 500 });
  }
}
