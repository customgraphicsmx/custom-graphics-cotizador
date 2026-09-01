import { QuoteBuilder } from "./QuoteBuilder";

export default function NewQuotePage() {
  return <main className="page">
    <header className="page-heading">
      <p className="eyebrow">Nueva cotización</p>
      <h1>Gran Formato</h1>
      <p className="lead">Construye el primer concepto y revisa el costo al momento. La cotización quedará preparada para añadir más conceptos y guardar el histórico.</p>
    </header>
    <QuoteBuilder />
  </main>;
}
