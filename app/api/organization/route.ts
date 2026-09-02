import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
function map(a:any){const d=a.address||{};return {...a,street:d.street||"",exterior_number:d.exterior_number||"",interior_number:d.interior_number||"",neighborhood:d.neighborhood||"",municipality:d.municipality||"",state:d.state||"",postal_code:d.postal_code||"",country:d.country||"México"}}
export async function GET(r:Request){const x=no(r);if(x)return x;let q=await db.query("SELECT * FROM organization_settings WHERE id='default'");if(!q.rowCount){q=await db.query("INSERT INTO organization_settings(id,name,legal_name,monthly_goal) VALUES('default','Custom Graphics','Custom Graphics',600000) RETURNING *")}return NextResponse.json(map(q.rows[0]))}
export async function PATCH(r:Request){const x=no(r);if(x)return x;const b=await r.json(),a=JSON.stringify({street:str(b.street),exterior_number:str(b.exterior_number),interior_number:str(b.interior_number),neighborhood:str(b.neighborhood),municipality:str(b.municipality),state:str(b.state),postal_code:str(b.postal_code),country:str(b.country)||"México"});await db.query(`UPDATE organization_settings SET name=$1,legal_name=$2,tax_id=$3,tax_regime=$4,email=$5,phone=$6,website=$7,address=$8::jsonb,quote_prefix=$9,tax_rate=$10,monthly_goal=$11,updated_at=now() WHERE id='default'`,[str(b.name),str(b.legal_name),str(b.tax_id),str(b.tax_regime),str(b.email),str(b.phone),str(b.website),a,str(b.quote_prefix)||"PTG",num(b.tax_rate)||16,num(b.monthly_goal)||600000]);return NextResponse.json({ok:true})}
