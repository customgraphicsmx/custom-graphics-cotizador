import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";

export const runtime = "nodejs";

type ClientInput = Record<string, unknown>;
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

function mapClient(row: Record<string, unknown>) {
  const fiscal = (row.fiscal && typeof row.fiscal === "object" ? row.fiscal : {}) as Record<string, unknown>;
  const address = (row.address && typeof row.address === "object" ? row.address : {}) as Record<string, unknown>;
  return {
    id: row.id, name: row.name, company: row.company,
    legal_name: text(fiscal.legal_name), tax_id: text(fiscal.tax_id), tax_regime: text(fiscal.tax_regime),
    cfdi_use: text(fiscal.cfdi_use) || "G03", fiscal_postal_code: text(fiscal.fiscal_postal_code),
    street: text(address.street), exterior_number: text(address.exterior_number), interior_number: text(address.interior_number),
    neighborhood: text(address.neighborhood), municipality: text(address.municipality), state: text(address.state),
    country: text(address.country) || "México", email: row.email, phone: row.phone,
    customer_type: row.customer_type, updated_at: row.updated_at,
  };
}

export async function GET(request: Request) {
  if (!isAdministratorRequest(request)) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const result = await db.query("SELECT id, name, company, fiscal, address, email, phone, customer_type, updated_at FROM clients ORDER BY name ASC");
  return NextResponse.json(result.rows.map(mapClient));
}

export async function POST(request: Request) {
  if (!isAdministratorRequest(request)) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const input = await request.json().catch(() => null) as ClientInput | null;
  if (!input) return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });

  const name = text(input.name) || text(input.legal_name);
  if (!name) return NextResponse.json({ error: "El nombre del cliente es obligatorio." }, { status: 422 });

  const fiscal = {
    legal_name: text(input.legal_name), tax_id: text(input.tax_id), tax_regime: text(input.tax_regime),
    cfdi_use: text(input.cfdi_use) || "G03", fiscal_postal_code: text(input.fiscal_postal_code),
  };
  const address = {
    street: text(input.street), exterior_number: text(input.exterior_number), interior_number: text(input.interior_number),
    neighborhood: text(input.neighborhood), municipality: text(input.municipality), state: text(input.state),
    country: text(input.country) || "México",
  };
  const result = await db.query(
    "INSERT INTO clients (name, company, fiscal, address, email, phone, customer_type) VALUES ($1,$2,$3::jsonb,$4::jsonb,$5,$6,$7) RETURNING id, name, company, fiscal, address, email, phone, customer_type, updated_at",
    [name, text(input.company), JSON.stringify(fiscal), JSON.stringify(address), text(input.email), text(input.phone), text(input.customer_type) || "Cliente Final"],
  );
  return NextResponse.json({ id: result.rows[0].id, client: mapClient(result.rows[0]) }, { status: 201 });
}
