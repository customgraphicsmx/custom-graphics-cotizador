import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
export async function GET(r:Request){const x=no(r);if(x)return x;const q=await db.query("SELECT id,folio,supplier_id,supplier_name,quote_folio,project_name,status,items items_json,items,subtotal,freight,tax,total,requested_by,required_date,notes,created_at,updated_at FROM purchase_orders ORDER BY updated_at DESC");return NextResponse.json(q.rows)}
export async function POST(r:Request){const x=no(r);if(x)return x;const b=await r.json();const q=await db.query("SELECT count(*)::int n FROM purchase_orders");const folio="OC-"+String(q.rows[0].n+1).padStart(5,"0");const z=await db.query(`INSERT INTO purchase_orders(folio,supplier_id,supplier_name,quote_folio,project_name,status,items,subtotal,freight,tax,total,requested_by,required_date,notes) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,[folio,b.supplier_id||null,str(b.supplier_name),str(b.quote_folio),str(b.project_name),str(b.status)||"Borrador",JSON.stringify(b.items||[]),num(b.subtotal),num(b.freight),num(b.tax),num(b.total),str(b.requested_by),b.required_date||null,str(b.notes)]);return NextResponse.json({id:z.rows[0].id,folio})}
