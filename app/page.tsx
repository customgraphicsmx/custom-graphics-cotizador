import Link from "next/link";

const actions = [
  { href: "/quotes/new", title: "Nueva cotización", detail: "Crea un proyecto por pasos: cliente, sistema, impresión, acabados, estructura y revisión." },
  { href: "/quotes", title: "Cotizaciones", detail: "Consulta proyectos en preparación y conserva su costo histórico." },
  { href: "/clients", title: "Clientes", detail: "Centraliza contactos y el historial comercial de cada cliente." },
  { href: "/catalogs", title: "Catálogos", detail: "Materiales, viniles, rígidos, proveedores y costos de producción." },
];

export default function Home() {
  return (
    <main className="page">
      <header className="page-heading">
        <p className="eyebrow">Custom Graphics</p>
        <h1>Cotizador de producción</h1>
        <p className="lead">La nueva plataforma ya está lista para organizar el flujo de cotización. Empezaremos por Gran Formato y agregaremos cada módulo con pruebas en esta versión.</p>
      </header>
      <section className="dashboard-grid" aria-label="Accesos principales">
        {actions.map((action) => (
          <Link className="action-card" href={action.href} key={action.href}>
            <h2>{action.title}</h2><p>{action.detail}</p><span>Entrar →</span>
          </Link>
        ))}
      </section>
      <section className="notice">
        <h2>Siguiente bloque: Gran Formato</h2>
        <p>El flujo conserva las etapas del sitio anterior: cliente, sistema aplicable, diseño, impresión/material, acabados, estructura, instalación y revisión final.</p>
        <Link className="button" href="/quotes/new">Empezar una cotización</Link>
      </section>
    </main>
  );
}
