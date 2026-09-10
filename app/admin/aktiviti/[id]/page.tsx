import Link from "next/link";
import { notFound } from "next/navigation";
import { Empty, fmtDate, PageHeader, Panel } from "@/components/admin/AdminShell";
import styles from "../../admin.module.css";
import { requireAdmin } from "@/lib/admin-auth";
import { getActivityDetail } from "@/lib/admin-data";

type ActivityQuestion={question?:string;choices?:unknown[];answer?:string;explanation?:string;subject?:string;year?:number;topic?:string};

export default async function ActivityDetailPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  await requireAdmin(`/admin/aktiviti/${id}`);
  const data=await getActivityDetail(id);
  if(!data)notFound();
  const questions=data.questions as ActivityQuestion[];
  const first=questions[0];
  const title=first?.topic?.trim()||"Kuiz cikgu";
  return <>
    <PageHeader eyebrow="Kandungan aktiviti" title={title} description={`${data.teacher_name} · ${fmtDate(data.published_at??data.created_at)}`} actions={<Link className={styles.secondaryButton} href="/admin/aktiviti">← Senarai Aktiviti</Link>}/>
    <div className={styles.activityMeta}>
      <span>{first?.subject??"Subjek tidak direkod"}</span>
      <span>{first?.year?`Tahun ${first.year}`:"Tahun tidak direkod"}</span>
      <span>{questions.length} soalan</span>
      <span>Akses {data.access_mode}</span>
      <span>{data.responses} respons</span>
    </div>
    <div className={styles.notice}>Hanya kuiz yang telah diterbitkan dipaparkan. Draf yang belum diterbitkan tidak disimpan oleh Admin.</div>
    <Panel title="Soalan dan jawapan" description={`ID aktiviti: ${data.id}`}>
      {questions.length?<div className={styles.questionList}>{questions.map((item,index)=>{
        const choices=Array.isArray(item.choices)?item.choices.map(String):[];
        return <article className={styles.questionCard} key={`${data.id}-${index}`}>
          <header><span className={styles.questionNumber}>{index+1}</span><h3>{item.question??"Soalan tidak tersedia"}</h3></header>
          <ol className={styles.answerList}>{choices.map((choice,choiceIndex)=>{const letter=String.fromCharCode(65+choiceIndex);return <li className={letter===item.answer?styles.correctAnswer:""} key={`${letter}-${choice}`}><b>{letter}</b><span>{choice}</span></li>})}</ol>
          {item.explanation?<p className={styles.questionExplanation}><b>Penerangan:</b> {item.explanation}</p>:null}
        </article>;
      })}</div>:<Empty text="Kandungan penuh hanya tersedia untuk kuiz yang dibina sendiri atau dijana AI."/>}
    </Panel>
  </>;
}
