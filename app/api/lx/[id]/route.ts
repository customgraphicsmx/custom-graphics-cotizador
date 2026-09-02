import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { isAdministratorRequest } from "../../../../lib/admin";
export const runtime="nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const n=(v:unknown)=>Number(v)||0; const s=(v:unknown)=>typeof v==="string"?v:"";
export async function PATCH(r:Request,{params}:{params:Promise<{id:string}>}){const x=no(r);if(x)return x;const {id}=await params,b=await r.json();await db.query("UPDATE vinyl_catalog SET cost_061=$1,cost_122=$2,stock_status=$3,active=$4,updated_at=now() WHERE id=$5",[n(b.meter_cost_061),n(b.meter_cost_122),s(b.stock_status)||"Costo pendiente",b.active!==0,id]);return NextResponse.json({ok:true})}