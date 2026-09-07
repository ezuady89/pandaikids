"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <section style={{padding:32,background:"white",borderRadius:24}}><h2>Data belum dapat dimuatkan</h2><p>Sambungan gagal buat sementara waktu. Tiada data rekaan dipaparkan.</p><button onClick={reset}>Cuba semula</button></section>}
