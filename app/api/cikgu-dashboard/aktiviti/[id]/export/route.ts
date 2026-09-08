import { NextRequest, NextResponse } from "next/server";
import { getCikguDb } from "@/lib/cikgu-db";
import { readTeacherSession } from "@/lib/teacher-auth";

export const runtime = "nodejs";

function cell(value: unknown) {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = readTeacherSession(request);
  if (!session) return NextResponse.json({ error: "Log masuk diperlukan." }, { status: 401 });

  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "ID kuiz tidak sah." }, { status: 400 });
  }

  const db = getCikguDb();
  const owner = await db.query(
    "SELECT id FROM teacher_quizzes WHERE id=$1 AND teacher_id=$2 LIMIT 1",
    [id, session.teacherId],
  );
  if (!owner.rowCount) {
    return NextResponse.json({ error: "Kuiz tidak ditemui." }, { status: 404 });
  }

  const result = await db.query(
    `SELECT
       (ROW_NUMBER() OVER (ORDER BY score DESC,duration_seconds ASC,completed_at ASC))::int kedudukan,
       student_name,
       score::int,
       total::int,
       ROUND(score::numeric/NULLIF(total,0)*100)::int peratus,
       duration_seconds::int,
       completed_at
     FROM quiz_attempts
     WHERE quiz_id=$1
     ORDER BY score DESC,duration_seconds ASC,completed_at ASC
     LIMIT 10000`,
    [id],
  );

  const headers = ["Kedudukan", "Nama murid", "Markah", "Jumlah soalan", "Peratus", "Masa (saat)", "Dihantar"];
  const rows = result.rows.map((row) => [
    row.kedudukan,
    row.student_name,
    row.score,
    row.total,
    row.peratus,
    row.duration_seconds,
    new Date(row.completed_at).toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" }),
  ]);
  const csv = "\uFEFF" + [headers, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pandaikids-keputusan-${id.slice(0, 8)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
