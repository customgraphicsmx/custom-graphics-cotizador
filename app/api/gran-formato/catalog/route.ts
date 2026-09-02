import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { isAdministratorRequest } from "../../../../../lib/admin";

export async function GET(request: Request) {
  if (!isAdministratorRequest(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [materials, rigid, labor] = await Promise.all([
    db.query(`SELECT id, code, name, category, unit, cost, supplier, width, length
              FROM materials ORDER BY category, name`),
    db.query(`SELECT id, sku, category, name, supplier, thickness, width, length, sheet_cost, cost_m2
              FROM rigid_materials ORDER BY category, name`),
    db.query(`SELECT id, role, productive_hour_cost FROM labor_rates ORDER BY role`)
  ]);

  return NextResponse.json({
    materials: materials.rows.map((row) => ({
      ...row,
      cost: Number(row.cost || 0),
      width: Number(row.width || 0),
      length: Number(row.length || 0)
    })),
    rigidMaterials: rigid.rows.map((row) => ({
      ...row,
      width: Number(row.width || 0),
      length: Number(row.length || 0),
      sheet_cost: Number(row.sheet_cost || 0),
      cost_m2: Number(row.cost_m2 || 0)
    })),
    labor: labor.rows.map((row) => ({ ...row, productive_hour_cost: Number(row.productive_hour_cost || 0) }))
  });
}