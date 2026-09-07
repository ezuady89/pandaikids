import { getCikguDb } from "@/lib/cikgu-db";

export type AdminRange = { key: string; from: Date; to: Date; previousFrom: Date };

export function resolveAdminRange(key = "30d", from?: string, to?: string): AdminRange {
  const now = new Date();
  const malaysiaNow = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  let end = to && /^\d{4}-\d{2}-\d{2}$/.test(to) ? new Date(`${to}T23:59:59.999+08:00`) : now;
  let start: Date;
  if (key === "custom" && from && /^\d{4}-\d{2}-\d{2}$/.test(from)) start = new Date(`${from}T00:00:00+08:00`);
  else if (key === "today") start = new Date(`${malaysiaNow.toISOString().slice(0, 10)}T00:00:00+08:00`);
  else if (key === "7d") start = new Date(end.getTime() - 7 * 86400000);
  else if (key === "month") start = new Date(`${malaysiaNow.toISOString().slice(0, 7)}-01T00:00:00+08:00`);
  else start = new Date(end.getTime() - 30 * 86400000);
  if (start > end) [start, end] = [end, start];
  const duration = Math.max(86400000, end.getTime() - start.getTime());
  return { key, from: start, to: end, previousFrom: new Date(start.getTime() - duration) };
}

