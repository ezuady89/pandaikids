import Link from "next/link";

export default function AccessDeniedPage() {
  return <main style={{minHeight:"100svh",display:"grid",placeItems:"center",padding:24,background:"#f4faf6"}}>
    <section style={{width:"min(540px,100%)",background:"white",padding:"40px 32px",borderRadius:28,boxShadow:"0 18px 50px rgba(16,74,58,.12)",textAlign:"center"}}>
      <div style={{fontSize:48}} aria-hidden>🔒</div><h1 style={{fontSize:38,margin:"12px 0"}}>Akses tidak dibenarkan</h1>
      <p style={{color:"#617b76",lineHeight:1.6}}>Akaun ini sah, tetapi tidak berada dalam senarai admin Pandaikids.</p>
      <Link href="/" style={{display:"inline-flex",marginTop:16,padding:"12px 18px",borderRadius:14,background:"#176b4c",color:"white",fontWeight:800}}>Kembali ke Pandaikids</Link>
    </section>
  </main>;
}
