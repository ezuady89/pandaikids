import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCikguDb } from "@/lib/cikgu-db";

export const runtime = "nodejs";

type AttemptBody = {
  studentName?: string;
  score?: number;
  total?: number;
  durationSeconds?: number;
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: quizId } = await params;
  const body = await request.json() as AttemptBody;
  const studentName = String(body.studentName ?? "").trim().replace(/\s+/g, " ").slice(0, 60);
  const score = Number(body.score);
  const total = Number(body.total);
  const durationSeconds = Math.max(0, Math.round(Number(body.durationSeconds)));

  if (!studentName || !Number.isInteger(score) || !Number.isInteger(total) || total < 1 || total > 500 || score < 0 || score > total || !Number.isFinite(durationSeconds) || durationSeconds > 86400) {
    return NextResponse.json({ error: "Keputusan murid tidak lengkap." }, { status: 400 });
  }

  const client = await getCikguDb().connect();
  try {
    await client.query("BEGIN");
    const quiz = await client.query("SELECT 1 FROM teacher_quizzes WHERE id = $1", [quizId]);
    if (!quiz.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Kuiz tidak ditemui." }, { status: 404 });
    }

    const attempt = await client.query(
      "INSERT INTO quiz_attempts (id, quiz_id, student_name, score, total, duration_seconds) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, completed_at",
      [randomUUID(), quizId, studentName, score, total, durationSeconds],
    );
    const ranking = await client.query(
      `SELECT
        1 + COUNT(*) FILTER (
          WHERE score > $2
             OR (score = $2 AND duration_seconds < $3)
             OR (score = $2 AND duration_seconds = $3 AND completed_at < $4)
        )::integer AS rank,
        COUNT(*)::integer AS participant_count
       FROM quiz_attempts
       WHERE quiz_id = $1`,
      [quizId, score, durationSeconds, attempt.rows[0].completed_at],
    );
    await client.query("COMMIT");

    return NextResponse.json({
      attemptId: attempt.rows[0].id,
      studentName,
      rank: ranking.rows[0].rank,
      participantCount: ranking.rows[0].participant_count,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Tidak dapat menyimpan keputusan murid", error);
    return NextResponse.json({ error: "Keputusan belum dapat disimpan." }, { status: 500 });
  } finally {
    client.release();
  }
}
