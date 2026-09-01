import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Custom Graphics · Cotizador",
  description: "Cotizaciones y costos de producción",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
