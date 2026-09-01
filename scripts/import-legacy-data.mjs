import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exportPath = process.env.LEGACY_EXPORT_PATH || path.join(root, "recovery", "d1-export-v72.json");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL es requerida.");

const { Client } = pg;
const { tables } = JSON.parse(await fs.readFile(exportPath, "utf8"));
const rows = (name) => tables[name]?.rows ?? [];
const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const date = (value) => new Date(number(value, Date.now())).toISOString();
const json = (value, fallback = {}) => {
  if (typeof value === "object" && value !== null) return value;
  let parsed = value;
  for (let attempt = 0; attempt < 3 && typeof parsed === "string"; attempt += 1) {
    try { parsed = JSON.parse(parsed); } catch { return fallback; }
  }
  return typeof parsed === "object" && parsed !== null ? parsed : fallback;
};
const materialCategory = (category) => {
  const value = String(category || "").toLowerCase();
  if (value.includes("herrer") || value.includes("tubular") || value.includes("perfil")) return "steel";
  if (value.includes("vinil")) return "vinyl";
  if (value.includes("acab")) return "finishing";
  if (value.includes("mano") || value.includes("labor")) return "labor";
  if (value.includes("flete") || value.includes("log")) return "logistics";
  return "raw_material";
};

const db = new Client({ connectionString: databaseUrl });
await db.connect();

