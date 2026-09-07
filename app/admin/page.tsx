import Link from "next/link";
import { Badge, Empty, fmtDate, KpiGrid, money, PageHeader, Panel, SimpleBars, TableWrap } from "@/components/admin/AdminShell";
import styles from "./admin.module.css";
import { getOverview, resolveAdminRange } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";
import { recordSystemEvent } from "@/lib/admin-events";

type Params={range?:string;from?:string;to?:string};
export default async function OverviewPage({searchParams}:{searchParams:Promise<Params>}){
  await requireAdmin("/admin");
  const p=await searchParams,range=resolveAdminRange(p.range,p.from,p.to);
  let data;
  try {
    data=await getOverview(range);
  } catch (error) {
    const message=(error instanceof Error?error.message:String(error))
      .replace(/postgres(?:ql)?:\/\/\S+/gi,"[database]")
      .replace(/AIza[\w-]+/g,"[secret]")
      .slice(0,400);
    await recordSystemEvent({eventType:"ADMIN",route:"/admin",status:"FAILED",message});
    return <section style={{padding:32,background:"white",borderRadius:24}}><h2>Data belum dapat dimuatkan</h2><p>Diagnosis server: <code>{message||"Ralat tidak dikenal pasti"}</code></p><p>Sila hantar paparan mesej ini untuk pembetulan tepat.</p></section>;
  }
  const m=data.metrics;
  const actionableAlerts=data.alerts.filter(a=>Number(a.count)>0);
  const recentRevenue=data.revenueSeries.slice(-7);
  return <>
    <PageHeader eyebrow="Pusat kawalan" title="Overview" description="Ringkasan penting Pandaikids. Butiran lengkap tersedia melalui menu di sebelah."/>
    <form className={styles.filters}><select name="range" defaultValue={range.key}><option value="today">Hari ini</option><option value="7d">7 hari</option><option value="30d">30 hari</option><option value="month">Bulan ini</option></select><button>Terapkan</button></form>
    <KpiGrid items={[
      {label:"Jualan bulan ini",value:money(m.revenue_month),hint:"Hanya transaksi PAID bulan semasa",href:"/admin/kewangan"},
      {label:"Guru berdaftar",value:m.teachers,href:"/admin/pengguna"},
      {label:"Langganan aktif",value:m.active_subscriptions,href:"/admin/pengguna?tab=langganan"},
      {label:"Aktiviti dijawab",value:m.attempts,hint:"Mengikut tempoh dipilih",href:"/admin/aktiviti"},
      {label:"Pelajar aktif",value:m.active_students,hint:"Mengikut tempoh dipilih",href:"/admin/aktiviti"},
      {label:"Penggunaan AI",value:m.ai,hint:"Mengikut tempoh dipilih",href:"/admin/ai-kuota"},
    ]}/>
    <div className={styles.twoCols}>
      <Panel title="Perlu tindakan">{actionableAlerts.length?<div className={styles.alertList}>{actionableAlerts.map(a=><Link href={String(a.label).includes("Bayaran")?"/admin/kewangan":"/admin/sistem"} className={styles.alert} key={a.label}><b>{a.label}</b><strong>{a.count}</strong></Link>)}</div>:<Empty text="Tiada perkara mendesak."/>}</Panel>
      <Panel title="Hasil 7 hari terakhir" description="Transaksi PAID sahaja.">{recentRevenue.length?<SimpleBars rows={recentRevenue} valueFormatter={money}/>:<Empty/>}</Panel>
    </div>
    <Panel title="Bayaran terkini" description="Lima transaksi terakhir.">{data.latestPayments.length?<TableWrap><table><thead><tr><th>Masa</th><th>Guru</th><th>Pakej</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>{data.latestPayments.map(r=><tr key={r.id}><td>{fmtDate(r.created_at)}</td><td>{r.name}<br/><small>{r.email}</small></td><td>{r.plan_id}</td><td>{money(r.amount_cents)}</td><td><Badge value={r.status}/></td></tr>)}</tbody></table></TableWrap>:<Empty/>}</Panel>
  </>;
}
