const modules = [
  ["Gran Formato", "Cotización, impresión, acabados y estructura."],
  ["Materiales rígidos", "Lámina, vinil, corte, pegado y mano de obra."],
  ["Catálogos", "Materiales, viniles, herrajes, proveedores e historial de costos."],
  ["Revisión final", "Costos desglosados y gráfico de impacto por categoría."],
];

export default function Home() {
  return (
    <main>
      <header>
        <p className="eyebrow">Custom Graphics</p>
        <h1>Cotizador de producción</h1>
        <p className="lead">Nueva plataforma propia en preparación. El sistema anterior se mantiene disponible hasta validar la migración.</p>
      </header>
      <section aria-label="Módulos en construcción" className="grid">
        {modules.map(([name, detail]) => (
          <article key={name}>
            <h2>{name}</h2>
            <p>{detail}</p>
            <span>En preparación</span>
          </article>
        ))}
      </section>
      <section className="notice">
        <h2>Base de costeo</h2>
        <p>Los importes se clasificarán como materia prima, mano de obra, costos indirectos y servicios. Cada cotización conservará su costo histórico.</p>
      </section>
    </main>
  );
}