try {
  await db.query("BEGIN");

  for (const source of rows("suppliers")) {
    await db.query(`INSERT INTO suppliers
      (id, code, name, legal_name, tax_id, contact, address, payment_terms, default_freight, free_shipping_threshold, notes, active, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (id) DO UPDATE SET code=EXCLUDED.code, name=EXCLUDED.name, legal_name=EXCLUDED.legal_name,
      tax_id=EXCLUDED.tax_id, contact=EXCLUDED.contact, address=EXCLUDED.address, payment_terms=EXCLUDED.payment_terms,
      default_freight=EXCLUDED.default_freight, free_shipping_threshold=EXCLUDED.free_shipping_threshold, notes=EXCLUDED.notes,
      active=EXCLUDED.active, updated_at=EXCLUDED.updated_at`, [
      source.id, source.code, source.name, source.legal_name || "", source.tax_id || "",
      json({ name: source.contact_name || "", email: source.email || "", phone: source.phone || "" }),
      json({ address: source.address || "", city: source.city || "", state: source.state || "", postalCode: source.postal_code || "" }),
      source.payment_terms || "", number(source.default_freight), number(source.free_shipping_threshold), source.notes || "",
      Boolean(source.active), date(source.updated_at),
    ]);
  }

  for (const source of rows("app_users")) {
    await db.query(`INSERT INTO app_users (id,name,email,role,permissions,active,updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,email=EXCLUDED.email,role=EXCLUDED.role,
      permissions=EXCLUDED.permissions,active=EXCLUDED.active,updated_at=EXCLUDED.updated_at`, [
      source.id, source.name, source.email, source.role,
      json({ sales: Boolean(source.can_sales), production: Boolean(source.can_production), purchases: Boolean(source.can_purchases), admin: Boolean(source.can_admin) }),
      Boolean(source.active), date(source.updated_at),
    ]);
  }

  for (const source of rows("organization_settings")) {
    await db.query(`INSERT INTO organization_settings
      (id,name,legal_name,tax_id,tax_regime,email,phone,website,address,quote_prefix,tax_rate,monthly_goal,updated_at)
      VALUES ('default',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,legal_name=EXCLUDED.legal_name,tax_id=EXCLUDED.tax_id,
      tax_regime=EXCLUDED.tax_regime,email=EXCLUDED.email,phone=EXCLUDED.phone,website=EXCLUDED.website,address=EXCLUDED.address,
      quote_prefix=EXCLUDED.quote_prefix,tax_rate=EXCLUDED.tax_rate,monthly_goal=EXCLUDED.monthly_goal,updated_at=EXCLUDED.updated_at`, [
      source.name, source.legal_name || "", source.tax_id || "", source.tax_regime || "", source.email || "", source.phone || "", source.website || "",
      json({ street: source.street || "", exteriorNumber: source.exterior_number || "", interiorNumber: source.interior_number || "", neighborhood: source.neighborhood || "", municipality: source.municipality || "", state: source.state || "", postalCode: source.postal_code || "", country: source.country || "México" }),
      source.quote_prefix || "CG", number(source.tax_rate, 16), number(source.monthly_goal), date(source.updated_at),
    ]);
  }

  for (const source of rows("materials")) {
    await db.query(`INSERT INTO materials
      (legacy_id,code,name,category_code,unit,cost,purchase_unit,purchase_cost,freight,width_m,length_m,package_quantity,updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (legacy_id) DO UPDATE SET code=EXCLUDED.code,name=EXCLUDED.name,category_code=EXCLUDED.category_code,
      unit=EXCLUDED.unit,cost=EXCLUDED.cost,purchase_unit=EXCLUDED.purchase_unit,purchase_cost=EXCLUDED.purchase_cost,
      freight=EXCLUDED.freight,width_m=EXCLUDED.width_m,length_m=EXCLUDED.length_m,package_quantity=EXCLUDED.package_quantity,updated_at=EXCLUDED.updated_at`, [
      source.id, source.code, source.name, materialCategory(source.category), source.unit, number(source.cost), source.purchase_unit || "unidad",
      number(source.purchase_cost), number(source.freight), number(source.width), number(source.length), number(source.package_quantity, 1), date(source.updated_at),
    ]);
  }

  for (const source of [...rows("arlon_cut_catalog").map((row) => ({ ...row, brand: "Arlon" })), ...rows("lx_cut_catalog")]) {
    await db.query(`INSERT INTO vinyl_catalog
      (legacy_id,brand,series,application,film_type,finish,durability,color_code,color_name,color_family,hex,available_widths,cost_061,cost_122,stock_status,active,updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      ON CONFLICT (legacy_id) DO UPDATE SET brand=EXCLUDED.brand,series=EXCLUDED.series,application=EXCLUDED.application,
      film_type=EXCLUDED.film_type,finish=EXCLUDED.finish,durability=EXCLUDED.durability,color_code=EXCLUDED.color_code,
      color_name=EXCLUDED.color_name,color_family=EXCLUDED.color_family,hex=EXCLUDED.hex,available_widths=EXCLUDED.available_widths,
      cost_061=EXCLUDED.cost_061,cost_122=EXCLUDED.cost_122,stock_status=EXCLUDED.stock_status,active=EXCLUDED.active,updated_at=EXCLUDED.updated_at`, [
      source.id, source.brand || "LX", source.series || "", source.application || "", source.film_type || "", source.finish || "", source.durability || "",
      source.color_code || "", source.color_name || "", source.color_family || "", source.hex || "", source.available_widths || "",
      number(source.meter_cost_061), number(source.meter_cost_122), source.stock_status || "Disponible", Boolean(source.active), date(source.updated_at),
    ]);
  }

  for (const source of rows("rigid_materials")) {
    await db.query(`INSERT INTO rigid_materials
      (legacy_id,sku,category,name,thickness,width_m,length_m,sheet_cost,cost_m2,minimum_fraction,special_full_sheet,reusable_offcut,default_cut,stock_status,updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (legacy_id) DO UPDATE SET sku=EXCLUDED.sku,category=EXCLUDED.category,name=EXCLUDED.name,thickness=EXCLUDED.thickness,
      width_m=EXCLUDED.width_m,length_m=EXCLUDED.length_m,sheet_cost=EXCLUDED.sheet_cost,cost_m2=EXCLUDED.cost_m2,
      minimum_fraction=EXCLUDED.minimum_fraction,special_full_sheet=EXCLUDED.special_full_sheet,reusable_offcut=EXCLUDED.reusable_offcut,
      default_cut=EXCLUDED.default_cut,stock_status=EXCLUDED.stock_status,updated_at=EXCLUDED.updated_at`, [
      source.id, `${source.sku || "RIG"}-${source.id}`, source.category, source.name, source.thickness || "", number(source.width, 1.22), number(source.length, 2.44),
      number(source.sheet_cost), number(source.cost_m2), number(source.minimum_fraction, .25), Boolean(source.special_full_sheet),
      Boolean(source.reusable_offcut), source.default_cut || "Router CNC", source.stock_status || "Disponible", date(source.updated_at),
    ]);
  }

  for (const source of rows("rigid_labor")) {
    await db.query(`INSERT INTO labor_rates
      (legacy_id,role,monthly_salary,employer_burden,scheduled_hours,utilization,loaded_monthly,productive_hour_cost,notes,updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (legacy_id) DO UPDATE SET role=EXCLUDED.role,monthly_salary=EXCLUDED.monthly_salary,employer_burden=EXCLUDED.employer_burden,
      scheduled_hours=EXCLUDED.scheduled_hours,utilization=EXCLUDED.utilization,loaded_monthly=EXCLUDED.loaded_monthly,
      productive_hour_cost=EXCLUDED.productive_hour_cost,notes=EXCLUDED.notes,updated_at=EXCLUDED.updated_at`, [
      source.id, source.role, number(source.monthly_salary), number(source.employer_burden, .34), number(source.scheduled_hours, 176),
      number(source.utilization, .85), number(source.loaded_monthly), number(source.productive_hour_cost), source.notes || "", date(source.updated_at),
    ]);
  }

  for (const source of rows("clients")) {
    await db.query(`INSERT INTO clients (legacy_id,name,company,fiscal,address,email,phone,customer_type,updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (legacy_id) DO UPDATE SET name=EXCLUDED.name,company=EXCLUDED.company,fiscal=EXCLUDED.fiscal,address=EXCLUDED.address,
      email=EXCLUDED.email,phone=EXCLUDED.phone,customer_type=EXCLUDED.customer_type,updated_at=EXCLUDED.updated_at`, [
      source.id, source.name, source.company || "",
      json({ legalName: source.legal_name || "", taxId: source.tax_id || "", taxRegime: source.tax_regime || "", cfdiUse: source.cfdi_use || "G03", postalCode: source.fiscal_postal_code || "" }),
      json({ street: source.street || "", exteriorNumber: source.exterior_number || "", interiorNumber: source.interior_number || "", neighborhood: source.neighborhood || "", municipality: source.municipality || "", state: source.state || "", country: source.country || "México" }),
      source.email || "", source.phone || "", source.customer_type || "Cliente Final", date(source.updated_at),
    ]);
  }

  for (const source of rows("quotes")) {
    await db.query(`INSERT INTO quotes (legacy_id,folio,customer_name,customer_type,seller,status,margin,subtotal,tax,total,payload,created_at,updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (legacy_id) DO UPDATE SET folio=EXCLUDED.folio,customer_name=EXCLUDED.customer_name,customer_type=EXCLUDED.customer_type,
      seller=EXCLUDED.seller,status=EXCLUDED.status,margin=EXCLUDED.margin,subtotal=EXCLUDED.subtotal,tax=EXCLUDED.tax,total=EXCLUDED.total,
      payload=EXCLUDED.payload,created_at=EXCLUDED.created_at,updated_at=EXCLUDED.updated_at`, [
      source.id, source.folio, source.customer_name, source.customer_type, source.seller, source.status, number(source.margin),
      number(source.subtotal), number(source.tax), number(source.total), json(source.payload), date(source.created_at), date(source.updated_at),
    ]);
  }

  for (const source of rows("purchase_orders")) {
    await db.query(`INSERT INTO purchase_orders
      (legacy_id,folio,supplier_id,supplier_name,quote_folio,project_name,status,items,subtotal,freight,tax,total,requested_by,required_date,notes,created_at,updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NULLIF($14,'' )::date,$15,$16,$17)
      ON CONFLICT (legacy_id) DO UPDATE SET folio=EXCLUDED.folio,supplier_id=EXCLUDED.supplier_id,supplier_name=EXCLUDED.supplier_name,
      quote_folio=EXCLUDED.quote_folio,project_name=EXCLUDED.project_name,status=EXCLUDED.status,items=EXCLUDED.items,subtotal=EXCLUDED.subtotal,
      freight=EXCLUDED.freight,tax=EXCLUDED.tax,total=EXCLUDED.total,requested_by=EXCLUDED.requested_by,required_date=EXCLUDED.required_date,
      notes=EXCLUDED.notes,created_at=EXCLUDED.created_at,updated_at=EXCLUDED.updated_at`, [
      source.id, source.folio, source.supplier_id || null, source.supplier_name || "", source.quote_folio || "", source.project_name || "", source.status || "Borrador",
      JSON.stringify(json(source.items_json, [])), number(source.subtotal), number(source.freight), number(source.tax), number(source.total), source.requested_by || "",
      source.required_date || "", source.notes || "", date(source.created_at), date(source.updated_at),
    ]);
  }

  for (const source of rows("material_cost_history")) {
    await db.query(`INSERT INTO material_cost_history (material_id,cost,source,recorded_at)
      SELECT id, $2, 'legacy_import', $3 FROM materials WHERE legacy_id=$1`, [source.material_id, number(source.purchase_cost), date(source.recorded_at)]);
  }

  await db.query("COMMIT");
  console.log(JSON.stringify({ imported: Object.fromEntries(Object.entries(tables).map(([name, table]) => [name, table.rows.length])) }, null, 2));
} catch (error) {
  await db.query("ROLLBACK");
  throw error;
} finally {
  await db.end();
}
