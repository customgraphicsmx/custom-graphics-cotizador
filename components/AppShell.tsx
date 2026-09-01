"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/quotes", label: "Cotizaciones" },
  { href: "/quotes/new", label: "Nueva cotización" },
  { href: "/clients", label: "Clientes" },
  { href: "/catalogs", label: "Catálogos" },
  { href: "/structure", label: "Estructura" },
  { href: "/review", label: "Revisión final" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" href="/">CUSTOM GRAPHICS<small>Cotizador de producción</small></Link>
      <nav className="nav" aria-label="Navegación principal">
        {navigation.map((item) => <Link className={pathname === item.href ? "active" : ""} href={item.href} key={item.href}>{item.label}</Link>)}
      </nav>
    </header>
    {children}
  </div>;
}
