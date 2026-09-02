import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
export async function GET(r:Request){const x=no(r);if(x)return x;const q=await db.query(`SELECT rm.id,rm.sku,rm.category,rm.name,COALESCE(s.name,'') supplier,rm.thickness,rm.width_m width,rm.length_m length,rm.sheet_cost,rm.cost_m2,rm.minimum_fraction,rm.special_full_sheet,rm.reusable_offcut,rm.default_cut,rm.stock_status,rm.updated_at FROM rigid_materials rm LEFT JOIN suppliers s ON s.id=rm.supplier_id ORDER BY rm.category,rm.name`);return NextResponse.json(q.rows)}
