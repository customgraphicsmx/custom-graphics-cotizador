import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
export async function GET(r:Request){const x=no(r);if(x)return x;const q=await db.query("SELECT * FROM quotes ORDER BY updated_at DESC");return NextResponse.json(q.rows)}
export async function POST(r:Request){const x=no(r);if(x)return x;const b=await r.json();const q=await db.query(`INSERT INTO quotes(folio,customer_name,customer_type,seller,status,margin,subtotal,tax,total,payload) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb) ON CONFLICT(folio) DO UPDATE SET customer_name=excluded.customer_name,customer_type=excluded.customer_type,seller=excluded.seller,status=excluded.status,margin=excluded.margin,subtotal=excluded.subtotal,tax=excluded.tax,total=excluded.total,payload=excluded.payload,updated_at=now() RETURNING id,folio`,[str(b.folio)||"PTG-"+String(Date.now()).slice(-6),str(b.customerName)||"Cliente por definir",str(b.customerType),str(b.seller),str(b.status)||"Borrador",num(b.margin),num(b.subtotal),num(b.iva),num(b.total),JSON.stringify(b)]);return NextResponse.json(q.rows[0])}
