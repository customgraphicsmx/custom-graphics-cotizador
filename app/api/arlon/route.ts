import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
export async function GET(r:Request){const x=no(r);if(x)return x;const q=await db.query(`SELECT id,series,application,film_type,finish,durability,color_code,color_name,color_family,hex,available_widths,45.72::numeric roll_length,'ARLON' supplier,cost_061 roll_cost_061,0::numeric roll_cost_076,cost_122 roll_cost_122,0::numeric freight,(cost_061/45.72) meter_cost_061,(cost_122/45.72) meter_cost_122,stock_status,active,updated_at FROM vinyl_catalog WHERE active=true AND lower(brand)='arlon' ORDER BY series,color_family,color_name`);return NextResponse.json(q.rows)}
