import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
export async function GET(r:Request){const x=no(r);if(x)return x;const q=await db.query(`SELECT id,brand,series,application,film_type,finish,durability,color_code,color_name,color_family,hex,available_widths,'' supplier,cost_061 meter_cost_061,cost_122 meter_cost_122,0::numeric freight,0::numeric free_shipping_threshold,stock_status,'Sin validar' equivalence_status,active,updated_at FROM vinyl_catalog WHERE active=true AND lower(brand)<>'arlon' ORDER BY brand,series,color_family,color_name`);return NextResponse.json(q.rows)}
