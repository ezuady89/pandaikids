"use client";

import styles from "@/app/admin/admin.module.css";

export function SubscriptionActionForm({teacherId}:{teacherId:string}) {
  return <form className={styles.formRow} action="/api/admin/subscriptions" method="post" onSubmit={(event)=>{if(!window.confirm("Sahkan tindakan sensitif ini? Nilai sebelum dan selepas akan direkodkan."))event.preventDefault()}}>
    <input type="hidden" name="teacherId" value={teacherId}/>
    <label>Tindakan<select name="action" required><option value="extend">Panjangkan</option><option value="change_plan">Tukar pakej</option><option value="deactivate">Nyahaktifkan</option><option value="reactivate">Aktifkan semula</option></select></label>
    <label>Pakej<select name="plan"><option value="plus">Cikgu Plus</option><option value="pro">Cikgu Pro</option></select><input aria-label="Bilangan hari" name="days" type="number" min="1" max="365" defaultValue="30"/></label>
    <label>Sebab<input name="reason" required minLength={5} maxLength={240} placeholder="Nyatakan sebab tindakan"/></label>
    <button type="submit">Sahkan tindakan</button>
  </form>;
}
