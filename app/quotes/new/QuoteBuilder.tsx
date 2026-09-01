"use client";

import { useState } from "react";
import { calculateStructure, structureProfiles } from "../../../lib/structure-cost";
import styles from "./QuoteBuilder.module.css";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const num = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
};

export function QuoteBuilder() {
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("Proyecto de Gran Formato");
  const [width, setWidth] = useState(1.2);
  const [height, setHeight] = useState(0.8);
  const [quantity, setQuantity] = useState(1);
  const [materialCost, setMaterialCost] = useState(0);
  const [printCost, setPrintCost] = useState(0);
  const [designHours, setDesignHours] = useState(0);
  const [finishCost, setFinishCost] = useState(0);
  const [installationCost, setInstallationCost] = useState(0);
  const [includeStructure, setIncludeStructure] = useState(false);
  const [profileId, setProfileId] = useState(structureProfiles[0].id);
  const [horizontalBars, setHorizontalBars] = useState(1);
  const [verticalBars, setVerticalBars] = useState(1);
  const [margin, setMargin] = useState(55);

  const area = width * height * quantity;
  const profile = structureProfiles.find((item) => item.id === profileId) ?? structureProfiles[0];
  const structure = calculateStructure({ widthM: width, heightM: height, horizontalCrossbars: horizontalBars, verticalCrossbars: verticalBars, profile, finish: "anticorrosive" });
  const materialTotal = area * materialCost;
  const printingTotal = area * printCost;
  const designTotal = designHours * 90;
  const structureTotal = includeStructure ? structure.cost * quantity : 0;
  const cost = materialTotal + printingTotal + designTotal + finishCost + installationCost + structureTotal;
  const price = cost / Math.max(0.01, 1 - margin / 100);

  const lines: Array<[string, number]> = [
    ["Material", materialTotal],
    ["Impresión", printingTotal],
    ["Diseño", designTotal],
    ["Acabados y complementos", finishCost],
    ["Estructura", structureTotal],
    ["Instalación / logística", installationCost],
  ].filter(([, total]) => total > 0);

  return <section className={styles.builder}>
    <div className={styles.form}>
      <section className={styles.section}>
        <h2>1. Datos del proyecto</h2>
        <div className={styles.grid}>
          <label className={styles.full}>Cliente<input value={client} placeholder="Seleccionar o escribir cliente" onChange={(event) => setClient(event.target.value)} /></label>
          <label className={styles.full}>Concepto<input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
          <label>Ancho (m)<input type="number" min="0.01" step="0.01" value={width} onChange={(event) => setWidth(num(event.target.value, width))} /></label>
          <label>Alto (m)<input type="number" min="0.01" step="0.01" value={height} onChange={(event) => setHeight(num(event.target.value, height))} /></label>
          <label>Cantidad<input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.floor(num(event.target.value, quantity)))} /></label>
          <div className={styles.metric}><span>Área total</span><b>{area.toFixed(2)} m²</b></div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>2. Material e impresión</h2>
        <p>Por ahora captura el costo por m² para probar la lógica. El siguiente ajuste los tomará directamente de Catálogos.</p>
        <div className={styles.grid}>
          <label>Costo material / m²<input type="number" min="0" step="0.01" value={materialCost} onChange={(event) => setMaterialCost(num(event.target.value, materialCost))} /></label>
          <label>Costo impresión / m²<input type="number" min="0" step="0.01" value={printCost} onChange={(event) => setPrintCost(num(event.target.value, printCost))} /></label>
          <label>Horas de diseño<input type="number" min="0" step="0.25" value={designHours} onChange={(event) => setDesignHours(num(event.target.value, designHours))} /></label>
          <label>Acabados y complementos<input type="number" min="0" step="0.01" value={finishCost} onChange={(event) => setFinishCost(num(event.target.value, finishCost))} /></label>
          <label className={styles.full}>Instalación, flete o servicios adicionales<input type="number" min="0" step="0.01" value={installationCost} onChange={(event) => setInstallationCost(num(event.target.value, installationCost))} /></label>
        </div>
      </section>

      <section className={styles.section}>
        <label className={styles.check}><input type="checkbox" checked={includeStructure} onChange={(event) => setIncludeStructure(event.target.checked)} /> Incluir estructura de herrería</label>
        {includeStructure && <div className={styles.grid}>
          <label className={styles.full}>Perfil<select value={profileId} onChange={(event) => setProfileId(event.target.value)}>{structureProfiles.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
          <label>Travesaños horizontales<input type="number" min="0" step="1" value={horizontalBars} onChange={(event) => setHorizontalBars(Math.floor(num(event.target.value, horizontalBars)))} /></label>
          <label>Travesaños verticales<input type="number" min="0" step="1" value={verticalBars} onChange={(event) => setVerticalBars(Math.floor(num(event.target.value, verticalBars)))} /></label>
          <div className={styles.metric}><span>Estructura por pieza</span><b>{money.format(structure.cost)}</b></div>
        </div>}
      </section>
    </div>

    <aside className={styles.summary}>
      <p className={styles.kicker}>Revisión en tiempo real</p>
      <h2>{description || "Proyecto de Gran Formato"}</h2>
      <p>{client || "Cliente por definir"} · {quantity} pza(s) · {area.toFixed(2)} m²</p>
      <div className={styles.lines}>{lines.length ? lines.map(([label, total]) => <div key={String(label)}><span>{label}</span><b>{money.format(Number(total))}</b></div>) : <p>Captura los costos para ver el desglose.</p>}</div>
      <label>Margen objetivo (%)<input type="number" min="1" max="95" value={margin} onChange={(event) => setMargin(Math.min(95, Math.max(1, num(event.target.value, margin)))} /></label>
      <div className={styles.total}><span>Costo total</span><b>{money.format(cost)}</b></div>
      <div className={styles.price}><span>Precio sugerido sin IVA</span><b>{money.format(price)}</b></div>
      <button type="button" disabled>Guardar cotización · siguiente bloque</button>
    </aside>
  </section>;
}
