import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
function map(a:any){const p=a.permissions||{};return {...a,can_sales:!!p.can_sales,can_production:!!p.can_production,can_purchases:!!p.can_purchases,can_admin:!!p.can_admin}}
export async function GET(r:Request){const x=no(r);if(x)return x;const q=await db.query("SELECT * FROM app_users ORDER BY active DESC,name");return NextResponse.json(q.rows.map(map))}
export async function POST(r:Request){const x=no(r);if(x)return x;const b=await r.json();const q=await db.query(`INSERT INTO app_users(name,email,role,permissions) VALUES($1,$2,$3,$4::jsonb) RETURNING id`,[str(b.name),str(b.email).toLowerCase(),str(b.role),JSON.stringify({can_sales:!!b.can_sales,can_production:!!b.can_production,can_purchases:!!b.can_purchases,can_admin:!!b.can_admin})]);return NextResponse.json({id:q.rows[0].id})}
