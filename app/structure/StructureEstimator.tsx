"use client";

import { useMemo, useState } from "react";
import { calculateStructure, structureProfiles } from "../../lib/structure-cost";
import styles from "./structure.module.css";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });

function toNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function StructureEstimator() {
  const [widthM, setWidthM] = useState(1.6);
  const [heightM, setHeightM] = useState(1);
  const [horizontalCrossbars, setHorizontalCrossbars] = useState(1);
  const [verticalCrossbars, setVerticalCrossbars] = useState(1);
  const [profileId, setProfileId] = useState(structureProfiles[0].id);
  const [finish, setFinish] = useState<"none" | "anticorrosive">("anticorrosive");
  const profile = structureProfiles.find((item) => item.id === profileId) ?? structureProfiles[0];
  const result = useMemo(() => calculateStructure({ widthM, heightM, horizontalCrossbars, verticalCrossbars, profile, finish }), [finish, heightM, horizontalCrossbars, profile, verticalCrossbars, widthM]);
  const verticalPositions = Array.from({ length: result.verticalCrossbars }, (_, index) => ((index + 1) / (result.verticalCrossbars + 1)) * result.widthM);
  const horizontalPositions = Array.from({ length: result.horizontalCrossbars }, (_, index) => ((index + 1) / (result.horizontalCrossbars + 1)) * result.heightM);

  return (
    <section className={styles.estimator}>
      <div className={styles.controls}>
        <div className={styles.formGrid}>
          <label>Ancho (m)<input type="number" min="0.1" step="0.01" value={widthM} onChange={(event) => setWidthM(toNumber(event.target.value, widthM))} /></label>
          <label>Alto (m)<input type="number" min="0.1" step="0.01" value={heightM} onChange={(event) => setHeightM(toNumber(event.target.value, heightM))} /></label>
          <label className={styles.wide}>Perfil<select value={profileId} onChange={(event) => setProfileId(event.target.value)}>{structureProfiles.map((item) => <option key={item.id} value={item.id}>{item.label} · {money.format(item.barCost)}/barra</option>)}</select></label>
          <label>Travesaños horizontales<input type="number" min="0" step="1" value={horizontalCrossbars} onChange={(event) => setHorizontalCrossbars(Math.max(0, Math.floor(toNumber(event.target.value, horizontalCrossbars))))} /></label>
          <label>Travesaños verticales<input type="number" min="0" step="1" value={verticalCrossbars} onChange={(event) => setVerticalCrossbars(Math.max(0, Math.floor(toNumber(event.target.value, verticalCrossbars))))} /></label>
          <label className={styles.wide}>Acabado<select value={finish} onChange={(event) => setFinish(event.target.value as "none" | "anticorrosive")}><option value="anticorrosive">Pintura anticorrosiva</option><option value="none">Sin acabado</option></select></label>
        </div>
        <p className={styles.help}>El perfil usa el precio por barra registrado. Al cambiarlo, cambian el costo, el precio recomendado y la revisión final.</p>
      </div>

      <div className={styles.diagramAndSummary}>
        <figure>
          <div className={styles.diagramShell} style={{ aspectRatio: `${result.widthM} / ${result.heightM}` }}>
            <svg viewBox={`0 0 ${result.widthM} ${result.heightM}`} role="img" aria-label={`Bastidor de ${result.widthM} por ${result.heightM} metros`} preserveAspectRatio="xMidYMid meet">
              <rect x="0.025" y="0.025" width={Math.max(0, result.widthM - 0.05)} height={Math.max(0, result.heightM - 0.05)} fill="white" stroke="currentColor" strokeWidth="0.05" />
              {verticalPositions.map((x) => <line key={`v-${x}`} x1={x} x2={x} y1="0.025" y2={result.heightM - 0.025} stroke="#637f37" strokeWidth="0.025" />)}
              {horizontalPositions.map((y) => <line key={`h-${y}`} x1="0.025" x2={result.widthM - 0.025} y1={y} y2={y} stroke="#637f37" strokeWidth="0.025" />)}
            </svg>
          </div>
          <figcaption>Vista frontal proporcional · {result.widthM.toFixed(2)} m × {result.heightM.toFixed(2)} m</figcaption>
        </figure>
        <aside className={styles.summary}>
          <h2>{profile.label}</h2>
          <p>{result.horizontalCrossbars} horizontal(es) · {result.verticalCrossbars} vertical(es)</p>
          <p>{result.bars} barra(s) de 6 m · {result.requiredM.toFixed(2)} m requeridos</p>
          <strong>{money.format(result.cost)}</strong>
          <span>Costo conocido de fabricación</span>
        </aside>
      </div>

      <section className={styles.costLines} aria-label="Desglose de costos de estructura">
        <h2>Desglose de fabricación</h2>
        {result.lines.map((line) => <div className={styles.costLine} key={line.label}><div><b>{line.label}</b><small>{line.note}</small></div><strong>{money.format(line.total)}</strong></div>)}
        {result.pendingCosts.map((pending) => <p className={styles.pending} key={pending}>{pending}</p>)}
      </section>
    </section>
  );
}