export async function getOverview(range: AdminRange) {
  const db = getCikguDb();
  const values = [range.from, range.to, range.previousFrom];
  const [metrics, previous, alerts, revenueSeries, funnel, latestPayments, latestTeachers, topActivities, expiring, errors] = await Promise.all([
    db.query(`SELECT
      COALESCE((SELECT SUM(amount_cents) FROM teacher_payment_orders WHERE status='PAID' AND paid_at BETWEEN $1 AND $2),0)::bigint revenue,
      COALESCE((SELECT SUM(amount_cents) FROM teacher_payment_orders WHERE status='PAID' AND paid_at >= date_trunc('day',NOW() AT TIME ZONE 'Asia/Kuala_Lumpur') AT TIME ZONE 'Asia/Kuala_Lumpur'),0)::bigint revenue_today,
      COALESCE((SELECT SUM(amount_cents) FROM teacher_payment_orders WHERE status='PAID' AND paid_at >= date_trunc('month',NOW() AT TIME ZONE 'Asia/Kuala_Lumpur') AT TIME ZONE 'Asia/Kuala_Lumpur'),0)::bigint revenue_month,
      (SELECT COUNT(*) FROM teacher_accounts)::int teachers,
      (SELECT COUNT(*) FROM teacher_accounts WHERE last_login_at BETWEEN $1 AND $2)::int active_teachers,
      (SELECT COUNT(*) FROM teacher_subscriptions WHERE starts_at <= NOW() AND ends_at > NOW() AND cancelled_at IS NULL)::int active_subscriptions,
      (SELECT COUNT(*) FROM teacher_subscriptions WHERE plan_id='plus' AND starts_at <= NOW() AND ends_at > NOW() AND cancelled_at IS NULL)::int plus,
      (SELECT COUNT(*) FROM teacher_subscriptions WHERE plan_id='pro' AND starts_at <= NOW() AND ends_at > NOW() AND cancelled_at IS NULL)::int pro,
      (SELECT COUNT(*) FROM quiz_attempts WHERE completed_at BETWEEN $1 AND $2)::int attempts,
      (SELECT COUNT(DISTINCT lower(student_name)) FROM quiz_attempts WHERE completed_at BETWEEN $1 AND $2)::int active_students,
      COALESCE((SELECT SUM(ai_generated) FROM teacher_monthly_usage WHERE updated_at BETWEEN $1 AND $2),0)::int ai`, values),
    db.query(`SELECT
      COALESCE((SELECT SUM(amount_cents) FROM teacher_payment_orders WHERE status='PAID' AND paid_at BETWEEN $3 AND $1),0)::bigint revenue,
      (SELECT COUNT(*) FROM teacher_accounts WHERE last_login_at BETWEEN $3 AND $1)::int active_teachers,
      (SELECT COUNT(*) FROM quiz_attempts WHERE completed_at BETWEEN $3 AND $1)::int attempts,
      (SELECT COUNT(DISTINCT lower(student_name)) FROM quiz_attempts WHERE completed_at BETWEEN $3 AND $1)::int active_students`, values),
    db.query(`SELECT 'Bayaran berjaya belum aktif' label, COUNT(*)::int count FROM teacher_payment_orders o WHERE o.status='PAID' AND NOT EXISTS (SELECT 1 FROM teacher_subscriptions s WHERE s.payment_order_id=o.id)
      UNION ALL SELECT 'Bayaran pending lebih 30 minit', COUNT(*)::int FROM teacher_payment_orders WHERE status='PENDING' AND created_at < NOW()-INTERVAL '30 minutes'
      UNION ALL SELECT 'Langganan tamat dalam 3 hari', COUNT(*)::int FROM teacher_subscriptions WHERE cancelled_at IS NULL AND ends_at BETWEEN NOW() AND NOW()+INTERVAL '3 days'
      UNION ALL SELECT 'Langganan telah tamat', COUNT(*)::int FROM teacher_subscriptions WHERE ends_at < NOW()
      UNION ALL SELECT 'Permintaan AI gagal', COUNT(*)::int FROM admin_system_events WHERE event_type='AI' AND status='FAILED' AND created_at BETWEEN $1 AND $2
      UNION ALL SELECT 'Kuota mencapai 80%', COUNT(*)::int FROM teacher_monthly_usage u WHERE u.period_start=date_trunc('month',NOW())::date AND (u.ai_generated>=3 OR u.manual_published>=5)`, values.slice(0,2)),
    db.query(`SELECT to_char((day AT TIME ZONE 'Asia/Kuala_Lumpur')::date,'DD Mon') label, amount::bigint value FROM generate_series(date_trunc('day',$1::timestamptz),date_trunc('day',$2::timestamptz),INTERVAL '1 day') day LEFT JOIN LATERAL (SELECT COALESCE(SUM(amount_cents),0) amount FROM teacher_payment_orders WHERE status='PAID' AND paid_at>=day AND paid_at<day+INTERVAL '1 day') p ON true ORDER BY day`, values.slice(0,2)),
    db.query(`SELECT stage, COUNT(*)::int value FROM admin_commerce_events WHERE created_at BETWEEN $1 AND $2 GROUP BY stage`, values.slice(0,2)),
    db.query(`SELECT o.id,o.created_at,o.plan_id,o.amount_cents,o.status,o.external_reference,t.name,t.email FROM teacher_payment_orders o JOIN teacher_accounts t ON t.id=o.teacher_id ORDER BY o.created_at DESC LIMIT 5`),
    db.query(`SELECT id,name,email,created_at,last_login_at FROM teacher_accounts ORDER BY created_at DESC LIMIT 5`),
    db.query(`SELECT q.id,q.source_bank,COUNT(a.id)::int responses,ROUND(AVG(a.score::numeric/NULLIF(a.total,0))*100)::int average FROM teacher_quizzes q LEFT JOIN quiz_attempts a ON a.quiz_id=q.id GROUP BY q.id ORDER BY responses DESC,q.created_at DESC LIMIT 5`),
    db.query(`SELECT s.id,s.plan_id,s.ends_at,t.name,t.email,CEIL(EXTRACT(EPOCH FROM(s.ends_at-NOW()))/86400)::int days_left FROM teacher_subscriptions s JOIN teacher_accounts t ON t.id=s.teacher_id WHERE s.cancelled_at IS NULL AND s.ends_at BETWEEN NOW() AND NOW()+INTERVAL '14 days' ORDER BY s.ends_at LIMIT 5`),
    db.query(`SELECT event_type,route,status,message,created_at FROM admin_system_events WHERE status<>'SUCCESS' ORDER BY created_at DESC LIMIT 5`),
  ]);
  return { metrics: metrics.rows[0], previous: previous.rows[0], alerts: alerts.rows, revenueSeries: revenueSeries.rows, funnel: funnel.rows, latestPayments: latestPayments.rows, latestTeachers: latestTeachers.rows, topActivities: topActivities.rows, expiring: expiring.rows, errors: errors.rows };
}

