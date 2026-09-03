import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { isAdministratorRequest } from "../../../../../lib/admin";

export const runtime = "nodejs";

type JsonRecord = Record<string, unknown>;

const record = (value: unknown): JsonRecord =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : {};
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const text = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";
const number = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};
const validDate = (value: unknown): string | null => {
  const parsed = text(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(parsed) ? parsed : null;
};
const parsePayload = (value: unknown): JsonRecord => {
  if (typeof value === "string") {
    try {
      return record(JSON.parse(value));
    } catch {
      return {};
    }
  }
  return record(value);
};
const moduleCode = (payload: JsonRecord, item: JsonRecord): string =>
  text(item.moduleCode) ||
  (text(item.type) === "design"
    ? "design"
    : text(item.type) === "structure"
      ? "structure"
      : text(payload.quoteModule) || "custom");
const costCategory = (item: JsonRecord): string => {
  const kind = text(item.type);
  if (kind === "design") return "labor";
  if (kind === "structure") return "steel";
  if (kind === "installation" || kind === "shipping") return "logistics";
  return "raw_material";
};
const supplierFor = (item: JsonRecord): string => {
  const line = record(item.line);
  const material = record(item.material);
  return (
    text(line.cutSupplier) ||
    text(line.supplier) ||
    text(material.supplier) ||
    "Por asignar"
  );
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdministratorRequest(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const quoteResult = await client.query(
      "SELECT * FROM quotes WHERE id=$1 FOR UPDATE",
      [id],
    );
    if (!quoteResult.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "La cotización no existe." },
        { status: 404 },
      );
    }

    const quote = quoteResult.rows[0] as JsonRecord;
    const existing = await client.query(
      `SELECT so.id,so.folio,
        po.id production_order_id,po.folio production_order_folio
       FROM sales_orders so
       LEFT JOIN production_orders po ON po.sales_order_id=so.id
       WHERE so.quote_id=$1`,
      [id],
    );
    if (existing.rowCount) {
      const sales = existing.rows[0];
      const purchases = await client.query(
        "SELECT id,folio,supplier_name,status,total FROM purchase_orders WHERE sales_order_id=$1 ORDER BY created_at",
        [sales.id],
      );
      await client.query(
        "UPDATE quotes SET status='Venta',accepted_at=COALESCE(accepted_at,now()),updated_at=now() WHERE id=$1",
        [id],
      );
      await client.query("COMMIT");
      return NextResponse.json({
        ok: true,
        alreadyConverted: true,
        salesOrder: { id: sales.id, folio: sales.folio },
        productionOrder: {
          id: sales.production_order_id,
          folio: sales.production_order_folio,
        },
        purchaseOrders: purchases.rows,
      });
    }

    const payload = parsePayload(quote.payload);
    const projectName =
      text(payload.projectName) ||
      text(payload.description) ||
      `Proyecto ${text(quote.folio)}`;
    let projectId = text(quote.project_id);

    if (!projectId) {
      const projectFolioResult = await client.query(
        "SELECT 'PRY-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('project_folio_seq')::text,6,'0') folio",
      );
      const projectResult = await client.query(
        `INSERT INTO projects
          (folio,client_id,name,customer_snapshot,estimator,closer,customer_type,quote_date,expiration_date,status)
         VALUES($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9,'Venta')
         RETURNING id`,
        [
          projectFolioResult.rows[0].folio,
          text(payload.customerId) || quote.client_id || null,
          projectName,
          JSON.stringify({
            id: text(payload.customerId) || quote.client_id || null,
            name: text(quote.customer_name),
            type: text(quote.customer_type),
          }),
          text(payload.seller) || text(quote.seller),
          text(payload.closer),
          text(payload.customerType) || text(quote.customer_type),
          validDate(payload.quoteDate),
          validDate(payload.expirationDate),
        ],
      );
      projectId = projectResult.rows[0].id;
      await client.query("UPDATE quotes SET project_id=$1 WHERE id=$2", [
        projectId,
        id,
      ]);
    } else {
      await client.query(
        "UPDATE projects SET status='Venta',updated_at=now() WHERE id=$1",
        [projectId],
      );
    }

    const versionNumberResult = await client.query(
      "SELECT COALESCE(MAX(version_no),0)+1 version_no FROM quote_versions WHERE quote_id=$1",
      [id],
    );
    const versionResult = await client.query(
      `INSERT INTO quote_versions
        (quote_id,version_no,status,subtotal,tax,total,snapshot)
       VALUES($1,$2,'Aceptada',$3,$4,$5,$6::jsonb)
       RETURNING id`,
      [
        id,
        versionNumberResult.rows[0].version_no,
        number(quote.subtotal),
        number(quote.tax),
        number(quote.total),
        JSON.stringify(payload),
      ],
    );
    const versionId = versionResult.rows[0].id;

    const items = list(payload.items).map(record);
    const concepts: Array<{ id: string; item: JsonRecord }> = [];
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const conceptResult = await client.query(
        `INSERT INTO quote_concepts
          (quote_id,version_id,sequence_no,module_code,product_code,product_name,description,quantity,unit,unit_price,price,cost,technical_details)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb)
         RETURNING id`,
        [
          id,
          versionId,
          index + 1,
          moduleCode(payload, item),
          text(item.productCode) || text(record(item.line).productId),
          text(item.product) || `Concepto ${index + 1}`,
          text(item.description),
          number(item.quantity) || 1,
          text(item.unit) || "pieza",
          number(item.unitPrice),
          number(item.price),
          number(item.cost),
          JSON.stringify(item),
        ],
      );
      const conceptId = conceptResult.rows[0].id;
      concepts.push({ id: conceptId, item });
      if (number(item.cost) > 0) {
        await client.query(
          `INSERT INTO quote_cost_lines
            (quote_id,concept_id,module_code,category_code,label,quantity,unit,unit_cost,total_cost,metadata)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb)`,
          [
            id,
            conceptId,
            moduleCode(payload, item),
            costCategory(item),
            text(item.product) || `Concepto ${index + 1}`,
            number(item.quantity) || 1,
            text(item.unit) || "pieza",
            number(item.quantity)
              ? number(item.cost) / number(item.quantity)
              : number(item.cost),
            number(item.cost),
            JSON.stringify(item),
          ],
        );
      }
    }

    const salesFolioResult = await client.query(
      "SELECT 'PV-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('sales_order_folio_seq')::text,6,'0') folio",
    );
    const salesResult = await client.query(
      `INSERT INTO sales_orders
        (folio,project_id,quote_id,quote_version_id,customer_name,status,subtotal,tax,total,accepted_snapshot)
       VALUES($1,$2,$3,$4,$5,'Confirmada',$6,$7,$8,$9::jsonb)
       RETURNING id,folio`,
      [
        salesFolioResult.rows[0].folio,
        projectId,
        id,
        versionId,
        text(quote.customer_name),
        number(quote.subtotal),
        number(quote.tax),
        number(quote.total),
        JSON.stringify(payload),
      ],
    );
    const salesOrder = salesResult.rows[0];

    const productionFolioResult = await client.query(
      "SELECT 'OP-'||to_char(current_date,'YYYY')||'-'||lpad(nextval('production_order_folio_seq')::text,6,'0') folio",
    );
    const productionResult = await client.query(
      `INSERT INTO production_orders
        (folio,sales_order_id,project_id,quote_id,status,technical_details,notes)
       VALUES($1,$2,$3,$4,'Pendiente',$5::jsonb,$6)
       RETURNING id,folio`,
      [
        productionFolioResult.rows[0].folio,
        salesOrder.id,
        projectId,
        id,
        JSON.stringify(payload),
        `Generada automáticamente desde ${text(quote.folio)}.`,
      ],
    );
    const productionOrder = productionResult.rows[0];

    for (let index = 0; index < concepts.length; index += 1) {
      const { id: conceptId, item } = concepts[index];
      await client.query(
        `INSERT INTO production_order_items
          (production_order_id,concept_id,sequence_no,module_code,product_name,description,quantity,unit,specifications)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)`,
        [
          productionOrder.id,
          conceptId,
          index + 1,
          moduleCode(payload, item),
          text(item.product) || `Concepto ${index + 1}`,
          text(item.description),
          number(item.quantity) || 1,
          text(item.unit) || "pieza",
          JSON.stringify(item),
        ],
      );
    }

    const procurementGroups = list(payload.procurementGroups).map(record);
    const purchaseGroups = new Map<
      string,
      Array<{ conceptId: string; item: JsonRecord }>
    >();
    for (const concept of concepts) {
      if (text(concept.item.type) === "design" || number(concept.item.cost) <= 0) {
        continue;
      }
      const supplier = supplierFor(concept.item);
      const group = purchaseGroups.get(supplier) || [];
      group.push({ conceptId: concept.id, item: concept.item });
      purchaseGroups.set(supplier, group);
    }

    const purchaseOrders: Array<{
      id: string;
      folio: string;
      supplier_name: string;
      status: string;
      total: number;
    }> = [];
    for (const [supplier, group] of purchaseGroups.entries()) {
      const subtotal = group.reduce(
        (sum, entry) => sum + number(entry.item.cost),
        0,
      );
      const procurement = procurementGroups.find(
        (entry) => text(entry.supplier) === supplier,
      );
      const freight = number(procurement?.shipping);
      const tax = (subtotal + freight) * 0.16;
      const total = subtotal + freight + tax;
      const purchaseItems = group.map(({ item }, index) => ({
        sequence: index + 1,
        code:
          text(item.productCode) ||
          text(record(item.line).colorCode) ||
          text(record(item.line).productId),
        description:
          text(item.description) ||
          text(item.product) ||
          `Material de concepto ${index + 1}`,
        quantity:
          number(item.billableSheets) ||
          number(record(item.line).linearMeters) ||
          number(item.quantity) ||
          1,
        unit:
          number(item.billableSheets) > 0
            ? "lámina"
            : number(record(item.line).linearMeters) > 0
              ? "m lineal"
              : text(item.unit) || "unidad",
        unit_cost:
          number(item.quantity) > 0
            ? number(item.cost) / number(item.quantity)
            : number(item.cost),
        technical_details: item,
      }));
      const purchaseFolioResult = await client.query(
        "SELECT 'OC-'||to_char(current_date,'YYMMDD')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,6)) folio",
      );
      const purchaseResult = await client.query(
        `INSERT INTO purchase_orders
          (folio,supplier_name,quote_folio,project_name,status,items,subtotal,freight,tax,total,requested_by,notes,project_id,sales_order_id,production_order_id,auto_generated)
         VALUES($1,$2,$3,$4,'Borrador automático',$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13,$14,true)
         RETURNING id,folio,supplier_name,status,total`,
        [
          purchaseFolioResult.rows[0].folio,
          supplier,
          text(quote.folio),
          projectName,
          JSON.stringify(purchaseItems),
          subtotal,
          freight,
          tax,
          total,
          text(payload.seller) || text(quote.seller),
          "Revisar existencias, cantidades facturables y proveedor antes de emitir.",
          projectId,
          salesOrder.id,
          productionOrder.id,
        ],
      );
      const purchaseOrder = purchaseResult.rows[0];
      purchaseOrders.push(purchaseOrder);

      for (let index = 0; index < group.length; index += 1) {
        const { conceptId, item } = group[index];
        const purchaseItem = purchaseItems[index];
        await client.query(
          `INSERT INTO purchase_order_items
            (purchase_order_id,concept_id,sequence_no,material_code,description,quantity,unit,unit_cost,total_cost,technical_details)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb)`,
          [
            purchaseOrder.id,
            conceptId,
            index + 1,
            purchaseItem.code,
            purchaseItem.description,
            purchaseItem.quantity,
            purchaseItem.unit,
            purchaseItem.unit_cost,
            number(item.cost),
            JSON.stringify(item),
          ],
        );
      }
    }

    await client.query(
      "UPDATE quotes SET status='Venta',accepted_at=now(),updated_at=now() WHERE id=$1",
      [id],
    );
    await client.query("COMMIT");

    return NextResponse.json(
      {
        ok: true,
        projectId,
        salesOrder,
        productionOrder,
        purchaseOrders,
      },
      { status: 201 },
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("convert-to-sale failed", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible convertir la cotización.",
      },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
