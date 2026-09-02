import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { isAdministratorRequest } from "../../../../lib/admin";
export const runtime="nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const n=(v:unknown)=>Number(v)||0; const s=(v:unknown)=>typeof v==="string"?v:"";
export async function PATCH(r:Request,{params}:{params:Promise<{id:string}>}){const x=no(r);if(x)return x;const {id}=await params,b=await r.json();await db.query(`UPDATE app_users SET name=$1,email=$2,role=$3,permissions=$4::jsonb,active=$5,updated_at=now() WHERE id=$6`,[s(b.name),s(b.email).toLowerCase(),s(b.role),JSON.stringify({can_sales:!!b.can_sales,can_production:!!b.can_production,can_purchases:!!b.can_purchases,can_admin:!!b.can_admin}),b.active!==0,id]);return NextResponse.json({ok:true})}