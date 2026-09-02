"use client";

import { useEffect, useMemo, useState } from "react";

type Client = { id: string; name: string; company?: string; legal_name?: string; customer_type?: string; };
type Material = { id: string; code: string; name: string; category: string; unit: string; cost: number; supplier?: string; };
type Rigid = { id: string; sku: string; name: string; category: string; thickness?: string; cost_m2: number; sheet_cost: number; };
type Catalog = { materials: Material[]; rigidMaterials: Rigid[]; labor: { id: string; role: string; productive_hour_cost: number }[]; };
const mxn = (n: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 }).format(Number.isFinite(n) ? n : 0);

export default function GranFormatoPage() {
  const [catalog, setCatalog] = useState<Catalog>({ materials: [], rigidMaterials: [], labor: [] });
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState("");
  const [module, setModule] = useState<"flexible" | "rigid">("flexible");
  const [materialId, setMaterialId] = useState("");
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [printCost, setPrintCost] = useState(72);
  const [finishCost, setFinishCost] = useState(3);
  const [designHours, setDesignHours] = useState(0);
  const [structure, setStructure] = useState(true);
  const [horizontal, setHorizontal] = useState(3);
  const [vertical, setVertical] = useState(2);
  const [margin, setMargin] = useState(55);

  useEffect(() => {
    Promise.all([
      fetch("/api/clients").then(async (r) => r.ok ? r.json() : []),
      fetch("/api/gran-formato/catalog").then(async (r) => r.ok ? r.json() : { materials: [], rigidMaterials: [], labor: [] })
    ]).then(([loadedClients, loadedCatalog]) => {
      setClients(Array.isArray(loadedClients) ? loadedClients : loadedClients.clients || []);
      setCatalog(loadedCatalog);
      const first = loadedCatalog.materials?.[0] || loadedCatalog.rigidMaterials?.[0];
      if (first) setMaterialId(first.id);
    }).finally(() => setLoading(false));
  }, []);

  const options = module === "flexible" ? catalog.materials : catalog.rigidMaterials;
  useEffect(() => {
    if (options.length && !options.some((x) => x.id === materialId)) setMaterialId(options[0].id);
  }, [module, options, materialId]);

  const selected = options.find((item) => item.id === materialId);
  const area = Math.max(0, width) * Math.max(0, height) * Math.max(1, quantity);
  const materialUnitCost = selected ? ("cost" in selected ? selected.cost : selected.cost_m2 || selected.sheet_cost / Math.max(1, selected.width * selected.length)) : 0;
  const materialCost = area * materialUnitCost;
  const designRate = catalog.labor[0]?.productive_hour_cost || 90;
  const designCost = Math.max(0, designHours) * designRate;
  const structureCost = structure ? ((width * 2 + height * 2) * quantity * 95 + (horizontal + vertical) * quantity * 48) : 0;
  const productionCost = area * Math.max(0, printCost) + Math.max(0, finishCost) * quantity;
  const cost = materialCost + productionCost + designCost + structureCost;
  const suggested = cost / Math.max(.01, 1 - Math.min(90, Math.max(1, margin)) / 100);
  const selectedClient = clients.find((client) => client.id === clientId);

  return <main className="gran">
    <header>
      <div><b>CUSTOM GRAPHICS</b><small>COTIZADOR DE PRODUCCIÓN</small></div>
      <nav><a href="/">Inicio</a><a className="current" href="/gran-formato">Nueva cotización</a><a href="/">Clientes</a><a href="/">Catálogos</a><a href="/">Estructura</a><a href="/">Revisión final</a></nav>
    </header>
    <section className="hero"><p>NUEVA COTIZACIÓN · GRAN FORMATO</p><h1>Proyecto de Gran Formato</h1><span>Costea materiales, impresión, acabados, estructura e instalación desde los catálogos reales.</span></section>
    <ol className="steps">{["Proyecto","Diseño","Impresión","Acabados","Estructura","Instalación","Revisión"].map((label, i) => <li key={label} className={i === 0 ? "on" : ""}><i>{i + 1}</i>{label}</li>)}</ol>
    {loading ? <p className="loading">Cargando catálogos de producción…</p> : <div className="grid">
      <div className="builder">
        <section className="card"><h2>1. Proyecto, cliente y responsable</h2><p className="hint">Selecciona el cliente y el tipo de trabajo de Gran Formato.</p>
          <label>Cliente<select value={clientId} onChange={(e) => setClientId(e.target.value)}><option value="">Seleccionar cliente</option>{clients.map((client) => <option value={client.id} key={client.id}>{client.legal_name || client.company || client.name}</option>)}</select></label>
          <div className="module"><button onClick={() => setModule("flexible")} className={module === "flexible" ? "selected" : ""}><strong>01</strong> Gran Formato flexible<small>Lonas, viniles e impresión.</small></button><button onClick={() => setModule("rigid")} className={module === "rigid" ? "selected" : ""}><strong>02</strong> Materiales rígidos<small>Paneles, sustratos y cortes.</small></button></div>
        </section>
        <section className="card"><h2>2. Material e impresión</h2><div className="two"><label>Material del catálogo<select value={materialId} onChange={(e) => setMaterialId(e.target.value)}>{options.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.category}</option>)}</select></label><label>Costo de impresión / m²<input type="number" min="0" value={printCost} onChange={(e) => setPrintCost(+e.target.value)} /></label><label>Ancho (m)<input type="number" min=".01" step=".01" value={width} onChange={(e) => setWidth(+e.target.value)} /></label><label>Alto (m)<input type="number" min=".01" step=".01" value={height} onChange={(e) => setHeight(+e.target.value)} /></label><label>Cantidad<input type="number" min="1" value={quantity} onChange={(e) => setQuantity(+e.target.value)} /></label><label>Acabados por pieza<input type="number" min="0" value={finishCost} onChange={(e) => setFinishCost(+e.target.value)} /></label></div>
          <div className="notice">Área total: <b>{area.toFixed(2)} m²</b> · Material: <b>{selected?.name || "Sin seleccionar"}</b></div>
        </section>
        <section className="card"><h2>3. Diseño y estructura</h2><div className="two"><label>Horas de diseño<input type="number" min="0" value={designHours} onChange={(e) => setDesignHours(+e.target.value)} /></label><label>Margen objetivo (%)<input type="number" min="1" max="90" value={margin} onChange={(e) => setMargin(+e.target.value)} /></label></div>
          <label className="check"><input type="checkbox" checked={structure} onChange={(e) => setStructure(e.target.checked)} /> Incluir estructura de herrería</label>
          {structure && <div className="two"><label>Travesaños horizontales<input type="number" min="0" value={horizontal} onChange={(e) => setHorizontal(+e.target.value)} /></label><label>Travesaños verticales<input type="number" min="0" value={vertical} onChange={(e) => setVertical(+e.target.value)} /></label></div>}
        </section>
      </div>
      <aside className="summary"><p>REVISIÓN EN TIEMPO REAL</p><h2>{selectedClient?.legal_name || selectedClient?.company || selectedClient?.name || "Proyecto de Gran Formato"}</h2><span>{quantity} pza(s) · {area.toFixed(2)} m²</span><hr/><dl><dt>Material</dt><dd>{mxn(materialCost)}</dd><dt>Impresión y acabados</dt><dd>{mxn(productionCost)}</dd><dt>Diseño</dt><dd>{mxn(designCost)}</dd><dt>Estructura</dt><dd>{mxn(structureCost)}</dd></dl><div className="total"><span>Costo total</span><b>{mxn(cost)}</b></div><div className="price"><span>Precio sugerido sin IVA</span><b>{mxn(suggested)}</b></div><button className="save" disabled={!clientId || !selected}>Guardar cotización · siguiente bloque</button></aside>
    </div>}
    <style jsx>{`
      .gran{min-height:100vh;background:#f6f7f3;color:#14281d;font:14px Arial,sans-serif}.gran header{height:60px;background:#102c1e;color:#fff;display:flex;align-items:center;padding:0 28px;gap:46px}.gran header b{letter-spacing:.5px}.gran header small{display:block;color:#b4caa9;font-size:9px;letter-spacing:1px;margin-top:2px}.gran nav{display:flex;gap:19px}.gran nav a{color:#dbe6d7;text-decoration:none;font-weight:600;font-size:12px}.gran nav .current{background:#416b4d;padding:8px 10px;border-radius:6px}.hero{max-width:1100px;margin:52px auto 26px}.hero p,.summary>p{color:#537b4e;font-size:11px;font-weight:bold;letter-spacing:1.4px}.hero h1{font-size:42px;margin:8px 0 12px;letter-spacing:-1px}.hero span,.hint{color:#58695f;font-size:16px}.steps{display:flex;margin:0 auto 24px;max-width:1320px;padding:0;list-style:none;background:#fff;border:1px solid #d9e1d6}.steps li{padding:16px 10px;flex:1;text-align:center;border-right:1px solid #d9e1d6;font-weight:bold;color:#647169;font-size:12px}.steps li:last-child{border:0}.steps i{font-style:normal;display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#e8eee4;margin-right:8px}.steps .on{background:#edf7ca;color:#1d3824}.steps .on i{background:#a7e400}.grid{max-width:1320px;margin:auto;display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:20px}.builder{display:grid;gap:16px}.card,.summary{background:#fff;border:1px solid #d8e0d5;border-radius:14px;padding:23px}.card h2{margin:0 0 8px;font-size:18px}.hint{margin:0 0 18px;font-size:13px}.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}label{display:grid;gap:7px;font-size:12px;font-weight:bold;margin:0 0 14px}input,select{border:1px solid #c7d4c3;border-radius:8px;padding:11px;background:#fff;color:#17251b;font-size:14px}select{width:100%}.module{display:grid;grid-template-columns:1fr 1fr;gap:10px}.module button{padding:15px;text-align:left;border:1px solid #d7dfd3;border-radius:8px;background:#fbfcfa;color:#1f3225;font-weight:bold}.module button.selected{border-color:#94bd39;background:#f0fbd3}.module strong,.module small{display:block}.module strong{color:#5b7f50;font-size:10px}.module small{font-weight:normal;color:#627065;margin-top:5px}.notice{padding:13px;background:#f1f6ec;color:#496742;border-radius:8px}.check{display:block;font-size:14px;margin:8px 0 18px}.check input{margin-right:8px}.summary{height:max-content;position:sticky;top:16px}.summary h2{font-size:20px;margin:13px 0}.summary>span{color:#526258}.summary hr{border:0;border-top:1px solid #d9e1d6;margin:18px 0}dl{display:grid;grid-template-columns:1fr auto;gap:10px;margin:0}dt{color:#59685e}dd{margin:0;font-weight:bold}.total,.price{display:flex;justify-content:space-between;padding:16px 0;font-size:15px}.total{border-top:1px solid #d9e1d6;margin-top:16px}.total b{font-size:21px}.price{background:#eaf5d6;margin:0 -23px;padding:17px 23px;color:#4f7447}.price b{font-size:21px;color:#183422}.save{margin-top:15px;width:100%;border:0;border-radius:8px;padding:14px;background:#163d26;color:white;font-weight:bold}.save:disabled{background:#cbd4c8;color:#657065}.loading{padding:80px;text-align:center;color:#496742}@media(max-width:850px){.gran header{height:auto;padding:14px;display:block}.gran nav{margin-top:12px;overflow:auto}.hero{margin:30px 18px}.hero h1{font-size:32px}.steps{overflow:auto}.steps li{min-width:110px}.grid{display:block;margin:0 18px}.summary{position:static;margin:16px 0}.two,.module{grid-template-columns:1fr}}`}</style>
  </main>;
}