import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Custom Graphics | Sistema de Cotización",
  description: "Plataforma comercial y productiva de Custom Graphics.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