export async function getUsers(input: {q?: string; plan?: string; status?: string; page?: number}) {
  const page = Math.max(1, input.page ?? 1), limit = 20, offset = (page - 1) * limit;
  const q = `%${input.q?.trim() ?? ""}%`, plan = input.plan ?? "all", status = input.status ?? "all";
  const db = getCikguDb();
  const base = `FROM teacher_accounts t LEFT JOIN LATERAL (SELECT s.* FROM teacher_subscriptions s WHERE s.teacher_id=t.id ORDER BY s.ends_at DESC LIMIT 1) s ON true LEFT JOIN LATERAL (SELECT COUNT(*)::int activities FROM teacher_quizzes q WHERE q.teacher_id=t.id) qa ON true LEFT JOIN LATERAL (SELECT COALESCE(SUM(amount_cents),0)::bigint paid FROM teacher_payment_orders o WHERE o.teacher_id=t.id AND o.status='PAID') po ON true WHERE (t.name ILIKE $1 OR t.email ILIKE $1) AND ($2='all' OR COALESCE(s.plan_id,'free')=$2) AND ($3='all' OR ($3='active' AND s.ends_at>NOW() AND s.cancelled_at IS NULL) OR ($3='expired' AND s.ends_at<=NOW()) OR ($3='none' AND s.id IS NULL))`;
  const [rows,count,subscriptions] = await Promise.all([
    db.query(`SELECT t.id,t.name,t.email,t.created_at,t.last_login_at,COALESCE(s.plan_id,'free') plan_id,s.starts_at,s.ends_at,s.cancelled_at,COALESCE(qa.activities,0)::int activities,COALESCE(po.paid,0)::bigint paid ${base} ORDER BY t.created_at DESC LIMIT $4 OFFSET $5`,[q,plan,status,limit,offset]),
    db.query(`SELECT COUNT(*)::int count ${base}`,[q,plan,status]),
    db.query(`SELECT s.id,s.teacher_id,t.name,t.email,s.plan_id,s.starts_at,s.ends_at,s.cancelled_at,s.source,s.payment_order_id,CEIL(EXTRACT(EPOCH FROM(s.ends_at-NOW()))/86400)::int days_left FROM teacher_subscriptions s JOIN teacher_accounts t ON t.id=s.teacher_id ORDER BY s.ends_at DESC LIMIT 100`),
  ]);
  return { rows: rows.rows, total: count.rows[0].count, page, pages: Math.max(1,Math.ceil(count.rows[0].count/limit)), subscriptions: subscriptions.rows };
}

export async function getTeacherDetail(id:string) {
  const db=getCikguDb();
  const [teacher,subscriptions,payments,activities,usage,audits]=await Promise.all([
    db.query("SELECT id,name,email,created_at,updated_at,last_login_at FROM teacher_accounts WHERE id=$1",[id]),
    db.query("SELECT * FROM teacher_subscriptions WHERE teacher_id=$1 ORDER BY starts_at DESC",[id]),
    db.query("SELECT id,plan_id,amount_cents,status,toyyibpay_bill_code,external_reference,paid_at,created_at FROM teacher_payment_orders WHERE teacher_id=$1 ORDER BY created_at DESC",[id]),
    db.query("SELECT q.id,q.source_bank,q.created_at,COUNT(a.id)::int responses,ROUND(AVG(a.score::numeric/NULLIF(a.total,0))*100)::int average FROM teacher_quizzes q LEFT JOIN quiz_attempts a ON a.quiz_id=q.id WHERE q.teacher_id=$1 GROUP BY q.id ORDER BY q.created_at DESC LIMIT 50",[id]),
    db.query("SELECT period_start,manual_published,ai_generated,updated_at FROM teacher_monthly_usage WHERE teacher_id=$1 ORDER BY period_start DESC",[id]),
    db.query("SELECT * FROM admin_audit_logs WHERE target_id=$1 ORDER BY created_at DESC LIMIT 50",[id])
  ]);
  return {teacher:teacher.rows[0],subscriptions:subscriptions.rows,payments:payments.rows,activities:activities.rows,usage:usage.rows,audits:audits.rows};
}

