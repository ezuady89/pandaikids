import { createHash } from "crypto";
import { getCikguDb } from "@/lib/cikgu-db";
import { readTeacherQuota } from "@/lib/cikgu-quota";
import { ensureCommerceTables } from "@/lib/teacher-commerce";

export type TeacherDashboardQuiz = {
  id: string;
  source_bank: string;
  created_at: Date;
  published_at: Date | null;
  title: string;
  subject: string | null;
  year: string | null;
  access_mode: "delima" | "open";
  question_count: number;
  responses: number;
  students: number;
  average: number;
  last_response: Date | null;
};

export type TeacherQuizAttempt = {
  id: string;
  student_name: string;
  score: number;
  total: number;
  duration_seconds: number;
  completed_at: Date;
  rank: number;
};

const quizSelect = `
  SELECT
    q.id,
    q.source_bank,
    q.created_at,
    q.published_at,
    COALESCE(
      NULLIF(sample.value->>'topic',''),
      CASE
        WHEN q.source_bank='custom' THEN 'Kuiz Cikgu'
        ELSE initcap(replace(replace(q.source_bank,'-',' '),'_',' '))
      END
    ) AS title,
    NULLIF(sample.value->>'subject','') AS subject,
    NULLIF(sample.value->>'year','') AS "year",
    CASE
      WHEN q.question_overrides->'__settings'->>'accessMode'='delima' THEN 'delima'
      ELSE 'open'
    END AS access_mode,
    jsonb_array_length(COALESCE(q.question_ids,'[]'::jsonb))::int AS question_count,
    COALESCE(stats.responses,0)::int AS responses,
    COALESCE(stats.students,0)::int AS students,
    COALESCE(stats.average,0)::int AS average,
    stats.last_response
  FROM teacher_quizzes q
  LEFT JOIN LATERAL (
    SELECT value
    FROM jsonb_each(COALESCE(q.question_overrides,'{}'::jsonb))
    WHERE key<>'__settings'
    ORDER BY key
    LIMIT 1
  ) sample ON true
  LEFT JOIN LATERAL (
    SELECT
      COUNT(*)::int responses,
      COUNT(DISTINCT lower(student_name))::int students,
      ROUND(AVG(score::numeric/NULLIF(total,0))*100)::int average,
      MAX(completed_at) AS last_response
    FROM quiz_attempts
    WHERE quiz_id=q.id
  ) stats ON true
`;

export async function getTeacherDashboard(teacherId: string) {
  await ensureCommerceTables();
  const db = getCikguDb();
  const quotaKey = createHash("sha256").update(teacherId).digest("hex");
  const [quota, quizzes, subscription, summary] = await Promise.all([
    readTeacherQuota(quotaKey, teacherId),
    db.query(`${quizSelect} WHERE q.teacher_id=$1 ORDER BY q.created_at DESC LIMIT 100`, [teacherId]),
    db.query(
      `SELECT plan_id,ends_at
       FROM teacher_subscriptions
       WHERE teacher_id=$1 AND starts_at<=NOW() AND ends_at>NOW() AND cancelled_at IS NULL
       ORDER BY CASE plan_id WHEN 'pro' THEN 2 ELSE 1 END DESC, ends_at DESC
       LIMIT 1`,
      [teacherId],
    ),
    db.query(
      `SELECT
         COUNT(DISTINCT q.id)::int activities,
         COUNT(a.id)::int responses,
         COALESCE(ROUND(AVG(a.score::numeric/NULLIF(a.total,0))*100),0)::int average,
         COUNT(DISTINCT lower(a.student_name))::int students
       FROM teacher_quizzes q
       LEFT JOIN quiz_attempts a ON a.quiz_id=q.id
       WHERE q.teacher_id=$1`,
      [teacherId],
    ),
  ]);

  return {
    quota,
    quizzes: quizzes.rows as TeacherDashboardQuiz[],
    subscription: subscription.rows[0] as { plan_id: string; ends_at: Date } | undefined,
    summary: summary.rows[0] as { activities: number; responses: number; average: number; students: number },
  };
}

export async function getTeacherQuizDetail(teacherId: string, quizId: string) {
  await ensureCommerceTables();
  const db = getCikguDb();
  const quiz = await db.query(`${quizSelect} WHERE q.teacher_id=$1 AND q.id=$2 LIMIT 1`, [teacherId, quizId]);
  if (!quiz.rowCount) return undefined;

  const attempts = await db.query(
    `SELECT
       id,
       student_name,
       score::int,
       total::int,
       duration_seconds::int,
       completed_at,
       (ROW_NUMBER() OVER (
         ORDER BY score DESC,duration_seconds ASC,completed_at ASC
       ))::int AS rank
     FROM quiz_attempts
     WHERE quiz_id=$1
     ORDER BY score DESC,duration_seconds ASC,completed_at ASC
     LIMIT 1000`,
    [quizId],
  );

  return {
    quiz: quiz.rows[0] as TeacherDashboardQuiz,
    attempts: attempts.rows as TeacherQuizAttempt[],
  };
}
