import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { isAdministratorRequest } from "../../../../lib/admin";
export const runtime="nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const n=(v:unknown)=>Number(v)||0; const s=(v:unknown)=>typeof v==="string"?v:"";
export async function PATCH(r:Request,{params}:{params:Promise<{id:string}>}){const x=no(r);if(x)return x;const {id}=await params,b=await r.json();if(b.status)await db.query("UPDATE quotes SET status=$1,updated_at=now() WHERE id=$2",[s(b.status),id]);return NextResponse.json({ok:true})}export async function DELETE(r:Request,{params}:{params:Promise<{id:string}>}){const x=no(r);if(x)return x;const {id}=await params;await db.query("DELETE FROM quotes WHERE id=$1",[id]);return NextResponse.json({ok:true})}