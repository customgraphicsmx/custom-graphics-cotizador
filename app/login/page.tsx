"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true); setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }),
    });
    if (response.ok) { window.location.assign("/"); return; }
    setError("La contraseña no es correcta.");
    setSending(false);
  }

  return <main style={{ minHeight:"100vh", display:"grid", placeItems:"center", background:"#f5f7f2", padding:24 }}>
    <form onSubmit={submit} style={{ width:"min(100%, 390px)", background:"#fff", border:"1px solid #d9e0d5", borderRadius:16, padding:32 }}>
      <p style={{ margin:0, color:"#5b7b42", fontWeight:800, letterSpacing:"0.12em", fontSize:12 }}>CUSTOM GRAPHICS</p>
      <h1 style={{ margin:"12px 0 8px", color:"#12291d" }}>Acceso de administrador</h1>
      <p style={{ color:"#526256", lineHeight:1.5 }}>Ingresa con la clave temporal para administrar cotizaciones, clientes y catálogos.</p>
      <label style={{ display:"grid", gap:8, fontWeight:700, color:"#12291d" }}>Contraseña
        <input autoFocus required type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ padding:12, border:"1px solid #bdcabc", borderRadius:8 }} />
      </label>
      {error && <p role="alert" style={{ color:"#b42318" }}>{error}</p>}
      <button disabled={sending} type="submit" style={{ width:"100%", marginTop:20, padding:12, background:"#173423", color:"white", border:0, borderRadius:8, fontWeight:800 }}>
        {sending ? "Verificando…" : "Entrar"}
      </button>
    </form>
  </main>;
}
