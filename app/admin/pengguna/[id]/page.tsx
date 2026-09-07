import { notFound } from "next/navigation";
import { Badge, Empty, fmtDate, money, PageHeader, Panel, TableWrap } from "@/components/admin/AdminShell";
import { SubscriptionActionForm } from "@/components/admin/SubscriptionActionForm";
import styles from "../../admin.module.css";
import { requireAdmin } from "@/lib/admin-auth";
import { getTeacherDetail } from "@/lib/admin-data";

export default async function TeacherDetailPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{ok?:string;error?:string}>}) {
  await requireAdmin("/admin/pengguna");
  const {id}=await params,p=await searchParams,data=await getTeacherDetail(id);
  if(!data.teacher) notFound();
  const t=data.teacher;
  return <>
    <PageHeader eyebrow="Butiran guru" title={t.name} description={`${t.email} · Daftar ${fmtDate(t.created_at)} · Login terakhir ${fmtDate(t.last_login_at)}`}/>
    {p.ok?<div className={styles.notice}>{p.ok}</div>:null}{p.error?<div className={`${styles.notice} ${styles.dangerNotice}`}>{p.error}</div>:null}
    <Panel title="Tindakan langganan" description="Semua tindakan perlu sebab, confirmation dan akan direkodkan."><SubscriptionActionForm teacherId={id}/></Panel>
    <div className={styles.twoCols}>
      <Panel title="Sejarah langganan">{data.subscriptions.length?<TableWrap><table><thead><tr><th>Pakej</th><th>Mula</th><th>Tamat</th><th>Status</th></tr></thead><tbody>{data.subscriptions.map(r=><tr key={r.id}><td>{r.plan_id}</td><td>{fmtDate(r.starts_at)}</td><td>{fmtDate(r.ends_at)}</td><td><Badge value={r.cancelled_at?"Dibatalkan":new Date(r.ends_at)>new Date()?"Aktif":"Tamat"}/></td></tr>)}</tbody></table></TableWrap>:<Empty/>}</Panel>
      <Panel title="Penggunaan kuota">{data.usage.length?<TableWrap><table><thead><tr><th>Tempoh</th><th>Manual</th><th>AI</th></tr></thead><tbody>{data.usage.map((r,i)=><tr key={i}><td>{String(r.period_start).slice(0,10)}</td><td>{r.manual_published}</td><td>{r.ai_generated}</td></tr>)}</tbody></table></TableWrap>:<Empty/>}</Panel>
    </div>
    <Panel title="Sejarah bayaran">{data.payments.length?<TableWrap><table><thead><tr><th>Masa</th><th>Pakej</th><th>Jumlah</th><th>Status</th><th>Rujukan</th></tr></thead><tbody>{data.payments.map(r=><tr key={r.id}><td>{fmtDate(r.created_at)}</td><td>{r.plan_id}</td><td>{money(r.amount_cents)}</td><td><Badge value={r.status}/></td><td>{r.external_reference}</td></tr>)}</tbody></table></TableWrap>:<Empty/>}</Panel>
    <div className={styles.twoCols}>
      <Panel title="Aktiviti terkini">{data.activities.length?<TableWrap><table><thead><tr><th>ID</th><th>Respons</th><th>Purata</th></tr></thead><tbody>{data.activities.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.responses}</td><td>{r.average??"—"}%</td></tr>)}</tbody></table></TableWrap>:<Empty/>}</Panel>
      <Panel title="Audit admin">{data.audits.length?<div className={styles.alertList}>{data.audits.map(r=><div className={styles.alert} key={r.id}><div><b>{r.action}</b><br/><small>{fmtDate(r.created_at)} · {r.reason}</small></div><Badge value={r.result}/></div>)}</div>:<Empty/>}</Panel>
    </div>
  </>;
}
