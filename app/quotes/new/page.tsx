import Link from "next/link";
const steps=["Cliente y vendedor","Sistema aplicable","Diseño","Impresión y material","Acabados y complementos","Estructura","Instalación","Revisión final"];

export default function NewQuotePage() {
 return <main className="page"><header className="page-heading"><p className="eyebrow">Nueva cotización</p><h1>Flujo de Gran Formato</h1><p className="lead">Esta será la ruta principal para construir un proyecto. Cada paso guardará costos y decisiones sin perder el histórico.</p></header>
 <section className="workflow" aria-label="Etapas de cotización">{steps.map((step,index)=><div className="step" key={step}><b>Paso {index+1}</b><span>{step}</span></div>)}</section>
 <section className="notice"><h2>Primer módulo disponible</h2><p>El cálculo de estructura ya funciona con medidas, travesaños, perfil y acabado. Lo conectaremos a esta cotización al crear el formulario de impresión.</p><Link className="button" href="/structure">Probar estructura</Link></section></main>;
}
