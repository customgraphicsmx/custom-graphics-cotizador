import { StructureEstimator } from "./StructureEstimator";

export default function StructurePage() {
  return (
    <main className="module-page">
      <p className="eyebrow">Módulo de Gran Formato</p>
      <h1>Estructura del proyecto</h1>
      <p className="lead">Configura el bastidor de herrería. El diagrama se mantiene proporcional a las medidas reales y cada perfil afecta el costo.</p>
      <StructureEstimator />
    </main>
  );
}
