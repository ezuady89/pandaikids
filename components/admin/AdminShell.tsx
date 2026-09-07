import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { TeacherSession } from "@/lib/teacher-auth";
import styles from "@/app/admin/admin.module.css";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({session,children}:{session:TeacherSession;children:ReactNode}) {
  return <div className={styles.adminRoot}>
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.brand} aria-label="Pandaikids Admin">
        <Image src="/assets/pandaikids-logo.png" width={1852} height={392} sizes="170px" priority alt="Pandaikids" />
        <small>Admin</small>
      </Link>
      <AdminNav />
      <div className={styles.adminIdentity}><span>{session.name.slice(0,1).toUpperCase()}</span><div><b>{session.name}</b><small>{session.email}</small></div></div>
      <Link className={styles.backSite} href="/">← Laman Pandaikids</Link>
    </aside>
    <header className={styles.mobileHeader}>
      <Link href="/admin" className={styles.mobileBrand} aria-label="Pandaikids Admin"><Image src="/assets/pandaikids-logo.png" width={1852} height={392} sizes="125px" priority alt="Pandaikids" /><small>Admin</small></Link>
      <Link className={styles.mobileSiteLink} href="/">Laman utama ↗</Link>
    </header>
    <main className={styles.content}>{children}</main>
    <AdminNav mobile />
  </div>;
}

export function PageHeader({eyebrow,title,description,actions}:{eyebrow:string;title:string;description:string;actions?:ReactNode}) {
  return <header className={styles.pageHeader}><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{actions}</header>;
}

export function KpiGrid({items}:{items:Array<{label:string;value:ReactNode;hint?:string;href?:string;delta?:number|null}>}) {
  return <section className={styles.kpiGrid}>{items.map((item)=><article className={styles.kpi} key={item.label} title={item.hint}><small>{item.label}</small><strong>{item.value}</strong>{item.delta != null?<span className={item.delta>=0?styles.up:styles.down}>{item.delta>=0?"↑":"↓"} {Math.abs(item.delta)}% tempoh lalu</span>:<span>Data semasa</span>}{item.href?<Link href={item.href}>Lihat butiran →</Link>:null}</article>)}</section>;
}

export function Panel({title,description,children,className=""}:{title:string;description?:string;children:ReactNode;className?:string}) {
  return <section className={`${styles.panel} ${className}`}><header><div><h2>{title}</h2>{description?<p>{description}</p>:null}</div></header>{children}</section>;
}

export function Badge({value}:{value:string}) { const v=value.toLowerCase(); const tone=v.includes("paid")||v.includes("success")||v.includes("aktif")||v.includes("berjaya")?styles.good:v.includes("pending")||v.includes("semak")||v.includes("tamat dalam")?styles.warn:v.includes("fail")||v.includes("gagal")||v.includes("tamat")||v.includes("batal")?styles.bad:styles.neutral; return <span className={`${styles.badge} ${tone}`}>{value.replaceAll("_"," ")}</span>; }

export function Empty({text="Belum ada data sebenar untuk dipaparkan."}:{text?:string}) { return <div className={styles.empty}><span aria-hidden>◌</span><p>{text}</p></div>; }

export function SimpleBars({rows,valueFormatter=(v)=>String(v)}:{rows:Array<{label:string;value:number|string}>;valueFormatter?:(value:number)=>string}) {
  const nums=rows.map(r=>Number(r.value)||0),max=Math.max(1,...nums);
  return <div className={styles.bars} aria-label="Carta ringkas">{rows.map((row,i)=><div key={`${row.label}-${i}`}><span>{row.label}</span><i><b style={{width:`${Math.max(nums[i]?3:0,(nums[i]/max)*100)}%`}} /></i><strong>{valueFormatter(nums[i])}</strong></div>)}</div>;
}

export function TableWrap({children}:{children:ReactNode}) { return <div className={styles.tableWrap}>{children}</div>; }

export function Pagination({page,pages,base,params}:{page:number;pages:number;base:string;params?:Record<string,string|undefined>}) {
  const make=(target:number)=>{const s=new URLSearchParams();Object.entries(params??{}).forEach(([k,v])=>{if(v)s.set(k,v)});s.set("page",String(target));return `${base}?${s}`};
  return <nav className={styles.pagination} aria-label="Halaman"><Link aria-disabled={page<=1} href={make(Math.max(1,page-1))}>← Sebelum</Link><span>Halaman {page} / {pages}</span><Link aria-disabled={page>=pages} href={make(Math.min(pages,page+1))}>Seterusnya →</Link></nav>;
}

export function fmtDate(value:unknown){if(!value)return "—";return new Intl.DateTimeFormat("ms-MY",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Kuala_Lumpur"}).format(new Date(String(value)))}
export function money(cents:unknown){return new Intl.NumberFormat("ms-MY",{style:"currency",currency:"MYR"}).format((Number(cents)||0)/100)}
export function delta(current:unknown,previous:unknown){const a=Number(current)||0,b=Number(previous)||0;return b?Math.round(((a-b)/b)*100):null}
