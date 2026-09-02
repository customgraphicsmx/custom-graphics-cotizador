import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { isAdministratorRequest } from "../../../../lib/admin";
export const runtime="nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const n=(v:unknown)=>Number(v)||0; const s=(v:unknown)=>typeof v==="string"?v:"";
export async function PATCH(r:Request,{params}:{params:Promise<{id:string}>}){const x=no(r);if(x)return x;const {id}=await params,b=await r.json(),w=Math.max(.01,n(b.width)||1.22),l=Math.max(.01,n(b.length)||2.44),cost=Math.max(0,n(b.sheet_cost));await db.query(`UPDATE rigid_materials SET sku=$1,category=$2,name=$3,thickness=$4,width_m=$5,length_m=$6,sheet_cost=$7,cost_m2=$8,minimum_fraction=$9,special_full_sheet=$10,reusable_offcut=$11,default_cut=$12,stock_status=$13,updated_at=now() WHERE id=$14`,[s(b.sku),s(b.category),s(b.name),s(b.thickness),w,l,cost,cost/(w*l),Math.max(.01,Math.min(1,n(b.minimum_fraction)||.25)),!!b.special_full_sheet,!!b.reusable_offcut,s(b.default_cut)||"Router CNC",s(b.stock_status)||"Disponible",id]);return NextResponse.json({ok:true})}