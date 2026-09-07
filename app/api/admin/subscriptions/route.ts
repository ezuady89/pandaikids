import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { ensureAdminSchema } from "@/lib/admin-schema";
import { getCikguDb } from "@/lib/cikgu-db";

export const runtime="nodejs";
const limits=new Map<string,{count:number;reset:number}>();
function permitted(key:string){const now=Date.now(),v=limits.get(key);if(!v||v.reset<now){limits.set(key,{count:1,reset:now+60000});return true}if(v.count>=10)return false;v.count++;return true}
function sameOrigin(r:NextRequest){const origin=r.headers.get("origin"),host=r.headers.get("x-forwarded-host")??r.headers.get("host");try{return !origin||Boolean(host&&new URL(origin).host===host)}catch{return false}}
function back(r:NextRequest,id:string,key:"ok"|"error",message:string){const url=new URL(`/admin/pengguna/${id}`,r.url);url.searchParams.set(key,message);return NextResponse.redirect(url,303)}

export async function POST(request:NextRequest){
  const auth=requireAdminRequest(request);if(!auth.ok)return NextResponse.json({error:auth.error},{status:auth.status});if(!sameOrigin(request))return NextResponse.json({error:"Permintaan tidak sah."},{status:403});if(!permitted(auth.session.email))return NextResponse.json({error:"Terlalu banyak tindakan. Cuba semula sebentar lagi."},{status:429});
  const form=await request.formData(),teacherId=String(form.get("teacherId")??""),action=String(form.get("action")??""),reason=String(form.get("reason")??"").trim().slice(0,240),plan=String(form.get("plan")??""),days=Math.min(365,Math.max(1,Number(form.get("days")??30)));
  if(!/^[0-9a-f-]{36}$/i.test(teacherId)||reason.length<5||!["extend","change_plan","deactivate","reactivate"].includes(action)||!["plus","pro"].includes(plan))return NextResponse.json({error:"Maklumat tindakan tidak lengkap."},{status:400});
  await ensureAdminSchema();const client=await getCikguDb().connect();let before:unknown=null;
  try{await client.query("BEGIN");const found=await client.query("SELECT * FROM teacher_subscriptions WHERE teacher_id=$1 ORDER BY ends_at DESC LIMIT 1 FOR UPDATE",[teacherId]);before=found.rows[0]??null;
    if(!found.rowCount){if(!["reactivate","change_plan"].includes(action))throw new Error("Tiada langganan untuk tindakan ini.");await client.query("INSERT INTO teacher_subscriptions(id,teacher_id,plan_id,payment_order_id,starts_at,ends_at,source,admin_note) VALUES($1,$2,$3,NULL,NOW(),NOW()+($4||' days')::interval,'admin',$5)",[randomUUID(),teacherId,plan,String(days),reason]);}
    else if(action==="extend")await client.query("UPDATE teacher_subscriptions SET ends_at=GREATEST(ends_at,NOW())+($1||' days')::interval,admin_note=$2 WHERE id=$3",[String(days),reason,found.rows[0].id]);
    else if(action==="change_plan")await client.query("UPDATE teacher_subscriptions SET plan_id=$1,cancelled_at=NULL,ends_at=GREATEST(ends_at,NOW()),admin_note=$2 WHERE id=$3",[plan,reason,found.rows[0].id]);
    else if(action==="deactivate")await client.query("UPDATE teacher_subscriptions SET cancelled_at=NOW(),admin_note=$1 WHERE id=$2",[reason,found.rows[0].id]);
    else await client.query("UPDATE teacher_subscriptions SET cancelled_at=NULL,ends_at=CASE WHEN ends_at<NOW() THEN NOW()+($1||' days')::interval ELSE ends_at END,admin_note=$2 WHERE id=$3",[String(days),reason,found.rows[0].id]);
    const after=await client.query("SELECT * FROM teacher_subscriptions WHERE teacher_id=$1 ORDER BY ends_at DESC LIMIT 1",[teacherId]);await client.query("INSERT INTO admin_audit_logs(id,admin_email,action,target_type,target_id,reason,before_value,after_value,result) VALUES($1,$2,$3,'teacher',$4,$5,$6::jsonb,$7::jsonb,'SUCCESS')",[randomUUID(),auth.session.email,action,teacherId,reason,JSON.stringify(before),JSON.stringify(after.rows[0]??null)]);await client.query("COMMIT");return back(request,teacherId,"ok","Tindakan berjaya dan audit log telah direkodkan.");
  }catch(error){await client.query("ROLLBACK").catch(()=>undefined);await getCikguDb().query("INSERT INTO admin_audit_logs(id,admin_email,action,target_type,target_id,reason,before_value,result) VALUES($1,$2,$3,'teacher',$4,$5,$6::jsonb,'FAILED')",[randomUUID(),auth.session.email,action,teacherId,reason,JSON.stringify(before)]).catch(()=>undefined);return back(request,teacherId,"error",error instanceof Error?error.message:"Tindakan gagal.")}finally{client.release()}
}
