import type { Metadata } from "next";
import { AppShell } from "../components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Custom Graphics · Cotizador",
  description: "Cotizaciones y costos de producción",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body><AppShell>{children}</AppShell></body>
    </html>
  );
}
