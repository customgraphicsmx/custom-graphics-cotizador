import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
export async function GET(r:Request){const x=no(r);if(x)return x;const q=await db.query("SELECT id,role,monthly_salary,employer_burden,scheduled_hours,utilization,loaded_monthly,productive_hour_cost,notes,updated_at FROM labor_rates ORDER BY monthly_salary DESC");return NextResponse.json(q.rows)}
