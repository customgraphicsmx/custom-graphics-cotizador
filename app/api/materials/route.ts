import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { isAdministratorRequest } from "../../../lib/admin";
export const runtime = "nodejs";
const no=(r:Request)=>!isAdministratorRequest(r)?NextResponse.json({error:"No autorizado."},{status:401}):null;
const num=(v:unknown)=>Number(v)||0;
const str=(v:unknown)=>typeof v==="string"?v:"";
function cost(b:any){const total=num(b.purchase_cost)+num(b.freight), q=Math.max(.0001,num(b.package_quantity)||1),w=num(b.width),l=num(b.length);return b.unit==="m²"&&w&&l?total/(w*l*q):(b.unit==="metro lineal"||b.unit==="ml")&&l?total/(l*q):total/q}
export async function GET(r:Request){const x=no(r);if(x)return x;const q=await db.query(`SELECT m.id,m.code,m.name,COALESCE(c.name,m.category_code) category,m.unit,m.cost,COALESCE(s.name,'') supplier,m.purchase_unit,m.purchase_cost,m.freight,m.width_m width,m.length_m length,m.package_quantity,m.updated_at, h.avg historical_avg_cost,h.n historical_updates FROM materials m LEFT JOIN cost_categories c ON c.code=m.category_code LEFT JOIN suppliers s ON s.id=m.supplier_id LEFT JOIN (SELECT material_id,AVG(cost) avg,COUNT(*) n FROM material_cost_history GROUP BY material_id) h ON h.material_id=m.id WHERE m.active=true ORDER BY category,m.name`);return NextResponse.json(q.rows)}
export async function POST(r:Request){const x=no(r);if(x)return x;const b=await r.json(), c=cost(b);const q=await db.query(`INSERT INTO materials(code,name,category_code,unit,cost,purchase_unit,purchase_cost,freight,width_m,length_m,package_quantity) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,[str(b.code)||"SIN-COD",str(b.name)||"Nuevo insumo",str(b.category_code)||"raw_material",str(b.unit)||"m²",c,str(b.purchase_unit)||"unidad",num(b.purchase_cost),num(b.freight),num(b.width),num(b.length),Math.max(.0001,num(b.package_quantity)||1)]);return NextResponse.json({id:q.rows[0].id,cost:c})}
