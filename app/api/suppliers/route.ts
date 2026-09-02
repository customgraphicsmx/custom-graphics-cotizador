import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
function map(a:any){const c=a.contact||{},d=a.address||{};return {...a,contact_name:c.name||"",email:c.email||"",phone:c.phone||"",address:d.street||"",city:d.city||"",state:d.state||"",postal_code:d.postal_code||""}}
export async function GET(r:Request){const x=no(r);if(x)return x;const q=await db.query("SELECT * FROM suppliers WHERE active=true ORDER BY name");return NextResponse.json(q.rows.map(map))}
export async function POST(r:Request){const x=no(r);if(x)return x;const b=await r.json();const q=await db.query(`INSERT INTO suppliers(code,name,legal_name,tax_id,contact,address,payment_terms,default_freight,free_shipping_threshold,notes) VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$9,$10) RETURNING id`,[str(b.code)||"PROV-"+Date.now(),str(b.name),str(b.legal_name),str(b.tax_id),JSON.stringify({name:str(b.contact_name),email:str(b.email),phone:str(b.phone)}),JSON.stringify({street:str(b.address),city:str(b.city),state:str(b.state),postal_code:str(b.postal_code)}),str(b.payment_terms)||"Contado",num(b.default_freight),num(b.free_shipping_threshold),str(b.notes)]);return NextResponse.json({id:q.rows[0].id})}