export async function getActivities(input:{q?:string;page?:number}) {
  const page=Math.max(1,input.page??1),limit=20,offset=(page-1)*limit,q=`%${input.q?.trim()??""}%`,db=getCikguDb();
  const [rows,count,summary,series]=await Promise.all([
    db.query(`SELECT q.id,q.source_bank,q.created_at,q.published_at,q.updated_at,t.name teacher_name,COUNT(a.id)::int responses,COUNT(DISTINCT lower(a.student_name))::int students,ROUND(AVG(a.score::numeric/NULLIF(a.total,0))*100)::int average,MAX(a.completed_at) last_used FROM teacher_quizzes q LEFT JOIN teacher_accounts t ON t.id=q.teacher_id LEFT JOIN quiz_attempts a ON a.quiz_id=q.id WHERE q.id ILIKE $1 OR COALESCE(t.name,'') ILIKE $1 GROUP BY q.id,t.name ORDER BY q.created_at DESC LIMIT $2 OFFSET $3`,[q,limit,offset]),
    db.query(`SELECT COUNT(*)::int count FROM teacher_quizzes q LEFT JOIN teacher_accounts t ON t.id=q.teacher_id WHERE q.id ILIKE $1 OR COALESCE(t.name,'') ILIKE $1`,[q]),
    db.query(`SELECT (SELECT COUNT(*) FROM teacher_quizzes)::int activities,(SELECT COUNT(*) FROM quiz_attempts)::int responses,(SELECT COUNT(*) FROM teacher_quizzes q WHERE EXISTS(SELECT 1 FROM quiz_attempts a WHERE a.quiz_id=q.id))::int used,COALESCE((SELECT ROUND(AVG(score::numeric/NULLIF(total,0))*100) FROM quiz_attempts),0)::int average`),
    db.query(`SELECT to_char(day::date,'DD Mon') label,COUNT(a.id)::int value FROM generate_series(NOW()-INTERVAL '13 days',NOW(),INTERVAL '1 day') day LEFT JOIN quiz_attempts a ON a.completed_at>=day AND a.completed_at<day+INTERVAL '1 day' GROUP BY day ORDER BY day`)
  ]);
  return {rows:rows.rows,total:count.rows[0].count,page,pages:Math.max(1,Math.ceil(count.rows[0].count/limit)),summary:summary.rows[0],series:series.rows};
}

export async function getFinance(input:{q?:string;status?:string;plan?:string;page?:number}) {
  const page=Math.max(1,input.page??1),limit=20,offset=(page-1)*limit,q=`%${input.q?.trim()??""}%`,status=input.status??"all",plan=input.plan??"all",db=getCikguDb();
  const where=`WHERE (o.external_reference ILIKE $1 OR COALESCE(o.toyyibpay_bill_code,'') ILIKE $1 OR t.email ILIKE $1) AND ($2='all' OR o.status=$2) AND ($3='all' OR o.plan_id=$3)`;
  const [rows,count,summary,series]=await Promise.all([
    db.query(`SELECT o.*,t.name,t.email,s.ends_at,s.id subscription_id,CASE WHEN o.status='PAID' AND s.id IS NULL THEN 'PERLU_SEMAKAN' WHEN s.id IS NOT NULL THEN 'AKTIF' ELSE 'TIADA' END activation_status ${where} FROM teacher_payment_orders o JOIN teacher_accounts t ON t.id=o.teacher_id LEFT JOIN teacher_subscriptions s ON s.payment_order_id=o.id ORDER BY o.created_at DESC LIMIT $4 OFFSET $5`,[q,status,plan,limit,offset]),
    db.query(`SELECT COUNT(*)::int count FROM teacher_payment_orders o JOIN teacher_accounts t ON t.id=o.teacher_id ${where}`,[q,status,plan]),
    db.query(`SELECT COALESCE(SUM(amount_cents) FILTER(WHERE status='PAID'),0)::bigint revenue,COUNT(*) FILTER(WHERE status='PAID')::int paid,COUNT(*) FILTER(WHERE status='PENDING')::int pending,COUNT(*) FILTER(WHERE status IN('FAILED','CREATE_FAILED'))::int failed,COALESCE(SUM(amount_cents) FILTER(WHERE status='PAID' AND plan_id='plus'),0)::bigint plus,COALESCE(SUM(amount_cents) FILTER(WHERE status='PAID' AND plan_id='pro'),0)::bigint pro FROM teacher_payment_orders`),
    db.query(`SELECT to_char(day::date,'DD Mon') label,COALESCE(SUM(o.amount_cents),0)::bigint value FROM generate_series(NOW()-INTERVAL '29 days',NOW(),INTERVAL '1 day') day LEFT JOIN teacher_payment_orders o ON o.status='PAID' AND o.paid_at>=day AND o.paid_at<day+INTERVAL '1 day' GROUP BY day ORDER BY day`)
  ]);
  return {rows:rows.rows,total:count.rows[0].count,page,pages:Math.max(1,Math.ceil(count.rows[0].count/limit)),summary:summary.rows[0],series:series.rows};
}

