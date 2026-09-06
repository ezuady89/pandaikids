import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";
import { getCikguDb } from "@/lib/cikgu-db";
import { FREE_TEACHER_PLAN } from "@/lib/cikgu-plans";
import { attachTeacherQuotaCookie, claimTeacherQuota, getTeacherQuotaIdentity, validAiReceipt } from "@/lib/cikgu-quota";

export const runtime = "nodejs";

type QuestionEdit = { question: string; choices: string[]; answer: string; explanation: string };
type CustomQuestion = QuestionEdit & { id: string; subject: string; year: number; topic: string };
type Correction = { questionId: string; original: unknown; corrected: unknown };
type QuizBody = { id?: string; ownerToken?: string; bankKey?: string; questionIds?: string[]; edits?: Record<string, QuestionEdit>; customQuestions?: CustomQuestion[]; corrections?: Correction[]; theme?: string; accessMode?: "delima" | "open"; teacherName?: string; creationMethod?: "manual" | "ai" | "ready"; aiReceipt?: string };

const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
const validQuestion = (question: CustomQuestion) => Boolean(
  question?.id && question.subject && Number.isInteger(question.year) && question.year >= 1 && question.year <= 6 &&
  question.topic && question.question && Array.isArray(question.choices) && question.choices.length >= 3 && question.choices.length <= 4 &&
  question.choices.every((choice) => String(choice).trim()) && /^[A-D]$/.test(question.answer) && question.answer.charCodeAt(0) - 64 <= question.choices.length,
);
const valid = (body: QuizBody) => Boolean(
  body.id && body.ownerToken && body.bankKey && Array.isArray(body.questionIds) && body.questionIds.length && body.questionIds.length <= FREE_TEACHER_PLAN.questionLimit &&
  (body.bankKey !== "custom" || (Array.isArray(body.customQuestions) && body.customQuestions.length === body.questionIds.length && body.customQuestions.every(validQuestion))),
);

export async function POST(request: NextRequest) {
  const identity = getTeacherQuotaIdentity(request);
  try {
    const body = await request.json() as QuizBody;
    if (!valid(body)) return attachTeacherQuotaCookie(NextResponse.json({ error: `Maklumat kuiz tidak lengkap atau melebihi ${FREE_TEACHER_PLAN.questionLimit} soalan.` }, { status: 400 }), identity);
    const db = getCikguDb();
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      let quota;
      const isAiQuiz = body.bankKey === "custom" && body.creationMethod === "ai" && validAiReceipt(body.aiReceipt, identity.key);
      if (body.bankKey === "custom" && !isAiQuiz) {
        quota = await claimTeacherQuota(identity.key, "manual", client);
        if (!quota) {
          await client.query("ROLLBACK");
          return attachTeacherQuotaCookie(NextResponse.json({
            code: "MANUAL_MONTHLY_LIMIT_REACHED",
            error: "5 kuiz Buat Sendiri percuma bulan ini telah diterbitkan. Draf cikgu masih disimpan.",
          }, { status: 429 }), identity);
        }
      }
      const questionOverrides = body.bankKey === "custom"
        ? Object.fromEntries(body.customQuestions!.map((question) => [question.id, question]))
        : { ...(body.edits ?? {}) };
      const storedOverrides = { ...questionOverrides, __settings: { accessMode: body.accessMode === "delima" ? "delima" : "open", teacherName: String(body.teacherName ?? "").trim().replace(/^(?:Cikgu+\s*)+/i, "").replace(/\s+/g, " ").slice(0, 80) } };
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
      return attachTeacherQuotaCookie(NextResponse.json({ id: body.id, quota }), identity);
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  } catch (error) {
    console.error("Tidak dapat menerbitkan kuiz cikgu", error);
    return attachTeacherQuotaCookie(NextResponse.json({ error: "Kuiz belum dapat diterbitkan. Cuba sebentar lagi." }, { status: 500 }), identity);
  }
}
