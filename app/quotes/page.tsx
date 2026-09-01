import Link from "next/link";

export default function QuotesPage() {
  return <main className="page">
    <header className="page-heading"><p className="eyebrow">Ventas y producción</p><h1>Cotizaciones</h1><p className="lead">Aquí quedarán las cotizaciones activas, sus versiones y su avance hacia producción.</p></header>
    <section className="panel empty-state"><h2>Lista de cotizaciones</h2><p>La base importada ya está preparada. En el siguiente bloque mostraremos las cotizaciones existentes y permitiremos crear, editar y duplicar proyectos desde esta vista.</p><Link className="button" href="/quotes/new">Nueva cotización</Link></section>
  </main>;
}