export async function getAiQuota() {
  const db=getCikguDb();
  const [rows,failures]=await Promise.all([
    db.query(`SELECT t.id,t.name,t.email,COALESCE(s.plan_id,'free') plan_id,u.period_start,u.ai_generated,u.manual_published,CASE COALESCE(s.plan_id,'free') WHEN 'pro' THEN 100 WHEN 'plus' THEN 30 ELSE 3 END ai_limit,CASE COALESCE(s.plan_id,'free') WHEN 'pro' THEN 200 WHEN 'plus' THEN 50 ELSE 5 END manual_limit FROM teacher_monthly_usage u LEFT JOIN teacher_accounts t ON t.id=u.teacher_id LEFT JOIN LATERAL(SELECT plan_id FROM teacher_subscriptions x WHERE x.teacher_id=t.id AND x.ends_at>NOW() AND x.cancelled_at IS NULL ORDER BY ends_at DESC LIMIT 1)s ON true ORDER BY u.ai_generated DESC LIMIT 100`),
    db.query(`SELECT e.created_at,e.route,e.status,e.message,t.name,t.email FROM admin_system_events e LEFT JOIN teacher_accounts t ON t.id=e.teacher_id WHERE e.event_type='AI' AND e.status='FAILED' ORDER BY e.created_at DESC LIMIT 50`)
  ]);
  return {rows:rows.rows,failures:failures.rows};
}

export async function getSystem() {
  const db=getCikguDb(),started=Date.now();
  const [events,audits,callback]=await Promise.all([
    db.query(`SELECT e.*,t.name,t.email FROM admin_system_events e LEFT JOIN teacher_accounts t ON t.id=e.teacher_id ORDER BY e.created_at DESC LIMIT 100`),
    db.query(`SELECT * FROM admin_audit_logs ORDER BY created_at DESC LIMIT 100`),
    db.query(`SELECT COUNT(*) FILTER(WHERE event_type='TOYYIBPAY_CALLBACK' AND status='SUCCESS')::int success,COUNT(*) FILTER(WHERE event_type='TOYYIBPAY_CALLBACK' AND status<>'SUCCESS')::int failed FROM admin_system_events`)
  ]);
  return {events:events.rows,audits:audits.rows,callback:callback.rows[0],databaseMs:Date.now()-started,config:{database:Boolean(process.env.DATABASE_URL),toyyibpaySecret:Boolean(process.env.TOYYIBPAY_SECRET_KEY),toyyibpayCategory:Boolean(process.env.TOYYIBPAY_CATEGORY_CODE),appUrl:Boolean(process.env.PANDAIKIDS_APP_URL),sessionSecret:Boolean(process.env.PANDAIKIDS_SESSION_SECRET),adminAllowlist:Boolean(process.env.PANDAIKIDS_ADMIN_EMAILS)},version:process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,7)??"local"};
}
