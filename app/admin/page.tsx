import Link from "next/link";
import { Badge, delta, Empty, fmtDate, KpiGrid, money, PageHeader, Panel, SimpleBars, TableWrap } from "@/components/admin/AdminShell";
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
  const m=data.metrics,prev=data.previous;
  const funnelStages=["PRICE_VISIT","PLAN_SELECTED","LOGIN","TOYYIBPAY_OPEN","PAYMENT_SUCCESS"],funnelLabels=["Lawat Harga","Pilih Pakej","Login","Buka ToyyibPay","Bayaran Berjaya"],funnelMap=new Map(data.funnel.map(r=>[r.stage,Number(r.value)]));
  const formatPct=(a:unknown,b:unknown)=>delta(a,b);
  return <>
    <PageHeader eyebrow="Pusat kawalan" title="Overview" description="Prestasi Pandaikids berdasarkan data sebenar. Semua masa laporan menggunakan Asia/Kuala_Lumpur." actions={<Link className={styles.secondaryButton} href="/admin/sistem">Semak sistem</Link>}/>
    <form className={styles.filters}><select name="range" defaultValue={range.key}><option value="today">Hari ini</option><option value="7d">7 hari</option><option value="30d">30 hari</option><option value="month">Bulan ini</option><option value="custom">Julat tersuai</option></select><input aria-label="Tarikh mula" type="date" name="from" defaultValue={p.from}/><input aria-label="Tarikh akhir" type="date" name="to" defaultValue={p.to}/><button>Terapkan</button></form>
    <KpiGrid items={[
      {label:"Jualan hari ini",value:money(m.revenue_today),hint:"Hanya transaksi PAID hari ini",href:"/admin/kewangan"},
      {label:"Jualan bulan ini",value:money(m.revenue_month),hint:"Hanya transaksi PAID bulan semasa",href:"/admin/kewangan"},
      {label:"Guru berdaftar",value:m.teachers,href:"/admin/pengguna"},{label:"Guru aktif",value:m.active_teachers,delta:formatPct(m.active_teachers,prev.active_teachers),href:"/admin/pengguna"},
      {label:"Langganan aktif",value:m.active_subscriptions,href:"/admin/pengguna?tab=langganan"},{label:"Cikgu Plus aktif",value:m.plus,href:"/admin/pengguna?plan=plus"},{label:"Cikgu Pro aktif",value:m.pro,href:"/admin/pengguna?plan=pro"},
      {label:"Aktiviti dijawab",value:m.attempts,delta:formatPct(m.attempts,prev.attempts),href:"/admin/aktiviti"},{label:"Pelajar aktif",value:m.active_students,delta:formatPct(m.active_students,prev.active_students),hint:"Pengenal nama unik dalam respons; tiada profil pelajar berasingan",href:"/admin/aktiviti"},{label:"Penggunaan AI",value:m.ai,href:"/admin/ai-kuota"},
    ]}/>
    <div className={styles.twoCols}>
      <Panel title="Perlu Tindakan" description="Keadaan yang patut disemak oleh pemilik."><div className={styles.alertList}>{data.alerts.map(a=><Link href={String(a.label).includes("Bayaran")?"/admin/kewangan":"/admin/sistem"} className={styles.alert} key={a.label}><b>{a.label}</b><strong>{a.count}</strong></Link>)}</div></Panel>
      <Panel title="Hasil dalam tempoh" description="Transaksi PAID sahaja.">{data.revenueSeries.length?<SimpleBars rows={data.revenueSeries} valueFormatter={money}/>:<Empty/>}</Panel>
    </div>
    <div className={styles.twoCols}>
      <Panel title="Funnel penukaran" description="Tracking dalaman bermula selepas deployment ini; tiada angka lampau direka."><SimpleBars rows={funnelStages.map((stage,i)=>({label:funnelLabels[i],value:funnelMap.get(stage)??0}))}/></Panel>
      <Panel title="Prestasi pakej" description="Ringkasan aktif dan hasil disahkan."><TableWrap><table><thead><tr><th>Pakej</th><th>Aktif</th><th>Hasil terkumpul</th></tr></thead><tbody><tr><td>Free</td><td>{Math.max(0,Number(m.teachers)-Number(m.active_subscriptions))}</td><td>RM0.00</td></tr><tr><td>Cikgu Plus</td><td>{m.plus}</td><td><Link href="/admin/kewangan?plan=plus">Lihat kewangan</Link></td></tr><tr><td>Cikgu Pro</td><td>{m.pro}</td><td><Link href="/admin/kewangan?plan=pro">Lihat kewangan</Link></td></tr></tbody></table></TableWrap></Panel>
    </div>
    <Panel title="Bayaran terkini">{data.latestPayments.length?<TableWrap><table><thead><tr><th>Masa</th><th>Guru</th><th>Pakej</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>{data.latestPayments.map(r=><tr key={r.id}><td>{fmtDate(r.created_at)}</td><td>{r.name}<br/><small>{r.email}</small></td><td>{r.plan_id}</td><td>{money(r.amount_cents)}</td><td><Badge value={r.status}/></td></tr>)}</tbody></table></TableWrap>:<Empty/>}</Panel>
    <div className={styles.twoCols}>
      <Panel title="Guru terbaru">{data.latestTeachers.length?<TableWrap><table><thead><tr><th>Guru</th><th>Daftar</th></tr></thead><tbody>{data.latestTeachers.map(r=><tr key={r.id}><td>{r.name}<br/><small>{r.email}</small></td><td>{fmtDate(r.created_at)}</td></tr>)}</tbody></table></TableWrap>:<Empty/>}</Panel>
      <Panel title="Aktiviti popular">{data.topActivities.length?<TableWrap><table><thead><tr><th>ID</th><th>Respons</th><th>Purata</th></tr></thead><tbody>{data.topActivities.map(r=><tr key={r.id}><td>{r.id}</td><td>{r.responses}</td><td>{r.average??"—"}%</td></tr>)}</tbody></table></TableWrap>:<Empty/>}</Panel>
    </div>
    <div className={styles.twoCols}>
      <Panel title="Langganan akan tamat">{data.expiring.length?<TableWrap><table><thead><tr><th>Guru</th><th>Pakej</th><th>Baki</th></tr></thead><tbody>{data.expiring.map(r=><tr key={r.id}><td>{r.name}</td><td>{r.plan_id}</td><td>{r.days_left} hari</td></tr>)}</tbody></table></TableWrap>:<Empty text="Tiada langganan hampir tamat."/>}</Panel>
      <Panel title="Ralat sistem terbaru">{data.errors.length?<div className={styles.alertList}>{data.errors.map((r,i)=><div className={styles.alert} key={i}><div><b>{r.route}</b><br/><small>{fmtDate(r.created_at)} · {r.message}</small></div><Badge value={r.status}/></div>)}</div>:<Empty text="Tiada ralat direkodkan."/>}</Panel>
    </div>
  </>;
}
