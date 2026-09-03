"use client";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
type Mode = "area" | "linear";
type Equipment = "HP Latex" | "Solvente Flytoo" | "UV";
type PerimeterFinish = "ACA-01" | "ACA-02" | "ACA-03" | "ACA-05";
type GrommetPattern = "OJ-00" | "OJ-ESQ" | "OJ-100" | "OJ-050" | "OJ-025";
type WeedComplexity = "simple" | "media" | "alta";
type CustomerType =
  "" | "Cliente Maquila" | "Cliente Frecuente" | "Cliente Final";
type DesignService = "DIS-00" | "DIS-01" | "DIS-02" | "DIS-03" | "DIS-04";
type QuoteRecord = {
  id: string;
  folio: string;
  customer_name: string;
  customer_type: string;
  seller: string;
  status: string;
  margin: number;
  subtotal: number;
  tax: number;
  total: number;
  payload: string;
  created_at: number;
  updated_at: number;
};
type MaterialRecord = {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  cost: number;
  supplier: string;
  purchase_unit: string;
  purchase_cost: number;
  freight: number;
  width: number;
  length: number;
  package_quantity: number;
  updated_at: number;
  historical_avg_cost?: number;
  historical_updates?: number;
};
type RigidMaterialRecord = {
  id: string;
  sku: string;
  category: string;
  name: string;
  supplier: string;
  thickness: string;
  width: number;
  length: number;
  sheet_cost: number;
  cost_m2: number;
  minimum_fraction: number;
  special_full_sheet: number;
  reusable_offcut: number;
  default_cut: string;
  stock_status: string;
  updated_at: number;
  historical_avg_cost?: number;
  historical_updates?: number;
};
type RigidLaborRecord = {
  id: string;
  role: string;
  monthly_salary: number;
  employer_burden: number;
  scheduled_hours: number;
  utilization: number;
  loaded_monthly: number;
  productive_hour_cost: number;
  notes: string;
  updated_at: number;
};
type QuoteModule = "print-to-go" | "rigid" | "signage" | "letters3d";
type SystemChoice =
  | "design"
  | "printing"
  | "rigid-signage"
  | "structure"
  | "finishes";
type RigidQuoteDraft = {
  materialId: string;
  width: number;
  height: number;
  quantity: number;
  description: string;
  graphic: "none" | "printed" | "cut";
  vinylProductId: string;
  mounting: boolean;
  weeding: boolean;
  cutProcess: string;
  operatorHours: number;
  assistantHours: number;
  vinylCost: number;
  workComplexity: "simple" | "standard" | "complex";
  cutCatalog: "" | "arlon" | "lx";
  laminationId:
    | ""
    | "transparente-mate"
    | "transparente-brillante"
    | "arlon-3510";
};
type StructureDraft = {
  enabled: boolean;
  targetLineId: number | null;
  profile: string;
  horizontalReinforcements: number;
  verticalReinforcements: number;
  paint: boolean;
  installationReady: boolean;
  notes: string;
};
type SupplierRecord = {
  id: string;
  code: string;
  name: string;
  legal_name: string;
  tax_id: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  payment_terms: string;
  default_freight: number;
  free_shipping_threshold: number;
  notes: string;
  active: number;
  updated_at: number;
};
type PurchaseItem = {
  category?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_cost: number;
};
type PurchaseOrderRecord = {
  id: string;
  folio: string;
  supplier_id: string;
  supplier_name: string;
  quote_folio: string;
  project_name: string;
  status: string;
  items_json: string;
  subtotal: number;
  freight: number;
  tax: number;
  total: number;
  requested_by: string;
  required_date: string;
  notes: string;
  created_at: number;
  updated_at: number;
};
type OrganizationRecord = {
  id: string;
  name: string;
  legal_name: string;
  tax_id: string;
  tax_regime: string;
  email: string;
  phone: string;
  website: string;
  street: string;
  exterior_number: string;
  interior_number: string;
  neighborhood: string;
  municipality: string;
  state: string;
  postal_code: string;
  country: string;
  quote_prefix: string;
  tax_rate: number;
  monthly_goal: number;
  updated_at: number;
};
type AppUserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  can_sales: number;
  can_production: number;
  can_purchases: number;
  can_admin: number;
  active: number;
  updated_at: number;
};
type ArlonRecord = {
  id: string;
  series: string;
  application: string;
  film_type: string;
  finish: string;
  durability: string;
  color_code: string;
  color_name: string;
  color_family: string;
  hex: string;
  available_widths: string;
  roll_length: number;
  supplier: string;
  roll_cost_061: number;
  roll_cost_076: number;
  roll_cost_122: number;
  meter_cost_061: number;
  meter_cost_122: number;
  freight: number;
  stock_status: string;
  active: number;
  updated_at: number;
};
type LxRecord = {
  id: string;
  brand: string;
  series: string;
  application: string;
  film_type: string;
  finish: string;
  durability: string;
  color_code: string;
  color_name: string;
  color_family: string;
  hex: string;
  available_widths: string;
  supplier: string;
  meter_cost_061: number;
  meter_cost_122: number;
  freight: number;
  free_shipping_threshold: number;
  stock_status: string;
  equivalence_status: string;
  active: number;
  updated_at: number;
};
type ClientRecord = {
  id: string;
  name: string;
  company: string;
  legal_name: string;
  tax_id: string;
  tax_regime: string;
  cfdi_use: string;
  fiscal_postal_code: string;
  street: string;
  exterior_number: string;
  interior_number: string;
  neighborhood: string;
  municipality: string;
  state: string;
  country: string;
  email: string;
  phone: string;
  customer_type: string;
  updated_at: number;
};
type Product = {
  id: string;
  name: string;
  mode: Mode;
  substrate: number;
  rollWidth: number;
};
type Line = {
  id: number;
  productId: string;
  width: number;
  height: number;
  quantity: number;
  fileDescription: string;
  linearMeters: number;
  equipment: Equipment;
  whiteInk: boolean;
  varnish: number;
  hem: boolean;
  grommets: boolean;
  grommetQty: number;
  perimeterFinish: PerimeterFinish;
  grommetPattern: GrommetPattern;
  tensionedOnStructure: boolean;
  panelization: "none" | "horizontal" | "vertical";
  trim: boolean;
  shapeCut: boolean;
  colorCode: string;
  arlonId: string;
  arlonSeries: string;
  arlonColorName: string;
  arlonFinish: string;
  arlonApplication: string;
  arlonWidth: number;
  arlonCostPerLinear: number;
  cutCatalog: "Arlon" | "LX Hausys / DM Lite";
  cutSupplier: string;
  cutFreight: number;
  cutFreeShippingThreshold: number;
  cutWidth: 0.61 | 1.22;
  weedComplexity: WeedComplexity;
};
const products: Product[] = [
  {
    id: "lona",
    name: "Lona Front 13 oz · 1.60 m",
    mode: "area",
    substrate: 20,
    rollWidth: 1.6,
  },
  {
    id: "mate",
    name: "Vinil Mate Básico",
    mode: "area",
    substrate: 32,
    rollWidth: 1.5,
  },
  {
    id: "brillante",
    name: "Vinil Brillante Básico",
    mode: "area",
    substrate: 32,
    rollWidth: 1.5,
  },
  {
    id: "micro",
    name: "Vinil Microperforado",
    mode: "area",
    substrate: 43,
    rollWidth: 1.5,
  },
  {
    id: "transparente-mate",
    name: "Vinil Transparente Mate Básico",
    mode: "area",
    substrate: 32,
    rollWidth: 1.5,
  },
  {
    id: "transparente-brillante",
    name: "Vinil Transparente Brillante Básico",
    mode: "area",
    substrate: 32,
    rollWidth: 1.5,
  },
  {
    id: "electrostatico",
    name: "Vinil Electrostático",
    mode: "area",
    substrate: 49,
    rollWidth: 1.5,
  },
  {
    id: "esmerilado",
    name: "Vinil Esmerilado",
    mode: "area",
    substrate: 84,
    rollWidth: 1.2,
  },
  {
    id: "backlight",
    name: "Película Backlight",
    mode: "area",
    substrate: 73,
    rollWidth: 1.5,
  },
  {
    id: "arlon-dpf510",
    name: "Vinil Mate Arlon DPF510",
    mode: "area",
    substrate: 53,
    rollWidth: 1.5,
  },
  {
    id: "arlon-3510",
    name: "Vinil Transparente Mate Arlon 3510",
    mode: "area",
    substrate: 48,
    rollWidth: 1.5,
  },
  {
    id: "recorte",
    name: "Vinil de Recorte",
    mode: "linear",
    substrate: 72,
    rollWidth: 0.61,
  },
];
const ink: Record<Equipment, number> = {
  "HP Latex": 46,
  "Solvente Flytoo": 34,
  UV: 55,
};
const customerMargins: Record<Exclude<CustomerType, "">, number> = {
  "Cliente Maquila": 45,
  "Cliente Frecuente": 55,
  "Cliente Final": 65,
};
const designServices: Record<
  DesignService,
  { name: string; description: string; price: number; cost: number }
> = {
  "DIS-00": {
    name: "Archivo listo para imprimir",
    description: "Revisión técnica y preparación para producción.",
    price: 0,
    cost: 0,
  },
  "DIS-01": {
    name: "Ajuste básico de archivo",
    description: "Cambio de medida, textos, acomodo menor o exportación.",
    price: 150,
    cost: 72,
  },
  "DIS-02": {
    name: "Adaptación de diseño",
    description: "Adaptación de un arte existente al formato solicitado.",
    price: 300,
    cost: 144,
  },
  "DIS-03": {
    name: "Diseño básico desde cero",
    description: "Una composición gráfica para lona o vinil.",
    price: 600,
    cost: 288,
  },
  "DIS-04": {
    name: "Diseño avanzado",
    description: "Composición con mayor contenido y tratamiento gráfico.",
    price: 900,
    cost: 432,
  },
};
const taxRegimes = [
  ["601", "General de Ley Personas Morales"],
  ["603", "Personas Morales con Fines no Lucrativos"],
  ["605", "Sueldos y Salarios e Ingresos Asimilados a Salarios"],
  ["606", "Arrendamiento"],
  ["607", "Régimen de Enajenación o Adquisición de Bienes"],
  ["608", "Demás ingresos"],
  [
    "610",
    "Residentes en el Extranjero sin Establecimiento Permanente en México",
  ],
  ["611", "Ingresos por Dividendos (socios y accionistas)"],
  ["612", "Personas Físicas con Actividades Empresariales y Profesionales"],
  ["614", "Ingresos por intereses"],
  ["615", "Ingresos por obtención de premios"],
  ["616", "Sin obligaciones fiscales"],
  [
    "620",
    "Sociedades Cooperativas de Producción que optan por diferir sus ingresos",
  ],
  ["621", "Incorporación Fiscal"],
  ["622", "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras"],
  ["623", "Opcional para Grupos de Sociedades"],
  ["624", "Coordinados"],
  [
    "625",
    "Actividades Empresariales con ingresos a través de Plataformas Tecnológicas",
  ],
  ["626", "Régimen Simplificado de Confianza"],
] as const;
const blank = (id: number): Line => ({
  id,
  productId: "lona",
  width: 1,
  height: 1,
  quantity: 1,
  fileDescription: "",
  linearMeters: 1,
  equipment: "Solvente Flytoo",
  whiteInk: false,
  varnish: 0,
  hem: false,
  grommets: false,
  grommetQty: 0,
  perimeterFinish: "ACA-01",
  grommetPattern: "OJ-00",
  tensionedOnStructure: false,
  panelization: "none",
  trim: false,
  shapeCut: false,
  colorCode: "",
  arlonId: "",
  arlonSeries: "",
  arlonColorName: "",
  arlonFinish: "",
  arlonApplication: "",
  arlonWidth: 0,
  arlonCostPerLinear: 0,
  cutCatalog: "LX Hausys / DM Lite",
  cutSupplier: "Proveedor local LX",
  cutFreight: 0,
  cutFreeShippingThreshold: 0,
  cutWidth: 0.61,
  weedComplexity: "simple",
});
const cutPurchaseOrigin = (line: Line) =>
  line.cutCatalog === "Arlon" || line.linearMeters >= 5
    ? "Guadalajara"
    : "Local";
const needsSmallArlonFreight = (line: Line) =>
  line.productId === "recorte" &&
  line.cutCatalog === "Arlon" &&
  line.linearMeters < 5;
const money = (v: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(v);
function automaticGrommets(l: Line) {
  const perimeter = 2 * (l.width + l.height);
  if (l.grommetPattern === "OJ-00") return 0;
  if (l.grommetPattern === "OJ-ESQ") return 4 * l.quantity;
  const spacing =
    l.grommetPattern === "OJ-100"
      ? 1
      : l.grommetPattern === "OJ-050"
        ? 0.5
        : 0.25;
  return Math.max(4, Math.ceil(perimeter / spacing)) * l.quantity;
}
function calc(l: Line) {
  const p = products.find((x) => x.id === l.productId)!;
  if (p.mode === "linear") {
    const selectedWidth = l.cutWidth || l.arlonWidth || p.rollWidth,
      material =
        l.linearMeters *
        (l.arlonId
          ? l.arlonCostPerLinear
          : selectedWidth > 1
            ? p.substrate * 1.75
            : p.substrate);
    const transferWidth = 1.22,
      transferCostPerM2 = 28,
      transfer = l.linearMeters * transferWidth * transferCostPerM2;
    const complexity = l.weedComplexity || "simple",
      weedRate = complexity === "alta" ? 70 : complexity === "media" ? 42 : 22,
      labor = l.linearMeters * weedRate;
    return {
      net: l.linearMeters * selectedWidth,
      bill: l.linearMeters * selectedWidth,
      waste: 0,
      material,
      ink: 0,
      finishes: 0,
      transfer,
      weedLabor: labor,
      labor,
      cost: material + transfer + labor,
    };
  }
  const baseNet = l.width * l.height * l.quantity,
    panelDirection = l.panelization || "none",
    panelCount =
      p.id === "lona" && panelDirection === "horizontal"
        ? Math.ceil(l.width / 1.55)
        : p.id === "lona" && panelDirection === "vertical"
          ? Math.ceil(l.height / 1.55)
          : 1,
    panelOverlap =
      p.id === "lona" && panelDirection !== "none"
        ? Math.max(0, panelCount - 1) *
          0.05 *
          (panelDirection === "horizontal" ? l.height : l.width) *
          l.quantity
        : 0,
    net = baseNet + panelOverlap,
    across = Math.max(1, Math.floor(p.rollWidth / Math.min(l.width, l.height))),
    rows = Math.ceil(l.quantity / across),
    optimizedBill = Math.max(
      net,
      p.rollWidth * Math.max(l.width, l.height) * rows,
    ),
    bill = p.id === "lona" ? net * 1.1 : optimizedBill,
    waste = bill - net,
    material = bill * p.substrate;
  const equipment = p.id === "lona" ? "Solvente Flytoo" : l.equipment;
  let print = bill * ink[equipment];
  if (equipment === "UV")
    print += bill * 55 * ((l.whiteInk ? 1 : 0) + l.varnish);
  const perimeter = 2 * (l.width + l.height) * l.quantity,
    grommetQty = p.id === "lona" ? automaticGrommets(l) : 0;
  let perimeterMaterial = 0,
    perimeterLabor = 0;
  if (p.id === "lona") {
    if (l.perimeterFinish === "ACA-02") {
      perimeterMaterial = perimeter * 3;
      perimeterLabor = perimeter * 8;
    }
    if (l.perimeterFinish === "ACA-03") {
      const bags = 2 * l.width * l.quantity;
      perimeterMaterial = bags * 10;
      perimeterLabor = bags * 12;
    }
    if (l.perimeterFinish === "ACA-05") {
      perimeterMaterial = perimeter * 10;
      perimeterLabor = perimeter * 14;
    }
  }
  const finishes =
      perimeterMaterial +
      grommetQty * 4.5 +
      (l.trim ? perimeter * 8 : 0) +
      (l.shapeCut ? perimeter * 14 : 0),
    baseLabor = p.id === "lona" ? 12 : 28,
    labor =
      baseLabor +
      perimeterLabor +
      grommetQty * 1.8 +
      (l.trim ? perimeter * 5 : 0) +
      (l.shapeCut ? perimeter * 10 : 0);
  return {
    net,
    bill,
    waste,
    material,
    ink: print,
    finishes,
    transfer: 0,
    weedLabor: 0,
    labor,
    cost: material + print + finishes + labor,
  };
}
const marginFloors: Record<Exclude<CustomerType, "">, number> = {
  "Cliente Maquila": 35,
  "Cliente Frecuente": 42,
  "Cliente Final": 50,
};
function compatibleKey(l: Line) {
  return [
    l.productId,
    l.productId === "lona" ? "Solvente Flytoo" : l.equipment,
    l.whiteInk,
    l.varnish,
    l.perimeterFinish,
    l.grommetPattern,
    l.trim,
    l.shapeCut,
    l.cutCatalog,
    l.cutWidth,
    l.weedComplexity,
  ].join("|");
}
function volumeAdjustment(volume: number) {
  return volume >= 50 ? 8 : volume >= 25 ? 5 : volume >= 10 ? 3 : 0;
}
function laborVolumeFactor(units: number) {
  return units >= 50 ? 0.75 : units >= 25 ? 0.82 : units >= 10 ? 0.9 : 1;
}
function structureRecipe(
  width: number,
  height: number,
  quantity: number,
  profileOverride: string = "",
  horizontalOverride: number = -1,
  verticalOverride: number = -1,
) {
  const longest = Math.max(width, height),
    area = width * height;
  const profile =
    profileOverride ||
    (area <= 2.25 && longest <= 1.5
      ? "Tubular ½” × ½” cal. 18"
      : area <= 6 && longest <= 3
        ? "Tubular ¾” × ¾” cal. 18"
        : "Tubular 1” × 1” cal. 18");
  const suggested = Math.max(0, Math.ceil(longest / 1.5) - 1),
    horizontalReinforcements = horizontalOverride >= 0 ? horizontalOverride : 0,
    verticalReinforcements =
      verticalOverride >= 0 ? verticalOverride : suggested;
  const perimeter = 2 * (width + height),
    cutMeters =
      (perimeter +
        horizontalReinforcements * width +
        verticalReinforcements * height) *
      quantity,
    requiredMeters = cutMeters * 1.1,
    bars = Math.ceil(requiredMeters / 6),
    pijas =
      Math.ceil(perimeter / 0.3) * quantity +
      Math.ceil(perimeter / 0.3) * quantity * 0.1,
    laborHours =
      (1.25 +
        cutMeters * 0.11 +
        (horizontalReinforcements + verticalReinforcements) * 0.35) *
      Math.max(1, quantity * 0.75);
  return {
    profile,
    horizontalReinforcements,
    verticalReinforcements,
    perimeter,
    cutMeters,
    requiredMeters,
    bars,
    pijas,
    laborHours,
  };
}
function technicalDescription(l: Line) {
  const p = products.find((x) => x.id === l.productId)!;
  if (p.mode === "linear")
    return `${l.arlonSeries ? `Vinil de recorte ${l.cutCatalog || "Arlon"} ${l.arlonSeries}` : p.name}${l.arlonColorName ? `, ${l.arlonColorName} (${l.colorCode})` : ""}${l.arlonFinish ? `, acabado ${l.arlonFinish.toLowerCase()}` : ""}, ancho ${(l.cutWidth || l.arlonWidth || p.rollWidth) * 100 >= 100 ? "122" : "60"} cm. Suministro de ${l.linearMeters} m lineales, corte y depilado de complejidad ${l.weedComplexity || "simple"}, con papel transfer de 122 cm incluido.`;
  const measure = `${l.width} × ${l.height} m`,
    print =
      l.productId === "lona"
        ? "impresión solvente Flytoo"
        : `impresión ${l.equipment}`;
  let finish = "";
  if (l.productId === "lona") {
    const perimeter = {
      "ACA-01": "corte al ras",
      "ACA-02": "dobladillo sellado",
      "ACA-03": "bolsa superior e inferior",
      "ACA-05": "bolsa perimetral",
    }[l.perimeterFinish];
    const panel =
      l.panelization && l.panelization !== "none"
        ? ` Panelación ${l.panelization === "horizontal" ? "horizontal" : "vertical"} en ${l.panelization === "horizontal" ? Math.ceil(l.width / 1.55) : Math.ceil(l.height / 1.55)} paños.`
        : "";
    finish = l.tensionedOnStructure
      ? ` Para tensar en bastidor: sin bastilla ni ojillos.${panel}`
      : ` Acabado: ${perimeter}${l.grommetPattern !== "OJ-00" ? ` y ${automaticGrommets(l)} ojillos` : ""}.${panel}`;
  } else {
    const extras = [
      l.trim ? "refile perimetral" : "",
      l.shapeCut ? "corte a forma en Plotter de Corte" : "",
    ].filter(Boolean);
    if (extras.length) finish = ` Acabados: ${extras.join(" y ")}.`;
  }
  return `${p.name} de ${measure}, ${l.quantity} ${l.quantity === 1 ? "pieza" : "piezas"}, ${print}.${finish}`;
}
function commercialDescription(l: Line) {
  const fileDescription = l.fileDescription?.trim();
  return `${fileDescription ? `${fileDescription}. ` : ""}${technicalDescription(l)}`;
}
function dateInputValue(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
export default function Home() {
  const [step, setStep] = useState(1),
    [margin, setMargin] = useState(55),
    [discountPercent, setDiscountPercent] = useState(0),
    [lines, setLines] = useState<Line[]>([]),
    [active, setActive] = useState<number | null>(null),
    [seller, setSeller] = useState(""),
    [closer, setCloser] = useState(""),
    [projectName, setProjectName] = useState(""),
    [quoteDate, setQuoteDate] = useState(() => dateInputValue()),
    [expirationDate, setExpirationDate] = useState(() => dateInputValue(15)),
    [customerType, setCustomerType] = useState<CustomerType>(""),
    [customerName, setCustomerName] = useState(""),
    [customerId, setCustomerId] = useState(""),
    [quoteClients, setQuoteClients] = useState<ClientRecord[]>([]),
    [newClientOpen, setNewClientOpen] = useState(false),
    [quoteId, setQuoteId] = useState<string | null>(null),
    [preview, setPreview] = useState<QuoteRecord | null>(null),
    [saving, setSaving] = useState(false),
    [saveError, setSaveError] = useState("");
  const [designService, setDesignService] = useState<DesignService>("DIS-00");
  const [quoteModule, setQuoteModule] = useState<QuoteModule>("print-to-go");
  const [systemChoice, setSystemChoice] =
    useState<SystemChoice>("printing");
  const [rigidCatalog, setRigidCatalog] = useState<RigidMaterialRecord[]>([]);
  const [rigidLabor, setRigidLabor] = useState<RigidLaborRecord[]>([]);
  const [structureMaterials, setStructureMaterials] = useState<
    MaterialRecord[]
  >([]);
  const [structureDraft, setStructureDraft] = useState<StructureDraft>({
    enabled: false,
    targetLineId: null,
    profile: "",
    horizontalReinforcements: -1,
    verticalReinforcements: -1,
    paint: true,
    installationReady: false,
    notes: "",
  });
  const [rigidDraft, setRigidDraft] = useState<RigidQuoteDraft>({
    materialId: "",
    width: 0.61,
    height: 0.61,
    quantity: 1,
    description: "",
    graphic: "none",
    vinylProductId: "",
    mounting: false,
    weeding: false,
    cutProcess: "",
    operatorHours: 0,
    assistantHours: 0,
    vinylCost: 0,
    workComplexity: "standard",
    cutCatalog: "",
    laminationId: "",
  });
  const [extraDesignChanges, setExtraDesignChanges] = useState(0);
  const [extraDesignAdaptations, setExtraDesignAdaptations] = useState(0);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [platformSection, setPlatformSection] = useState("dashboard");
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [arlonCatalog, setArlonCatalog] = useState<ArlonRecord[]>([]);
  const [lxCatalog, setLxCatalog] = useState<LxRecord[]>([]);
  const loadQuoteClients = () =>
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setQuoteClients);
  useEffect(() => {
    loadQuoteClients();
    fetch("/api/arlon")
      .then((r) => r.json())
      .then(setArlonCatalog);
    fetch("/api/lx")
      .then((r) => r.json())
      .then(setLxCatalog);
    fetch("/api/rigid-materials")
      .then((r) => r.json())
      .then(setRigidCatalog)
      .catch(() => setRigidCatalog([]));
    fetch("/api/rigid-labor")
      .then((r) => r.json())
      .then(setRigidLabor)
      .catch(() => setRigidLabor([]));
    fetch("/api/materials")
      .then((r) => r.json())
      .then(setStructureMaterials)
      .catch(() => setStructureMaterials([]));
  }, []);
  useEffect(() => {
    if (!customerId && customerName && quoteClients.length) {
      const match = quoteClients.find((c) =>
        [c.legal_name, c.company, c.name]
          .filter(Boolean)
          .includes(customerName),
      );
      if (match) setCustomerId(match.id);
    }
  }, [quoteClients, customerId, customerName]);
  const isFabrication = quoteModule !== "print-to-go",
    moduleLabel: Record<QuoteModule, string> = {
      "print-to-go": "Gran Formato",
      rigid: "Materiales Rígidos",
      signage: "Señalética",
      letters3d: "Letreros 3D",
    };
  const selectSystem = (choice: SystemChoice) => {
    setSystemChoice(choice);
    if (choice === "rigid-signage") {
      setQuoteModule("rigid");
      return;
    }
    setQuoteModule("print-to-go");
    if (choice === "design" && designService === "DIS-00") {
      setDesignService("DIS-01");
    }
    if (choice === "structure") {
      setStructureDraft((current) => ({ ...current, enabled: true }));
    }
  };
  const calculateStructure = () => {
    if (!structureDraft.enabled) return { cost: 0, price: 0 };
    const line =
      lines.find((x) => x.id === structureDraft.targetLineId) ||
      lines.find((x) => x.productId === "lona") ||
      lines[0];
    if (!line) return { cost: 0, price: 0 };
    const recipe = structureRecipe(
        line.width,
        line.height,
        line.quantity,
        structureDraft.profile,
        structureDraft.horizontalReinforcements,
        structureDraft.verticalReinforcements,
      ),
      material =
        structureMaterials.find((item) =>
          item.name.toLowerCase().includes(
            recipe.profile
              .replace(/[^0-9½¾x]/g, "")
              .toLowerCase()
              .slice(0, 5),
          ),
        ) ||
        structureMaterials.find(
          (item) =>
            item.category.startsWith("Herrería") &&
            item.name.toLowerCase().includes("tubular"),
        ),
      barCost = material ? material.purchase_cost || material.cost : 0,
      consumables =
        recipe.cutMeters * 14 +
        recipe.pijas * 2.5 +
        (structureDraft.paint ? recipe.cutMeters * 9 + 85 : 0),
      labor = recipe.laborHours * 105,
      cost = recipe.bars * barCost + consumables + labor;
    return { cost, price: cost / (1 - Math.max(1, margin) / 100) };
  };
  const rigidMaterial = rigidCatalog.find(
      (x) => x.id === rigidDraft.materialId,
    ),
    rigidArea =
      Math.max(0, rigidDraft.width) *
      Math.max(0, rigidDraft.height) *
      Math.max(1, rigidDraft.quantity),
    rigidRawSheets = rigidMaterial
      ? rigidArea / Math.max(0.0001, rigidMaterial.width * rigidMaterial.length)
      : 0,
    rigidBillableSheets = rigidMaterial
      ? rigidMaterial.special_full_sheet
        ? Math.max(1, Math.ceil(rigidRawSheets))
        : Math.max(
            rigidMaterial.minimum_fraction || 0.25,
            Math.ceil(
              rigidRawSheets /
                Math.max(0.01, rigidMaterial.minimum_fraction || 0.25),
            ) * Math.max(0.01, rigidMaterial.minimum_fraction || 0.25),
          )
      : 0,
    operatorRate =
      rigidLabor.find((x) => x.role.toLowerCase().includes("operador"))
        ?.productive_hour_cost || 0,
    assistantRate =
      rigidLabor.find((x) => x.role.toLowerCase().includes("asistente"))
        ?.productive_hour_cost || 0,
    rigidMaterialCost = (rigidMaterial?.sheet_cost || 0) * rigidBillableSheets,
    rigidPrintedVinyl = products.find(
      (item) =>
        rigidDraft.graphic === "printed" &&
        item.id === rigidDraft.vinylProductId &&
        item.mode === "area",
    ),
    rigidLamination = products.find(
      (item) =>
        rigidDraft.graphic === "printed" &&
        item.id === rigidDraft.laminationId,
    ),
    rigidCutArlon = rigidDraft.vinylProductId.startsWith("arlon:")
      ? arlonCatalog.find(
          (item) => item.id === rigidDraft.vinylProductId.slice(6),
        )
      : undefined,
    rigidCutLx = rigidDraft.vinylProductId.startsWith("lx:")
      ? lxCatalog.find(
          (item) => item.id === rigidDraft.vinylProductId.slice(3),
        )
      : undefined,
    rigidVinylRollWidth = rigidDraft.width <= 0.61 ? 0.61 : 1.22,
    rigidVinylLinearMeters =
      rigidDraft.graphic === "cut"
        ? (rigidArea / rigidVinylRollWidth) * 1.1
        : 0,
    rigidVinylCost =
      rigidDraft.graphic === "printed" && rigidPrintedVinyl
        ? rigidArea *
          (rigidPrintedVinyl.substrate +
            ink["HP Latex"] +
            (rigidLamination?.substrate || 0))
        : rigidDraft.graphic === "cut"
          ? rigidVinylLinearMeters *
            (rigidCutArlon
              ? rigidVinylRollWidth === 1.22
                ? rigidCutArlon.meter_cost_122
                : rigidCutArlon.meter_cost_061
              : rigidCutLx
                ? rigidVinylRollWidth === 1.22
                  ? rigidCutLx.meter_cost_122
                  : rigidCutLx.meter_cost_061
                : 0)
          : 0,
    rigidComplexityFactor =
      rigidDraft.workComplexity === "complex"
        ? 1.5
        : rigidDraft.workComplexity === "simple"
          ? 0.75
          : 1,
    rigidCutOperatorHours =
      (({
        "Corte láser": 0.28,
        "Router CNC": 0.35,
        "Corte manual / sierra": 0.45,
        "Sin corte": 0.08,
      } as Record<string, number>)[rigidDraft.cutProcess] || 0.2) * rigidArea,
    rigidGraphicOperatorHours =
      rigidDraft.graphic === "printed"
        ? 0.18 * rigidArea
        : rigidDraft.graphic === "cut"
          ? (0.25 + (rigidDraft.weeding ? 0.35 : 0)) * rigidArea
          : 0,
    rigidMountingOperatorHours =
      (rigidDraft.mounting ? 0.22 * rigidArea : 0) +
      (rigidDraft.graphic === "printed" && rigidDraft.laminationId
        ? 0.14 * rigidArea
        : 0),
    rigidOperatorHours = rigidMaterial
      ? Math.ceil(
          Math.max(
            0.25,
            (0.2 +
              rigidCutOperatorHours +
              rigidGraphicOperatorHours +
              rigidMountingOperatorHours) *
              rigidComplexityFactor,
          ) * 4,
        ) / 4
      : 0,
    rigidAssistantHours = rigidMaterial
      ? Math.ceil(
          Math.max(
            0,
            (rigidArea >= 1 ? 0.12 * rigidArea : 0) +
              (rigidDraft.mounting ? 0.18 * rigidArea : 0) +
              (rigidDraft.cutProcess === "Corte manual / sierra"
                ? 0.15 * rigidArea
                : 0),
          ) *
            rigidComplexityFactor *
            4,
        ) / 4
      : 0,
    rigidLaborCost =
      rigidOperatorHours * operatorRate +
      rigidAssistantHours * assistantRate,
    rigidProductionCost =
      rigidMaterialCost + rigidLaborCost + rigidVinylCost,
    rigidPrice = rigidProductionCost / (1 - Math.max(1, margin) / 100);
  const rows = useMemo(() => {
      const base = lines.map((line) => ({ line, result: calc(line) })),
        groups: Record<
          string,
          {
            volume: number;
            units: number;
          }
        > = {};
      base.forEach(({ line, result }) => {
        const key = compatibleKey(line),
          p = products.find((x) => x.id === line.productId)!;
        groups[key] ??= { volume: 0, units: 0 };
        groups[key].volume +=
          p.mode === "linear" ? line.linearMeters : result.net;
        groups[key].units +=
          p.mode === "linear" ? line.linearMeters : line.quantity;
      });
      return base.map(({ line, result }) => {
        const p = products.find((x) => x.id === line.productId)!,
          group = groups[compatibleKey(line)],
          floor = customerType ? marginFloors[customerType] : 0,
          effectiveMargin = Math.max(
            floor,
            margin - volumeAdjustment(group.volume),
          ),
          baseLabor = p.id === "lona" ? 12 : p.mode === "area" ? 28 : 0,
          factor = laborVolumeFactor(group.units),
          adjustedLabor =
            baseLabor + Math.max(0, result.labor - baseLabor) * factor,
          adjustedCost = result.cost - result.labor + adjustedLabor;
        return {
          line,
          result: { ...result, labor: adjustedLabor, cost: adjustedCost },
          effectiveMargin,
          volume: group.volume,
          requiresApproval: group.volume >= 100,
          price: adjustedCost / (1 - effectiveMargin / 100),
        };
      });
    }, [lines, margin, customerType]),
    procurementGroups = useMemo(() => {
      const groups: Record<
        string,
        { subtotal: number; origin: string; needsFreight: boolean }
      > = {};
      for (const l of lines) {
        if (
          l.productId !== "recorte" ||
          !l.arlonId ||
          l.arlonCostPerLinear <= 0
        )
          continue;
        const origin = cutPurchaseOrigin(l),
          supplier =
            origin === "Local"
              ? "Proveedor local LX"
              : l.cutSupplier || `${l.cutCatalog} GDL`,
          key = `${origin}:${supplier}`,
          g = (groups[key] ??= { subtotal: 0, origin, needsFreight: false });
        g.subtotal += l.linearMeters * l.arlonCostPerLinear;
        g.needsFreight ||= needsSmallArlonFreight(l);
      }
      let freightAssigned = false;
      return Object.entries(groups).map(([key, g]) => {
        const supplier = key.split(":").slice(1).join(":"),
          shipping =
            g.needsFreight && !freightAssigned
              ? ((freightAssigned = true), 250)
              : 0;
        return { supplier, ...g, shipping };
      });
    }, [lines]),
    procurementFreight =
      quoteModule === "rigid"
        ? 0
        : procurementGroups.reduce((s, g) => s + g.shipping, 0),
    designBase = designServices[designService],
    designPrice =
      designBase.price +
      extraDesignChanges * 150 +
      extraDesignAdaptations * 100,
    designCost =
      designBase.cost + extraDesignChanges * 72 + extraDesignAdaptations * 48,
    productionCost =
      (quoteModule === "rigid"
        ? rigidProductionCost
        : rows.reduce((s, x) => s + x.result.cost, 0)) +
      calculateStructure().cost,
    freightPrice = procurementFreight / (1 - Math.max(1, margin) / 100),
    cost = productionCost + designCost + procurementFreight,
    grossSubtotal =
      (quoteModule === "rigid"
        ? rigidPrice
        : rows.reduce((s, x) => s + x.price, 0)) +
      calculateStructure().price +
      designPrice +
      freightPrice,
    discountAmount =
      (grossSubtotal * Math.min(100, Math.max(0, discountPercent))) / 100,
    subtotal = grossSubtotal - discountAmount,
    utility = subtotal - cost,
    iva = subtotal * 0.16,
    total = subtotal + iva,
    current = lines.find((l) => l.id === active) || null,
    costPct = total ? (cost / total) * 100 : 0,
    utilityPct = total ? (Math.max(0, utility) / total) * 100 : 0,
    ivaPct = total ? (iva / total) * 100 : 0,
    requiresApproval =
      quoteModule === "print-to-go" && rows.some((x) => x.requiresApproval),
    hasIncompleteCutSelection =
      quoteModule === "print-to-go" &&
      lines.some(
        (l) =>
          products.find((p) => p.id === l.productId)?.mode === "linear" &&
          !l.arlonId,
      ),
    hasPendingCutCost =
      quoteModule === "print-to-go" &&
      lines.some(
        (l) =>
          products.find((p) => p.id === l.productId)?.mode === "linear" &&
          !!l.arlonId &&
          l.arlonCostPerLinear <= 0,
      );
  const incompleteCutLine = lines.find(
    (l) =>
      products.find((p) => p.id === l.productId)?.mode === "linear" &&
      !l.arlonId,
  );
  const structureLine =
      lines.find((line) => line.id === structureDraft.targetLineId) ||
      lines.find((line) => line.productId === "lona") ||
      lines[0],
    structureRecipeData = structureLine
      ? structureRecipe(
          structureLine.width,
          structureLine.height,
          structureLine.quantity,
          structureDraft.profile,
          structureDraft.horizontalReinforcements,
          structureDraft.verticalReinforcements,
        )
      : null,
    profileMaterial =
      structureMaterials.find((item) =>
        item.name.toLowerCase().includes(
          (structureRecipeData?.profile || "")
            .replace(/[^0-9½¾x]/g, "")
            .toLowerCase()
            .slice(0, 5),
        ),
      ) ||
      structureMaterials.find(
        (item) =>
          item.category.startsWith("Herrería") &&
          item.name.toLowerCase().includes("tubular"),
      ),
    profileBarCost = profileMaterial
      ? profileMaterial.purchase_cost || profileMaterial.cost
      : 0,
    structureFabricationConsumables =
      (structureRecipeData?.cutMeters || 0) * 14 +
      (structureRecipeData?.pijas || 0) * 2.5,
    structurePaintCost = structureDraft.paint
      ? (structureRecipeData?.cutMeters || 0) * 9 + 85
      : 0,
    structureConsumables = structureFabricationConsumables + structurePaintCost,
    structureLaborCost = (structureRecipeData?.laborHours || 0) * 105,
    structureCost = structureDraft.enabled
      ? (structureRecipeData?.bars || 0) * profileBarCost +
        structureConsumables +
        structureLaborCost
      : 0,
    structurePrice = structureCost / (1 - Math.max(1, margin) / 100);
  const updateLine = (lineId: number, patch: Partial<Line>) =>
    setLines((c) =>
      c.map((l) =>
        l.id === lineId
          ? {
              ...l,
              ...patch,
              equipment:
                l.productId === "lona"
                  ? "Solvente Flytoo"
                  : (patch.equipment ?? l.equipment),
            }
          : l,
      ),
    );
  const update = (patch: Partial<Line>) => {
    if (active !== null) updateLine(active, patch);
  };
  const addProduct = (productId: string) => {
    if (lines.some((l) => l.productId === productId)) return;
    const id = Math.max(0, ...lines.map((l) => l.id)) + 1;
    setLines([
      ...lines,
      {
        ...blank(id),
        productId,
        equipment: productId === "lona" ? "Solvente Flytoo" : "HP Latex",
      },
    ]);
    setActive(id);
  };
  const addConcept = (productId: string) => {
    const id = Math.max(0, ...lines.map((l) => l.id)) + 1;
    setCollapsedGroups((current) => current.filter((x) => x !== productId));
    setLines([
      ...lines,
      {
        ...blank(id),
        productId,
        equipment: productId === "lona" ? "Solvente Flytoo" : "HP Latex",
      },
    ]);
    setActive(id);
    setTimeout(
      () =>
        document
          .querySelector(".concept-block.is-editing")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      100,
    );
  };
  const remove = (id: number) => {
    setLines((c) => c.filter((l) => l.id !== id));
    if (active === id) setActive(null);
  };
  const resetQuote = () => {
    setPreview(null);
    setQuoteId(null);
    setCustomerId("");
    setCustomerName("");
    setCustomerType("");
    setSeller("");
    setCloser("");
    setProjectName("");
    setQuoteDate(dateInputValue());
    setExpirationDate(dateInputValue(15));
    setMargin(55);
    setDiscountPercent(0);
    setDesignService("DIS-00");
    setExtraDesignChanges(0);
    setExtraDesignAdaptations(0);
    setQuoteModule("print-to-go");
    setSystemChoice("printing");
    setRigidDraft({
      materialId: "",
      width: 0.61,
      height: 0.61,
      quantity: 1,
      description: "",
      graphic: "none",
      mounting: false,
      weeding: false,
      cutProcess: "",
      operatorHours: 0,
      assistantHours: 0,
      vinylCost: 0,
      vinylProductId: "",
      workComplexity: "standard",
      cutCatalog: "",
      laminationId: "",
    });
    setLines([]);
    setActive(null);
    setCollapsedGroups([]);
    setSaveError("");
    setStep(1);
  };
  const rigidItem = rigidMaterial
    ? {
        type: "rigid",
        product: rigidMaterial.name,
        description: `${rigidDraft.description ? `${rigidDraft.description}. ` : ""}${rigidMaterial.name} de ${rigidDraft.width} × ${rigidDraft.height} m, ${rigidDraft.quantity} pieza(s), corte ${rigidDraft.cutProcess || rigidMaterial.default_cut}.${rigidDraft.graphic !== "none" ? ` Complemento: ${rigidDraft.graphic === "printed" ? "vinil impreso" : "vinil de recorte"}${rigidDraft.mounting ? " con pegado" : ""}${rigidDraft.weeding ? " y depilado" : ""}.` : ""}`,
        quantity: rigidDraft.quantity,
        unit: "pieza",
        unitPrice: rigidDraft.quantity
          ? rigidPrice / rigidDraft.quantity
          : rigidPrice,
        price: rigidPrice,
        cost: rigidProductionCost,
        effectiveMargin: margin,
        area: rigidArea,
        billableSheets: rigidBillableSheets,
        material: rigidMaterial,
        labor: {
          operatorHours: rigidOperatorHours,
          assistantHours: rigidAssistantHours,
        },
        graphic: rigidDraft.graphic,
      }
    : null;
  const quotePayload = () => ({
    id: quoteId,
    folio: quoteId ? undefined : "",
    quoteModule,
    systemChoice,
    customerName,
    customerType,
    seller,
    closer,
    projectName,
    quoteDate,
    expirationDate,
    status: "Borrador",
    margin,
    discountPercent,
    grossSubtotal,
    discountAmount,
    subtotal,
    iva,
    total,
    lines: quoteModule === "rigid" ? [] : lines,
    rigidDraft:
      quoteModule === "rigid"
        ? {
            ...rigidDraft,
            vinylCost: rigidVinylCost,
            operatorHours: rigidOperatorHours,
            assistantHours: rigidAssistantHours,
          }
        : undefined,
    structureDraft,
    procurementGroups: quoteModule === "rigid" ? [] : procurementGroups,
    procurementFreight,
    designService,
    extraDesignChanges,
    extraDesignAdaptations,
    designPrice,
    designCost,
    items: [
      ...(quoteModule === "rigid"
        ? rigidItem
          ? [rigidItem]
          : []
        : rows.map((x) => {
            const p = products.find((p) => p.id === x.line.productId)!,
              quantity =
                p.mode === "linear" ? x.line.linearMeters : x.line.quantity;
            return {
              line: x.line,
              product: p.name,
              description: commercialDescription(x.line),
              quantity,
              unit: p.mode === "linear" ? "m lineal" : "pieza",
              unitPrice: quantity ? x.price / quantity : x.price,
              price: x.price,
              cost: x.result.cost,
              effectiveMargin: x.effectiveMargin,
              area: x.result.net,
              billableArea: x.result.bill,
              waste: x.result.waste,
            };
          })),
      ...(structureDraft.enabled && structureRecipeData
        ? [
            {
              type: "structure",
              product: "Estructura de herrería",
              description: `Bastidor ${structureRecipeData.profile}; ${structureRecipeData.horizontalReinforcements} travesaño(s) horizontal(es), ${structureRecipeData.verticalReinforcements} vertical(es), ${structureRecipeData.pijas} pijabrocas.${structureDraft.paint ? " Incluye pintura anticorrosiva." : ""}${structureDraft.notes ? ` ${structureDraft.notes}` : ""}`,
              quantity: 1,
              unit: "estructura",
              unitPrice: structurePrice,
              price: structurePrice,
              cost: structureCost,
            },
          ]
        : []),
      ...(designPrice > 0
        ? [
            {
              type: "design",
              product: `Diseño gráfico · ${designBase.name}`,
              description: `${designBase.description} Incluye una propuesta y dos rondas de cambios menores.${extraDesignChanges ? ` ${extraDesignChanges} cambio(s) adicional(es).` : ""}${extraDesignAdaptations ? ` ${extraDesignAdaptations} adaptación(es) adicional(es).` : ""}`,
              quantity: 1,
              unit: "servicio",
              unitPrice: designPrice,
              price: designPrice,
              cost: designCost,
            },
          ]
        : []),
    ],
  });
  const saveQuote = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const payload = quotePayload(),
        response = await fetch("/api/quotes", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        }),
        saved = await response.json(),
        now = Date.now();
      if (!response.ok || !saved.id)
        throw new Error(
          saved?.error || "No fue posible guardar la cotización.",
        );
      setQuoteId(saved.id);
      setPreview({
        id: saved.id,
        folio: saved.folio,
        customer_name: customerName,
        customer_type: customerType,
        seller,
        status: "Borrador",
        margin,
        subtotal,
        tax: iva,
        total,
        payload: JSON.stringify({
          ...payload,
          id: saved.id,
          folio: saved.folio,
        }),
        created_at: now,
        updated_at: now,
      });
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "No fue posible guardar la cotización.",
      );
    } finally {
      setSaving(false);
    }
  };
  const editQuote = (record: QuoteRecord) => {
    const data = JSON.parse(record.payload);
    setPreview(null);
    setQuoteId(record.id);
    setSeller(data.seller || record.seller);
    setCloser(data.closer || "");
    setProjectName(data.projectName || "");
    setQuoteDate(data.quoteDate || dateInputValue());
    setExpirationDate(data.expirationDate || dateInputValue(15));
    setCustomerName(data.customerName || record.customer_name);
    setCustomerType(
      (data.customerType || record.customer_type) as CustomerType,
    );
    setMargin(data.margin || record.margin);
    setDiscountPercent(data.discountPercent || 0);
    setDesignService(data.designService || "DIS-00");
    setExtraDesignChanges(data.extraDesignChanges || 0);
    setExtraDesignAdaptations(data.extraDesignAdaptations || 0);
    setQuoteModule(data.quoteModule || "print-to-go");
    setSystemChoice(
      data.systemChoice ||
        (data.quoteModule === "rigid" ? "rigid-signage" : "printing"),
    );
    if (data.rigidDraft) setRigidDraft(data.rigidDraft);
    setLines(
      (data.lines || []).map((l: Line) => {
        const normalized =
          l.productId === "recorte60" || l.productId === "recorte120"
            ? {
                ...l,
                productId: "recorte",
                cutWidth: l.productId === "recorte120" ? 1.22 : 0.61,
              }
            : l;
        return normalized.productId === "recorte"
          ? {
              ...normalized,
              linearMeters: Math.max(
                1,
                Math.ceil(Number(normalized.linearMeters) || 1),
              ),
            }
          : normalized;
      }),
    );
    setStep(4);
    setModuleId("print-to-go");
  };
  const steps = [
    "Cliente",
    "Sistema",
    "Diseño",
    "Impresión",
    "Acabados",
    "Estructura",
    "Instalación",
    "Revisión",
  ];
  const selectedProducts = products.filter((p) =>
    lines.some((l) => l.productId === p.id),
  );
  if (!moduleId)
    return (
      <BusinessPlatform
        initialSection={platformSection}
        onNewQuote={() => {
          resetQuote();
          setModuleId("print-to-go");
        }}
        onEditQuote={editQuote}
      />
    );
  if (moduleId === "quotes-sales")
    return <HistoryView onBack={() => setModuleId(null)} onEdit={editQuote} />;
  if (preview)
    return (
      <QuotePreviewPanel
        record={preview}
        onEdit={() => {
          setPreview(null);
          setStep(7);
        }}
        onNavigate={(id) => {
          setPreview(null);
          setPlatformSection(id);
          setModuleId(null);
        }}
        onNew={resetQuote}
        onSent={() =>
          setPreview({ ...preview, status: "Enviada", updated_at: Date.now() })
        }
      />
    );
  return (
    <main className="business-shell quote-with-sidebar">
      <PersistentSidebar
        active="new"
        onNavigate={(id) => {
          setPlatformSection(id);
          setModuleId(null);
        }}
        onNewQuote={resetQuote}
      />
      <section className="business-main">
        <header className="topbar">
          <div className="brand">
            <img
              className="brand-logo-horizontal"
              src="/custom-graphics-logo.png"
              alt="Custom Graphics"
            />
            <div>
              <small>{moduleLabel[quoteModule]}</small>
            </div>
          </div>
          <div className="header-actions">
            <span className="draft-dot" />
            Borrador
            <button className="ghost" onClick={saveQuote}>
              Guardar borrador
            </button>
          </div>
        </header>
        <section className="project-head compact">
          <div>
            <p className="eyebrow">NUEVA COTIZACIÓN</p>
            <h1>{steps[step - 1]}</h1>
            <p>
              {step === 1
                ? "Captura el cliente, responsable y tipo de proyecto."
                : step === 2
                  ? "Selecciona la familia y el sistema que corresponde al proyecto."
                  : step === 3
                    ? "Selecciona productos, medidas, materiales y equipo de producción."
                    : step === 4
                      ? "Configura los acabados particulares de cada concepto."
                      : step === 5
                        ? "Define los elementos estructurales cuando el módulo los requiera."
                        : step === 6
                          ? "Configura la instalación y sus condiciones."
                          : "Comprueba costos, margen e impuestos antes de guardar."}
            </p>
          </div>
          <div className="folio">
            Folio provisional<strong>PTG-000128</strong>
          </div>
        </section>
        <nav className="steps">
          {steps.map((s, i) => (
            <button
              key={s}
              disabled={i + 1 > step}
              onClick={() => {
                if (i + 1 <= step) {
                  setActive(null);
                  setStep(i + 1);
                }
              }}
              className={step === i + 1 ? "active" : step > i + 1 ? "done" : ""}
            >
              <span>{step > i + 1 ? "✓" : i + 1}</span>
              {s}
            </button>
          ))}
        </nav>
        <div className="guided-workspace">
          <section className="main-card guided-card">
            {step === 1 && (
              <section className="step-panel">
                <div className="card-title">
                  <div>
                    <p className="eyebrow">PASO 1 DE 8</p>
                    <h2>Cliente y responsable</h2>
                    <p>
                      Primero identifica a quién pertenece el proyecto y quién
                      lo atenderá.
                    </p>
                  </div>
                </div>
                <div className="client-quote-row">
                  <label>
                    Cliente
                    <small>Nombre de empresa y contacto registrado.</small>
                    <select
                      value={customerId}
                      onChange={(e) => {
                        const id = e.target.value,
                          selectedClient = quoteClients.find((x) => x.id === id);
                        setCustomerId(id);
                        if (selectedClient) {
                          setCustomerName(
                            selectedClient.legal_name ||
                              selectedClient.company ||
                              selectedClient.name,
                          );
                          const type = (selectedClient.customer_type ||
                            "Cliente Final") as CustomerType;
                          setCustomerType(type);
                          setMargin(
                            customerMargins[type as Exclude<CustomerType, "">],
                          );
                        } else {
                          setCustomerName("");
                          setCustomerType("");
                        }
                      }}
                    >
                      <option value="">
                        Seleccionar cliente de la base de datos
                      </option>
                      {quoteClients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {[c.company || c.legal_name, c.name, c.email]
                            .filter(Boolean)
                            .join(" · ")}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="add-client-inline"
                    onClick={() => setNewClientOpen(true)}
                  >
                    ＋ Nuevo cliente
                  </button>
                </div>
                <div className="seller-panel commercial-start quote-policy">
                  <label>
                    Cotizador
                    <small>Persona que realizará la cotización.</small>
                    <select
                      value={seller}
                      onChange={(e) => setSeller(e.target.value)}
                    >
                      <option value="">Seleccionar cotizador</option>
                      <option>Héctor Gradilla</option>
                      <option>Michel</option>
                      <option>Wendy</option>
                      <option>Alejandro</option>
                    </select>
                  </label>
                  <label>
                    Nombre del proyecto
                    <small>Referencia que identificará este trabajo.</small>
                    <input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Ej. Señalización sucursal Centro"
                    />
                  </label>
                  <label>
                    Cerrador
                    <small>Persona responsable de cerrar la venta.</small>
                    <select
                      value={closer}
                      onChange={(e) => setCloser(e.target.value)}
                    >
                      <option value="">Seleccionar cerrador</option>
                      <option>Héctor Gradilla</option>
                      <option>Michel</option>
                      <option>Wendy</option>
                      <option>Alejandro</option>
                    </select>
                  </label>
                  <label>
                    Tipo de cliente
                    <small>Define el margen comercial aplicable.</small>
                    <select
                      value={customerType}
                      onChange={(e) => {
                        const value = e.target.value as CustomerType;
                        setCustomerType(value);
                        if (value) setMargin(customerMargins[value]);
                      }}
                    >
                      <option value="">Seleccionar tipo de cliente</option>
                      <option value="Cliente Maquila">
                        Cliente Maquila · 45%
                      </option>
                      <option value="Cliente Frecuente">
                        Cliente Frecuente · 55%
                      </option>
                      <option value="Cliente Final">Cliente Final · 65%</option>
                    </select>
                  </label>
                  <label>
                    Fecha de cotización
                    <input
                      type="date"
                      value={quoteDate}
                      onChange={(e) => setQuoteDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Vencimiento
                    <input
                      type="date"
                      min={quoteDate}
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                    />
                  </label>
                </div>
                {customerName &&
                  seller &&
                  closer &&
                  projectName &&
                  customerType &&
                  quoteDate &&
                  expirationDate && (
                    <div className="seller-confirm commercial-confirm">
                      <span>✓</span>
                      <div>
                        <small>Datos comerciales completos</small>
                        <strong>
                          {projectName} · {customerName} · {customerType} ·{" "}
                          {margin}%
                        </strong>
                      </div>
                    </div>
                  )}
                {newClientOpen && (
                  <QuickClientModal
                    close={() => setNewClientOpen(false)}
                    onSaved={async (id) => {
                      await loadQuoteClients();
                      const list = (await fetch("/api/clients").then((r) =>
                          r.json(),
                        )) as ClientRecord[],
                        client = list.find((c) => c.id === id);
                      setQuoteClients(list);
                      if (client) {
                        setCustomerId(client.id);
                        setCustomerName(
                          client.legal_name || client.company || client.name,
                        );
                        const type = client.customer_type as Exclude<
                          CustomerType,
                          ""
                        >;
                        setCustomerType(type);
                        setMargin(customerMargins[type]);
                      }
                      setNewClientOpen(false);
                    }}
                  />
                )}
              </section>
            )}
            {step === 2 && (
              <section className="step-panel system-step-panel">
                <div className="card-title system-title">
                  <div>
                    <p className="eyebrow">PASO 2 DE 8</p>
                    <h2>Sistema de Cotización de Proyectos Custom Graphics</h2>
                    <p>
                      Selecciona el tipo de proyecto. Cada sistema conservará sus
                      materiales, procesos, mano de obra y especificaciones técnicas.
                    </p>
                  </div>
                </div>

                <div className="system-catalog">
                  <section className="system-family">
                    <h3>Proyectos personalizados</h3>
                    <div className="system-grid project-systems">
                      <button
                        className={`system-option project ${systemChoice === "design" ? "selected" : ""}`}
                        onClick={() => selectSystem("design")}
                        aria-pressed={systemChoice === "design"}
                      >
                        <span>01</span><strong>Diseño Gráfico</strong>
                        <small>Preparación de archivo, adaptación o desarrollo creativo.</small>
                      </button>
                      <button
                        className={`system-option project ${systemChoice === "printing" ? "selected" : ""}`}
                        onClick={() => selectSystem("printing")}
                        aria-pressed={systemChoice === "printing"}
                      >
                        <span>02</span><strong>Impresión</strong>
                        <small>Lonas, viniles impresos y viniles de corte.</small>
                      </button>
                      <button
                        className={`system-option project ${systemChoice === "rigid-signage" ? "selected" : ""}`}
                        onClick={() => selectSystem("rigid-signage")}
                        aria-pressed={systemChoice === "rigid-signage"}
                      >
                        <span>03</span><strong>Rígidos y Señalética</strong>
                        <small>Acrílico, PVC, panel, coroplast y complementos gráficos.</small>
                      </button>
                      <button
                        className={`system-option project ${systemChoice === "structure" ? "selected" : ""}`}
                        onClick={() => selectSystem("structure")}
                        aria-pressed={systemChoice === "structure"}
                      >
                        <span>04</span><strong>Estructura y Herrería</strong>
                        <small>PTR, tubular, perfiles, consumibles y fabricación.</small>
                      </button>
                      <button
                        className={`system-option project ${systemChoice === "finishes" ? "selected" : ""}`}
                        onClick={() => selectSystem("finishes")}
                        aria-pressed={systemChoice === "finishes"}
                      >
                        <span>05</span><strong>Acabados</strong>
                        <small>Mano de obra y procesos manuales por concepto.</small>
                      </button>
                      <button className="system-option planned" disabled>
                        <span>06</span><strong>Esmaltado</strong>
                        <small>Mano de obra y costos del proceso de pintura.</small>
                        <em>Próximo módulo</em>
                      </button>
                      <button className="system-option workflow" disabled>
                        <span>10</span><strong>Instalación</strong>
                        <small>Andamios, combustible, viáticos y maniobras.</small>
                      </button>
                      <button className="system-option workflow" disabled>
                        <span>11</span><strong>Embalaje y Envío</strong>
                        <small>Empaque, embalaje, paquetería y entrega.</small>
                      </button>
                      <button className="system-option workflow" disabled>
                        <span>12</span><strong>Revisión de Proyecto</strong>
                        <small>Costos totales, descuento, margen e impuestos.</small>
                      </button>
                    </div>
                  </section>

                  <section className="system-family">
                    <h3>Letreros para interior y exterior</h3>
                    <div className="system-grid letter-systems">
                      {[
                        ["10", "EasyClear", "Letreros con base de acrílico."],
                        ["11", "EasyCut", "Letreros con base de PVC."],
                        ["12", "EasyPop", "Panel de aluminio y letras en PVC de 20 mm."],
                        ["13", "EasyBox", "Con o sin bastidor y letra de aluminio sin luz."],
                        ["14", "EasyHalo", "Con o sin bastidor y letra de aluminio retroiluminada."],
                        ["15", "EasyLux", "Acrílico iluminado con o sin bastidor."],
                      ].map(([number, name, description]) => (
                        <button className="system-option letter planned" disabled key={name}>
                          <span>{number}</span><strong>{name}</strong><small>{description}</small>
                          <em>Siguiente etapa</em>
                        </button>
                      ))}
                    </div>
                    <div className="system-grid shared-flow">
                      <button className="system-option workflow" disabled><span>10</span><strong>Instalación</strong><small>Andamios, combustible, viáticos y maniobras.</small></button>
                      <button className="system-option workflow" disabled><span>11</span><strong>Embalaje y Envío</strong><small>Costos de empaque y transporte.</small></button>
                      <button className="system-option workflow" disabled><span>12</span><strong>Revisión de Proyecto</strong><small>Costos totales, descuentos y margen.</small></button>
                    </div>
                  </section>

                  <section className="system-family">
                    <h3>Letreros tipo bandera</h3>
                    <div className="system-grid placeholder-systems">
                      {[1, 2, 3, 4, 5].map((item) => (
                        <button className="system-option flag planned" disabled key={item}>
                          <span>{String(item).padStart(2, "0")}</span>
                          <strong>Modelo por definir</strong><small>Receta técnica pendiente.</small>
                        </button>
                      ))}
                    </div>
                    <div className="system-grid shared-flow">
                      <button className="system-option workflow" disabled><span>10</span><strong>Instalación</strong><small>Maniobras y viáticos.</small></button>
                      <button className="system-option workflow" disabled><span>11</span><strong>Embalaje y Envío</strong><small>Empaque y transporte.</small></button>
                      <button className="system-option workflow" disabled><span>12</span><strong>Revisión de Proyecto</strong><small>Costos, descuentos y margen.</small></button>
                    </div>
                  </section>

                  <section className="system-family">
                    <h3>Tótems</h3>
                    <div className="system-grid placeholder-systems">
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <button className="system-option totem planned" disabled key={item}>
                          <span>{String(item).padStart(2, "0")}</span>
                          <strong>Modelo por definir</strong><small>Receta técnica pendiente.</small>
                        </button>
                      ))}
                    </div>
                    <div className="system-grid shared-flow">
                      <button className="system-option workflow" disabled><span>10</span><strong>Instalación</strong><small>Maniobras y viáticos.</small></button>
                      <button className="system-option workflow" disabled><span>11</span><strong>Embalaje y Envío</strong><small>Empaque y transporte.</small></button>
                      <button className="system-option workflow" disabled><span>12</span><strong>Revisión de Proyecto</strong><small>Costos, descuentos y margen.</small></button>
                    </div>
                  </section>
                </div>
              </section>
            )}
            {step === 3 && (
              <section className="step-panel">
                <div className="card-title">
                  <div>
                    <p className="eyebrow">PASO 3 DE 8</p>
                    <h2>Diseño del proyecto</h2>
                    <p>
                      Selecciona únicamente la preparación gráfica que necesita
                      el proyecto.
                    </p>
                  </div>
                </div>
                <DesignServicePanel
                  service={designService}
                  setService={setDesignService}
                  extraChanges={extraDesignChanges}
                  setExtraChanges={setExtraDesignChanges}
                  extraAdaptations={extraDesignAdaptations}
                  setExtraAdaptations={setExtraDesignAdaptations}
                  total={designPrice}
                />
              </section>
            )}
            {step === 4 && (
              <section className="step-panel">
                <div className="card-title">
                  <div>
                    <p className="eyebrow">PASO 4 DE 8</p>
                    <h2>
                      {quoteModule === "rigid"
                        ? "Material rígido y procesos"
                        : "Impresión y productos"}
                    </h2>
                    <p>
                      {quoteModule === "rigid"
                        ? "Selecciona la lámina, medidas, corte y trabajo requerido."
                        : "Selecciona los productos y configura medidas, material, color y equipo."}
                    </p>
                  </div>
                </div>
                {quoteModule === "print-to-go" ? (
                  <>
                    <div className="product-picker">
                      {products.map((p) => {
                        const chosen = selectedProducts.some(
                          (x) => x.id === p.id,
                        );
                        return (
                          <button
                            key={p.id}
                            className={chosen ? "picked repeatable" : ""}
                            onClick={() =>
                              chosen ? addConcept(p.id) : addProduct(p.id)
                            }
                          >
                            <span>＋</span>
                            <strong>{p.name}</strong>
                            <small>
                              {chosen
                                ? "Agregar otro concepto"
                                : p.mode === "linear"
                                  ? "Cotización por metro lineal"
                                  : "Cotización por metro cuadrado"}
                            </small>
                          </button>
                        );
                      })}
                    </div>
                    {selectedProducts.length === 0 ? (
                      <div className="empty compact-empty">
                        <h3>Selecciona al menos un producto</h3>
                        <p>
                          Se abrirá de inmediato para capturar todos sus datos.
                        </p>
                      </div>
                    ) : (
                      <div className="product-groups">
                        {selectedProducts.map((p) => {
                          const concepts = rows.filter(
                              (x) => x.line.productId === p.id,
                            ),
                            collapsed = collapsedGroups.includes(p.id);
                          return (
                            <section
                              className={
                                collapsed
                                  ? "product-group collapsed"
                                  : "product-group"
                              }
                              key={p.id}
                            >
                              <div className="product-group-head">
                                <div>
                                  <small>PRODUCTO</small>
                                  <h3>{p.name}</h3>
                                  <span>
                                    {concepts.length}{" "}
                                    {concepts.length === 1
                                      ? "concepto"
                                      : "conceptos"}
                                  </span>
                                </div>
                                <div className="group-head-actions">
                                  <button
                                    className="add"
                                    onClick={() => addConcept(p.id)}
                                  >
                                    ＋ Agregar otra medida
                                  </button>
                                  <button
                                    className="collapse-group"
                                    onClick={() =>
                                      setCollapsedGroups((current) =>
                                        collapsed
                                          ? current.filter((id) => id !== p.id)
                                          : [...current, p.id],
                                      )
                                    }
                                    aria-label={
                                      collapsed
                                        ? "Expandir producto"
                                        : "Minimizar producto"
                                    }
                                  >
                                    {collapsed ? "⌄" : "⌃"}
                                  </button>
                                </div>
                              </div>
                              <div className="inner-concepts">
                                {concepts.map(
                                  (
                                    {
                                      line,
                                      result,
                                      price,
                                      effectiveMargin,
                                      volume,
                                      requiresApproval,
                                    },
                                    i,
                                  ) => (
                                    <div
                                      className={`concept-block ${active === line.id ? "is-editing" : ""}`}
                                      key={line.id}
                                    >
                                      <div className="inner-row">
                                        <span>
                                          {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <div>
                                          <strong>
                                            {p.mode === "linear"
                                              ? `${line.linearMeters} metros lineales`
                                              : `${line.width} × ${line.height} m`}
                                          </strong>
                                          <small>
                                            {p.mode === "linear"
                                              ? `${line.cutCatalog || "Arlon"} · ${line.cutWidth === 1.22 ? "122" : "60"} cm · ${line.colorCode || "Sin código de color"}`
                                              : `${line.quantity} pieza(s) · ${result.net.toFixed(2)} m² · ${line.equipment}`}
                                          </small>
                                          <small className="volume-note">
                                            Volumen agrupado:{" "}
                                            {volume.toFixed(2)}{" "}
                                            {p.mode === "linear"
                                              ? "m lineales"
                                              : "m²"}{" "}
                                            · Margen {effectiveMargin}%{" "}
                                            {requiresApproval
                                              ? "· Requiere autorización"
                                              : ""}
                                          </small>
                                        </div>
                                        <strong>{money(price)}</strong>
                                        <div className="row-actions">
                                          <button
                                            className={
                                              active === line.id
                                                ? "editing"
                                                : ""
                                            }
                                            onClick={() =>
                                              setActive(
                                                active === line.id
                                                  ? null
                                                  : line.id,
                                              )
                                            }
                                          >
                                            {active === line.id
                                              ? "Minimizar ↑"
                                              : "Editar"}
                                          </button>
                                          <button
                                            className="delete"
                                            onClick={() => remove(line.id)}
                                          >
                                            Eliminar
                                          </button>
                                        </div>
                                      </div>
                                      {active === line.id && (
                                        <ConceptEditor
                                          phase="printing"
                                          line={line}
                                          update={update}
                                          close={() => setActive(null)}
                                          arlonCatalog={arlonCatalog}
                                          lxCatalog={lxCatalog}
                                        />
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                            </section>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <RigidQuoteConfigurator
                    catalog={rigidCatalog}
                    labor={rigidLabor}
                    draft={rigidDraft}
                    setDraft={setRigidDraft}
                    material={rigidMaterial}
                    area={rigidArea}
                    billableSheets={rigidBillableSheets}
                    materialCost={rigidMaterialCost}
                    laborCost={rigidLaborCost}
                    price={rigidPrice}
                    arlonCatalog={arlonCatalog}
                    lxCatalog={lxCatalog}
                    vinylCost={rigidVinylCost}
                    operatorHours={rigidOperatorHours}
                    assistantHours={rigidAssistantHours}
                  />
                )}
              </section>
            )}
            {step === 5 && (
              <section className="step-panel">
                <div className="card-title">
                  <div>
                    <p className="eyebrow">PASO 5 DE 8</p>
                    <h2>Acabados por concepto</h2>
                    <p>
                      Revisa y define los acabados de cada concepto. Las
                      opciones permanecen siempre abiertas.
                    </p>
                  </div>
                </div>
                <div className="finish-concept-list">
                  {rows.map(({ line }, i) => {
                    const p = products.find((x) => x.id === line.productId)!;
                    return (
                      <section className="finish-concept" key={line.id}>
                        <div className="finish-concept-head">
                          <span>{String(i + 1).padStart(2, "0")}</span>
                          <strong>{p.name}</strong>
                          <small>
                            {p.mode === "linear"
                              ? `${line.linearMeters} m lineales · ${line.cutWidth === 1.22 ? "122" : "60"} cm`
                              : `${line.width} × ${line.height} m · ${line.quantity} pieza(s)`}
                          </small>
                        </div>
                        <ConceptEditor
                          phase="finishes"
                          line={line}
                          update={(patch) => updateLine(line.id, patch)}
                          close={() => {}}
                          arlonCatalog={arlonCatalog}
                          lxCatalog={lxCatalog}
                        />
                      </section>
                    );
                  })}
                  {!lines.length && (
                    <div className="empty-row">
                      Primero agrega productos en la etapa de Impresión.
                    </div>
                  )}
                </div>
              </section>
            )}
            {step === 6 && (
              <StructureConfigurator
                lines={lines}
                draft={structureDraft}
                setDraft={setStructureDraft}
                recipe={structureRecipeData}
                barCost={profileBarCost}
                consumables={structureFabricationConsumables}
                paintCost={structurePaintCost}
                laborCost={structureLaborCost}
                cost={structureCost}
                price={structurePrice}
              />
            )}
            {step === 7 && (
              <ProcessStage
                step="7"
                title="Instalación"
                description="Indica si el proyecto requiere instalación en sitio para preparar la siguiente etapa de costeo."
                options={[
                  "Sin instalación",
                  "Instalación de vinil",
                  "Instalación de lona",
                  "Instalación de señalética",
                ]}
              />
            )}
            {step === 8 && (
              <section className="step-panel">
                <div className="card-title">
                  <div>
                    <p className="eyebrow">PASO 8 DE 8</p>
                    <h2>Revisión final</h2>
                    <p>Confirma la cotización antes de guardar.</p>
                  </div>
                </div>
                <div className="review-grid">
                  <div className="review-card">
                    <small>Vendedor</small>
                    <strong>{seller}</strong>
                    <span>Responsable comercial</span>
                  </div>
                  <div className="review-card">
                    <small>Productos</small>
                    <strong>{selectedProducts.length}</strong>
                    <span>{lines.length} conceptos internos</span>
                  </div>
                  <div className="review-card">
                    <small>Política comercial</small>
                    <strong>{margin}%</strong>
                    <span>{customerType}</span>
                  </div>
                </div>
                {requiresApproval && (
                  <div className="approval-alert">
                    <strong>Autorización requerida</strong>
                    <span>
                      Existe un grupo compatible de 100 m² o metros lineales o
                      más. Revisa inventario, tiempos y capacidad antes de
                      guardar.
                    </span>
                  </div>
                )}
                {procurementGroups.length > 0 && (
                  <div className="procurement-summary">
                    <strong>Abastecimiento consolidado</strong>
                    {procurementGroups.map((g) => (
                      <span key={g.supplier}>
                        {g.supplier}: materiales {money(g.subtotal)} · flete{" "}
                        {g.shipping ? money(g.shipping) : "Sin cargo"}
                      </span>
                    ))}
                  </div>
                )}
                {hasIncompleteCutSelection && (
                  <div className="cost-pending-chip">
                    Selecciona aplicación, serie y código de color del vinil de
                    recorte para continuar.
                  </div>
                )}
                {hasPendingCutCost && (
                  <div className="cost-pending-chip">
                    Costo de compra pendiente: la cotización usa temporalmente
                    el costo provisional del vinil de recorte.
                  </div>
                )}
                <CostBreakdown
                  rows={rows}
                  designCost={designCost}
                  procurementFreight={procurementFreight}
                  structureEnabled={structureDraft.enabled}
                  structureProfileCost={structureDraft.enabled ? (structureRecipeData?.bars || 0) * profileBarCost : 0}
                  structureFabricationCost={structureDraft.enabled ? structureFabricationConsumables : 0}
                  structurePaintCost={structureDraft.enabled ? structurePaintCost : 0}
                  structureLaborCost={structureDraft.enabled ? structureLaborCost : 0}
                />
                <div className="discount-control">
                  <div>
                    <strong>Descuento comercial opcional</strong>
                    <small>
                      Se aplica antes del IVA y afecta la utilidad del proyecto.
                    </small>
                  </div>
                  <label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={discountPercent}
                      onChange={(e) =>
                        setDiscountPercent(
                          Math.min(100, Math.max(0, Number(e.target.value))),
                        )
                      }
                    />
                    <span>%</span>
                  </label>
                </div>
              </section>
            )}
            {step === 4 && incompleteCutLine && (
              <div className="cut-selection-warning" role="alert">
                <div>
                  <strong>⚠ Falta configurar el código de color</strong>
                  <span>
                    Completa la aplicación, serie y código de color del Vinil de
                    Recorte para poder continuar.
                  </span>
                </div>
                <button
                  onClick={() => {
                    setCollapsedGroups((current) =>
                      current.filter(
                        (id) => id !== incompleteCutLine.productId,
                      ),
                    );
                    setActive(incompleteCutLine.id);
                    setTimeout(
                      () =>
                        document
                          .querySelector(".concept-block.is-editing")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          }),
                      100,
                    );
                  }}
                >
                  Configurar ahora →
                </button>
              </div>
            )}
            {saveError && (
              <div className="cost-pending-chip save-error" role="alert">
                {saveError}
              </div>
            )}
            <div className="card-footer">
              <button
                className="ghost"
                disabled={step === 1}
                onClick={() => {
                  setActive(null);
                  setStep(step - 1);
                }}
              >
                ← Anterior
              </button>
              <span>Paso {step} de 8</span>
              <button
                className="primary"
                disabled={
                  saving ||
                  (step >= 4 && hasIncompleteCutSelection) ||
                  (step === 1 &&
                    (!customerName ||
                      !seller ||
                      !closer ||
                      !projectName.trim() ||
                      !customerType ||
                      !quoteDate ||
                      !expirationDate ||
                      expirationDate < quoteDate)) ||
                  (step === 4 &&
                    (quoteModule === "rigid" ? !rigidMaterial : !lines.length))
                }
                onClick={() => {
                  setActive(null);
                  if (step === 8) saveQuote();
                  else setStep(Math.min(8, step + 1));
                }}
              >
                {step === 8
                  ? saving
                    ? "Generando cotización..."
                    : "Generar cotización y PDF"
                  : "Continuar →"}
              </button>
            </div>
          </section>
          <aside className="summary">
            <p className="eyebrow lime">RESUMEN EN VIVO</p>
            <h2>{money(total)}</h2>
            <p className="summary-caption">Total con IVA</p>
            <div className="summary-section-title">COSTOS DESGLOSADOS</div>
            <div className="totals detailed">
              <div>
                <span>Conceptos</span>
                <strong>{lines.length}</strong>
              </div>
              <div>
                <span>Costo de producción</span>
                <strong>{money(productionCost)}</strong>
              </div>
              <div>
                <span>Diseño gráfico</span>
                <strong>{money(designPrice)}</strong>
              </div>
              <div>
                <span>Utilidad proyectada</span>
                <strong>{money(utility)}</strong>
              </div>
              <div>
                <span>Precio de lista</span>
                <strong>{money(grossSubtotal)}</strong>
              </div>
              {discountPercent > 0 && (
                <div className="discount-line">
                  <span>Descuento {discountPercent}%</span>
                  <strong>− {money(discountAmount)}</strong>
                </div>
              )}
              <div className="price-before-tax">
                <span>Precio antes de IVA</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <div>
                <span>IVA 16%</span>
                <strong>{money(iva)}</strong>
              </div>
              <div className="summary-grand">
                <span>Total con IVA</span>
                <strong>{money(total)}</strong>
              </div>
            </div>
            <div className="margin-box">
              <span>Margen objetivo</span>
              <strong>{margin}%</strong>
              <small>Utilidad proyectada: {money(utility)}</small>
            </div>
            <div className="summary-chart">
              <div
                className="donut"
                style={{
                  background: `conic-gradient(#c7f523 0 ${costPct}%, #7ca35a ${costPct}% ${costPct + utilityPct}%, #f0b44d ${costPct + utilityPct}% 100%)`,
                }}
              >
                <span>
                  <strong>100%</strong>
                  <small>del total</small>
                </span>
              </div>
              <div className="chart-legend">
                <div>
                  <i className="cost-dot" />
                  <span>Costo</span>
                  <strong>{costPct.toFixed(1)}%</strong>
                </div>
                <div>
                  <i className="utility-dot" />
                  <span>Utilidad</span>
                  <strong>{utilityPct.toFixed(1)}%</strong>
                </div>
                <div>
                  <i className="tax-dot" />
                  <span>IVA</span>
                  <strong>{ivaPct.toFixed(1)}%</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
function ConceptEditor({
  phase = "printing",
  line,
  update,
  close,
  arlonCatalog,
  lxCatalog,
}: {
  phase?: "printing" | "finishes";
  line: Line;
  update: (p: Partial<Line>) => void;
  close: () => void;
  arlonCatalog: ArlonRecord[];
  lxCatalog: LxRecord[];
}) {
  const p = products.find((x) => x.id === line.productId)!,
    r = calc(line);
  const finishDescription =
    line.perimeterFinish === "ACA-01"
      ? "Corte directo a la orilla, sin doblez."
      : line.perimeterFinish === "ACA-02"
        ? "Doblez estándar de 3 cm fundido con calor."
        : line.perimeterFinish === "ACA-03"
          ? "Bolsas de 10 cm arriba y abajo para tubos."
          : "Bolsas de 5 cm en los 4 lados para estructura.";
  const targetWidth = line.cutWidth || 0.61,
    effectiveCatalog: Line["cutCatalog"] = line.cutCatalog,
    catalog: any[] =
      effectiveCatalog === "LX Hausys / DM Lite" ? lxCatalog : arlonCatalog,
    usableCatalog = catalog.filter((x) => x.stock_status !== "No disponible"),
    applications = [
      ...new Set(
        usableCatalog
          .filter((x) =>
            x.available_widths
              .split(",")
              .map(Number)
              .some((w: number) => Math.abs(w - targetWidth) < 0.02),
          )
          .map((x) => x.application),
      ),
    ],
    seriesOptions = [
      ...new Set(
        usableCatalog
          .filter(
            (x) =>
              (!line.arlonApplication ||
                x.application === line.arlonApplication) &&
              x.available_widths
                .split(",")
                .map(Number)
                .some((w: number) => Math.abs(w - targetWidth) < 0.02),
          )
          .map((x) => x.series),
      ),
    ],
    colorOptions = usableCatalog.filter(
      (x) =>
        x.series === line.arlonSeries &&
        x.available_widths
          .split(",")
          .map(Number)
          .some((w: number) => Math.abs(w - targetWidth) < 0.02),
    ),
    selectedArlon = catalog.find((x) => x.id === line.arlonId),
    smallArlon = effectiveCatalog === "Arlon" && line.linearMeters < 5,
    purchaseNote = smallArlon
      ? "Arlon menor a 5 m: compra en Guadalajara con $250 de flete."
      : effectiveCatalog === "Arlon"
        ? "Arlon desde 5 m: compra en Guadalajara sin flete."
        : line.linearMeters < 5
          ? "LX menor a 5 m: compra local sin flete."
          : "LX desde 5 m: compra en Guadalajara sin flete.";
  return (
    <div className={`editor concept-inline-editor phase-${phase}`}>
      <div className="editor-bar">
        <strong>Configurar {p.name}</strong>
        {phase === "printing" && (
          <button className="minimize-editor" onClick={close}>
            Minimizar ↑
          </button>
        )}
      </div>
      <div className="editor-section printing-section">
        <h4>Medidas y cantidad</h4>
        <div
          className={`form-grid concept-form ${p.mode === "linear" ? "linear" : "area"}`}
        >
          <div className="fixed-product">
            <small>Producto</small>
            <strong>{p.name}</strong>
          </div>
          {p.mode === "linear" ? (
            <>
              <label>
                Metros lineales
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={line.linearMeters}
                  onChange={(e) => {
                    const meters = Math.max(
                        1,
                        Math.ceil(Number(e.target.value) || 1),
                      ),
                      arlon = line.cutCatalog === "Arlon",
                      gdl = arlon || meters >= 5;
                    update({
                      linearMeters: meters,
                      cutSupplier: gdl
                        ? arlon
                          ? "ARLON GDL"
                          : "LX GDL"
                        : "Proveedor local LX",
                      cutFreight: arlon && meters < 5 ? 250 : 0,
                      cutFreeShippingThreshold: 0,
                    });
                  }}
                />
                <small>
                  Sólo se cotizan metros completos. Las fracciones se redondean
                  hacia arriba.
                </small>
              </label>
              <label>
                Marca / origen
                <select
                  value={effectiveCatalog}
                  onChange={(e) => {
                    const catalog = e.target.value as Line["cutCatalog"],
                      arlon = catalog === "Arlon",
                      gdl = arlon || line.linearMeters >= 5;
                    update({
                      cutCatalog: catalog,
                      arlonApplication: "",
                      arlonSeries: "",
                      arlonId: "",
                      colorCode: "",
                      arlonColorName: "",
                      arlonFinish: "",
                      arlonCostPerLinear: 0,
                      cutSupplier: gdl
                        ? arlon
                          ? "ARLON GDL"
                          : "LX GDL"
                        : "Proveedor local LX",
                      cutFreight: arlon && line.linearMeters < 5 ? 250 : 0,
                      cutFreeShippingThreshold: 0,
                    });
                  }}
                >
                  <option>Arlon</option>
                  <option>LX Hausys / DM Lite</option>
                </select>
                <small>{purchaseNote}</small>
              </label>
              <label>
                Ancho del material
                <select
                  value={targetWidth}
                  onChange={(e) =>
                    update({
                      cutWidth: Number(e.target.value) as 0.61 | 1.22,
                      arlonWidth: Number(e.target.value),
                      arlonApplication: "",
                      arlonSeries: "",
                      arlonId: "",
                      colorCode: "",
                      arlonColorName: "",
                      arlonFinish: "",
                      arlonCostPerLinear: 0,
                    })
                  }
                >
                  <option value={0.61}>60 cm</option>
                  <option value={1.22}>122 cm</option>
                </select>
              </label>
              <label>
                Aplicación
                <select
                  value={line.arlonApplication}
                  onChange={(e) =>
                    update({
                      arlonApplication: e.target.value,
                      arlonSeries: "",
                      arlonId: "",
                      colorCode: "",
                      arlonColorName: "",
                      arlonFinish: "",
                      arlonCostPerLinear: 0,
                    })
                  }
                >
                  <option value="">Seleccionar aplicación</option>
                  {applications.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Serie
                <select
                  value={line.arlonSeries}
                  disabled={!line.arlonApplication}
                  onChange={(e) => {
                    const first = catalog.find(
                      (x) => x.series === e.target.value,
                    );
                    update({
                      arlonSeries: e.target.value,
                      arlonId: "",
                      colorCode: "",
                      arlonColorName: "",
                      arlonFinish: first?.finish || "",
                      arlonWidth: targetWidth,
                      arlonCostPerLinear: 0,
                    });
                  }}
                >
                  <option value="">Seleccionar serie</option>
                  {seriesOptions.map((x) => (
                    <option key={x} value={x}>
                      {effectiveCatalog === "Arlon" ? "Arlon " : ""}
                      {x}
                    </option>
                  ))}
                </select>
              </label>
              <label className="arlon-color-select">
                Código y color
                <select
                  value={line.arlonId}
                  disabled={!line.arlonSeries}
                  onChange={(e) => {
                    const item: any = catalog.find(
                      (x) => x.id === e.target.value,
                    );
                    if (!item) return;
                    const costPerLinear =
                        targetWidth < 0.7
                          ? item.meter_cost_061
                          : item.meter_cost_122,
                      arlon = effectiveCatalog === "Arlon",
                      gdl = arlon || line.linearMeters >= 5;
                    update({
                      arlonId: item.id,
                      colorCode: item.color_code,
                      arlonColorName: item.color_name,
                      arlonFinish: item.finish,
                      arlonWidth: targetWidth,
                      arlonCostPerLinear: costPerLinear,
                      cutCatalog: effectiveCatalog,
                      cutSupplier: gdl
                        ? item.supplier || (arlon ? "ARLON GDL" : "LX GDL")
                        : "Proveedor local LX",
                      cutFreight: arlon && line.linearMeters < 5 ? 250 : 0,
                      cutFreeShippingThreshold: 0,
                    });
                  }}
                >
                  <option value="">Seleccionar código y color</option>
                  {colorOptions.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.color_code} · {x.color_name} · {x.color_family}
                    </option>
                  ))}
                </select>
                {selectedArlon && (
                  <small className="selected-color">
                    <i style={{ background: selectedArlon.hex }} />
                    {selectedArlon.color_code} · {selectedArlon.color_name} ·{" "}
                    {selectedArlon.finish}
                    {selectedArlon.equivalence_status
                      ? ` · ${selectedArlon.equivalence_status}`
                      : ""}
                  </small>
                )}
              </label>
            </>
          ) : (
            <>
              <label>
                Ancho final (m)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={line.width}
                  onChange={(e) => update({ width: Number(e.target.value) })}
                />
              </label>
              <label>
                Alto final (m)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={line.height}
                  onChange={(e) => update({ height: Number(e.target.value) })}
                />
              </label>
              <label>
                Cantidad
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={line.quantity}
                  onChange={(e) => update({ quantity: Number(e.target.value) })}
                />
              </label>
            </>
          )}
          <label className="file-description">
            Descripción de archivo (opcional)
            <input
              type="text"
              value={line.fileDescription || ""}
              maxLength={160}
              onChange={(e) => update({ fileDescription: e.target.value })}
              placeholder="Describir el proyecto"
            />
            <small>
              Esta descripción será visible para el cliente en la cotización y
              el PDF.
            </small>
          </label>
        </div>
      </div>
      <div className="editor-section printing-section">
        <h4>Producción</h4>
        {p.mode === "area" ? (
          <div className="quick-options">
            <label>
              Equipo de impresión
              <select
                disabled={p.id === "lona"}
                value={p.id === "lona" ? "Solvente Flytoo" : line.equipment}
                onChange={(e) =>
                  update({ equipment: e.target.value as Equipment })
                }
              >
                {p.id === "lona" ? (
                  <option>Solvente Flytoo</option>
                ) : (
                  <>
                    <option>HP Latex</option>
                    <option>Solvente Flytoo</option>
                    <option>UV</option>
                  </>
                )}
              </select>
            </label>
            {p.id !== "lona" && line.equipment === "UV" && (
              <>
                <Check
                  label="Agregar tinta blanca"
                  checked={line.whiteInk}
                  onChange={(v) => update({ whiteInk: v })}
                />
                <label>
                  Capas de barniz
                  <select
                    value={line.varnish}
                    onChange={(e) =>
                      update({ varnish: Number(e.target.value) })
                    }
                  >
                    <option value={0}>Sin barniz</option>
                    <option value={1}>1 capa</option>
                    <option value={2}>2 capas</option>
                  </select>
                </label>
              </>
            )}
          </div>
        ) : (
          <div className="cut-production-status">
            <div className="required-chip">
              ✓ Corte de vinil por metro lineal
            </div>
            {line.arlonId && line.arlonCostPerLinear === 0 && (
              <div className="cost-pending-chip">
                Costo pendiente de cargar en Materias primas
              </div>
            )}
          </div>
        )}
      </div>
      <div className="editor-section finishes-section">
        <h4>Acabados</h4>
        <div
          className={`finish-grid quick-finishes ${p.id === "lona" ? "canvas-finishes" : ""}`}
        >
          {p.id === "lona" && (
            <>
              <div className="finish-button-group">
                <span>Tipo de acabado perimetral</span>
                <div>
                  {(
                    [
                      ["ACA-01", "Corte al ras"],
                      ["ACA-02", "Dobladillo sellado"],
                      ["ACA-03", "Bolsa sup/inf"],
                      ["ACA-05", "Bolsa perimetral"],
                    ] as [PerimeterFinish, string][]
                  ).map(([value, label]) => (
                    <button
                      type="button"
                      className={
                        line.perimeterFinish === value &&
                        !line.tensionedOnStructure
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        update({
                          perimeterFinish: value,
                          tensionedOnStructure: false,
                          panelization: "none",
                        })
                      }
                      key={value}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <small>{finishDescription}</small>
              </div>
              <div className="finish-button-group">
                <span>Distribución de ojillos</span>
                <div>
                  {(
                    [
                      ["OJ-00", "Sin ojillos"],
                      ["OJ-ESQ", "4 esquinas"],
                      ["OJ-100", "Cada 1.00 m"],
                      ["OJ-050", "Cada 0.50 m"],
                      ["OJ-025", "Cada 0.25 m"],
                    ] as [GrommetPattern, string][]
                  ).map(([value, label]) => (
                    <button
                      type="button"
                      className={
                        line.grommetPattern === value &&
                        !line.tensionedOnStructure
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        update({
                          grommetPattern: value,
                          tensionedOnStructure: false,
                        })
                      }
                      key={value}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <small>
                  {automaticGrommets(line)} ojillos calculados automáticamente
                </small>
              </div>
              <div className="finish-button-group tension-option">
                <span>Lona para tensar en bastidor</span>
                <div>
                  <button
                    type="button"
                    className={
                      line.tensionedOnStructure && line.panelization === "none"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      update({
                        tensionedOnStructure: true,
                        perimeterFinish: "ACA-01",
                        grommetPattern: "OJ-00",
                        panelization: "none",
                      })
                    }
                  >
                    Sin bastilla ni ojillos
                  </button>
                  {Math.max(line.width, line.height) > 1.55 && (
                    <>
                      <button
                        type="button"
                        className={
                          line.tensionedOnStructure &&
                          line.panelization === "horizontal"
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          update({
                            tensionedOnStructure: true,
                            perimeterFinish: "ACA-01",
                            grommetPattern: "OJ-00",
                            panelization: "horizontal",
                          })
                        }
                      >
                        Panelación horizontal
                      </button>
                      <button
                        type="button"
                        className={
                          line.tensionedOnStructure &&
                          line.panelization === "vertical"
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          update({
                            tensionedOnStructure: true,
                            perimeterFinish: "ACA-01",
                            grommetPattern: "OJ-00",
                            panelization: "vertical",
                          })
                        }
                      >
                        Panelación vertical
                      </button>
                    </>
                  )}
                </div>
                <small>
                  {Math.max(line.width, line.height) > 1.55
                    ? "Obligatoria: selecciona la orientación de panelación; considera traslape de 5 cm por unión."
                    : "Al activar esta opción se eliminan automáticamente bastilla y ojillos."}
                </small>
              </div>
            </>
          )}
          {p.id !== "lona" && p.mode === "area" && (
            <>
              <Check
                label="Refile perimetral"
                checked={line.trim}
                onChange={(v) => update({ trim: v })}
              />
              <Check
                label="Corte a forma en Plotter de Corte"
                checked={line.shapeCut}
                onChange={(v) => update({ shapeCut: v })}
              />
            </>
          )}
          {p.mode === "linear" && (
            <>
              <div className="required-chip">
                ✓ Transfer obligatorio de 122 cm
              </div>
              <label className="weed-complexity">
                Complejidad del depilado
                <select
                  value={line.weedComplexity || "simple"}
                  onChange={(e) =>
                    update({ weedComplexity: e.target.value as WeedComplexity })
                  }
                >
                  <option value="simple">
                    Simple · textos o figuras grandes
                  </option>
                  <option value="media">
                    Media · detalles medianos y varios elementos
                  </option>
                  <option value="alta">
                    Alta · textos pequeños o detalle fino
                  </option>
                </select>
                <small>
                  Incrementa automáticamente la mano de obra por metro lineal.
                </small>
              </label>
            </>
          )}
        </div>
      </div>
      <div className="editor-total">
        <span>
          Costo calculado: <strong>{money(r.cost)}</strong>
        </span>
        {phase === "printing" ? (
          <button className="primary" onClick={close}>
            Listo, guardar cambios
          </button>
        ) : (
          <small>Los cambios se guardan automáticamente.</small>
        )}
      </div>
    </div>
  );
}
function ModuleNotApplicable({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <section className="step-panel">
      <div className="card-title">
        <div>
          <p className="eyebrow">PASO {step} DE 7</p>
          <h2>{title}</h2>
          <p>Etapa contemplada dentro de la arquitectura modular.</p>
        </div>
      </div>
      <div className="not-applicable-card">
        <span>✓</span>
        <div>
          <strong>No aplica para Print To Go</strong>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}
function ProcessStage({
  step,
  title,
  description,
  options,
}: {
  step: string;
  title: string;
  description: string;
  options: string[];
}) {
  return (
    <section className="step-panel">
      <div className="card-title">
        <div>
          <p className="eyebrow">PASO {step} DE 8</p>
          <h2>{title} del proyecto</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="process-stage-card">
        <label>
          Alcance previsto
          <select defaultValue={options[0]} aria-label={`Alcance de ${title}`}>
            {options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <div className="process-stage-note">
          <strong>Etapa habilitada</strong>
          <span>
            El cálculo detallado se integrará al construir el módulo de{" "}
            {title.toLowerCase()}; por ahora puedes recorrer el flujo completo
            sin que se modifiquen los costos vigentes.
          </span>
        </div>
      </div>
    </section>
  );
}
function StructureConfigurator({
  lines,
  draft,
  setDraft,
  recipe,
  barCost,
  consumables,
  paintCost,
  laborCost,
  cost,
  price,
}: {
  lines: Line[];
  draft: StructureDraft;
  setDraft: (value: StructureDraft) => void;
  recipe: ReturnType<typeof structureRecipe> | null;
  barCost: number;
  consumables: number;
  paintCost: number;
  laborCost: number;
  cost: number;
  price: number;
}) {
  const selected =
    lines.find((line) => line.id === draft.targetLineId) ||
    lines.find((line) => line.productId === "lona") ||
    lines[0];
  const update = (patch: Partial<StructureDraft>) =>
    setDraft({ ...draft, ...patch });
  return (
    <section className="step-panel">
      <div className="card-title">
        <div>
          <p className="eyebrow">PASO 6 DE 8</p>
          <h2>Estructura del proyecto</h2>
          <p>
            Configura un bastidor de herrería para tensar lona o soportar el
            gráfico. La receta se recalcula con las medidas del concepto
            elegido.
          </p>
        </div>
      </div>
      {!lines.length ? (
        <div className="empty compact-empty">
          <h3>Primero agrega un concepto</h3>
          <p>
            La estructura se genera a partir de las medidas de una lona, vinil o
            pieza de Gran Formato.
          </p>
        </div>
      ) : (
        <>
          <div className="structure-toggle">
            <label>
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => update({ enabled: e.target.checked })}
              />{" "}
              Incluir bastidor de herrería en este proyecto
            </label>
          </div>
          {draft.enabled && recipe && (
            <div className="structure-config">
              <div className="structure-fields">
                <label>
                  Concepto a estructurar
                  <select
                    value={selected?.id || ""}
                    onChange={(e) =>
                      update({ targetLineId: Number(e.target.value) })
                    }
                  >
                    {lines.map((line, i) => {
                      const product = products.find(
                        (p) => p.id === line.productId,
                      );
                      return (
                        <option key={line.id} value={line.id}>
                          {String(i + 1).padStart(2, "0")} · {product?.name} ·{" "}
                          {line.width} × {line.height} m · {line.quantity}{" "}
                          pza(s)
                        </option>
                      );
                    })}
                  </select>
                </label>
                <label>
                  Perfil sugerido
                  <select
                    value={draft.profile || recipe.profile}
                    onChange={(e) => update({ profile: e.target.value })}
                  >
                    <option>Tubular ½” × ½” cal. 18</option>
                    <option>Tubular ¾” × ¾” cal. 18</option>
                    <option>Tubular 1” × 1” cal. 18</option>
                  </select>
                </label>
                <label>
                  Travesaños horizontales
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      draft.horizontalReinforcements >= 0
                        ? draft.horizontalReinforcements
                        : recipe.horizontalReinforcements
                    }
                    onChange={(e) =>
                      update({
                        horizontalReinforcements: Math.max(
                          0,
                          Math.floor(Number(e.target.value)),
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Travesaños verticales
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      draft.verticalReinforcements >= 0
                        ? draft.verticalReinforcements
                        : recipe.verticalReinforcements
                    }
                    onChange={(e) =>
                      update({
                        verticalReinforcements: Math.max(
                          0,
                          Math.floor(Number(e.target.value)),
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Acabado
                  <select
                    value={
                      draft.paint ? "Pintura anticorrosiva" : "Sin pintura"
                    }
                    onChange={(e) =>
                      update({
                        paint: e.target.value === "Pintura anticorrosiva",
                      })
                    }
                  >
                    <option>Pintura anticorrosiva</option>
                    <option>Sin pintura</option>
                  </select>
                </label>
                <label className="wide">
                  Notas de producción
                  <input
                    value={draft.notes}
                    onChange={(e) => update({ notes: e.target.value })}
                    placeholder="Color, placas, anclajes, condición de muro u observaciones"
                  />
                </label>
              </div>
              <div className="structure-result">
                <div className="structure-diagram">
                  <div className="diagram-measure top">
                    {selected?.width.toFixed(2)} m
                  </div>
                  <div
                    className="diagram-frame"
                    style={{
                      width: `${((selected?.width || 1) / (selected?.height || 1)) >= 2.48 ? 620 : 250 * ((selected?.width || 1) / (selected?.height || 1))}px`,
                      height: `${((selected?.width || 1) / (selected?.height || 1)) >= 2.48 ? 620 / ((selected?.width || 1) / (selected?.height || 1)) : 250}px`,
                    }}
                  >
                    {Array.from({
                      length: recipe.horizontalReinforcements,
                    }).map((_, i) => (
                      <i
                        className="horizontal"
                        key={`h-${i}`}
                        style={{
                          top: `${((i + 1) / (recipe.horizontalReinforcements + 1)) * 100}%`,
                        }}
                      />
                    ))}
                    {Array.from({ length: recipe.verticalReinforcements }).map(
                      (_, i) => (
                        <i
                          className="vertical"
                          key={`v-${i}`}
                          style={{
                            left: `${((i + 1) / (recipe.verticalReinforcements + 1)) * 100}%`,
                          }}
                        />
                      ),
                    )}
                  </div>
                  <div className="diagram-measure side">
                    {selected?.height.toFixed(2)} m
                  </div>
                  <small>
                    Vista frontal · refuerzos verticales y horizontales
                  </small>
                </div>
                <div className="structure-specs">
                  <strong>{recipe.profile}</strong>
                  <span>
                    {recipe.horizontalReinforcements} horizontal(es) ·{" "}
                    {recipe.verticalReinforcements} vertical(es)
                  </span>
                  <span>
                    {recipe.bars} barra(s) de 6 m ·{" "}
                    {recipe.requiredMeters.toFixed(2)} m con merma
                  </span>
                  <span>{recipe.pijas} pijabrocas con rondana, aprox.</span>
                </div>
              </div>
              <div className="structure-costs">
                <div>
                  <span>Perfil</span>
                  <strong>{money(recipe.bars * barCost)}</strong>
                  <small>
                    {recipe.bars} barras × {money(barCost)}
                  </small>
                </div>
                <div>
                  <span>Insumos de fabricación</span>
                  <strong>{money(consumables)}</strong>
                  <small>Soldadura, discos y pijabrocas</small>
                </div>
                <div>
                  <span>Pintura y anticorrosivo</span>
                  <strong>{money(paintCost)}</strong>
                  <small>
                    {draft.paint ? "Primer, pintura y thinner" : "No aplicado"}
                  </small>
                </div>
                <div>
                  <span>Mano de obra</span>
                  <strong>{money(laborCost)}</strong>
                  <small>{recipe.laborHours.toFixed(2)} h de fabricación</small>
                </div>
                <div>
                  <span>Costo / precio sugerido</span>
                  <strong>
                    {money(cost)} / {money(price)}
                  </strong>
                  <small>Se integrará al total al cerrar este módulo.</small>
                </div>
              </div>
              <div className="structure-production-note">
                <strong>Orden de producción</strong>
                <span>
                  El diagrama, lista de cortes, barras, travesaños, pijas y
                  notas se guardarán dentro de la orden de producción del
                  proyecto.
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
function ProductionEditor({
  line,
  update,
  finishes,
}: {
  line: Line;
  update: (p: Partial<Line>) => void;
  finishes: boolean;
}) {
  const p = products.find((x) => x.id === line.productId)!,
    r = calc(line);
  return (
    <div className="editor inline-editor">
      <div className="editor-bar">
        <strong>{p.name}</strong>
        <span>{r.waste.toFixed(2)} m² de merma</span>
      </div>
      {!finishes ? (
        <>
          <div className="form-grid two">
            <label>
              Equipo de impresión
              <select
                disabled={p.mode === "linear"}
                value={line.equipment}
                onChange={(e) =>
                  update({ equipment: e.target.value as Equipment })
                }
              >
                <option>HP Latex</option>
                <option>Solvente Flytoo</option>
                <option>UV</option>
              </select>
            </label>
            {line.equipment === "UV" && p.mode === "area" && (
              <>
                <Check
                  label="Agregar tinta blanca"
                  checked={line.whiteInk}
                  onChange={(v) => update({ whiteInk: v })}
                />
                <label>
                  Capas de barniz
                  <select
                    value={line.varnish}
                    onChange={(e) =>
                      update({ varnish: Number(e.target.value) })
                    }
                  >
                    <option value={0}>Sin barniz</option>
                    <option value={1}>1 capa</option>
                    <option value={2}>2 capas</option>
                  </select>
                </label>
              </>
            )}
          </div>
          <div className="metrics">
            <div>
              <small>Área neta</small>
              <strong>{r.net.toFixed(2)} m²</strong>
            </div>
            <div>
              <small>Área cobrable</small>
              <strong>{r.bill.toFixed(2)} m²</strong>
            </div>
            <div>
              <small>Merma</small>
              <strong>{r.waste.toFixed(2)} m²</strong>
            </div>
            <div>
              <small>Ancho de rollo</small>
              <strong>{p.rollWidth} m</strong>
            </div>
          </div>
        </>
      ) : (
        <div className="finish-grid">
          {p.id === "lona" && (
            <>
              <Check
                label="Bastilla perimetral"
                checked={line.hem}
                onChange={(v) => update({ hem: v })}
              />
              <Check
                label="Ojillos"
                checked={line.grommets}
                onChange={(v) => update({ grommets: v })}
              />
              {line.grommets && (
                <label>
                  Cantidad de ojillos
                  <input
                    type="number"
                    value={line.grommetQty}
                    onChange={(e) =>
                      update({ grommetQty: Number(e.target.value) })
                    }
                  />
                </label>
              )}
            </>
          )}
          {p.id !== "lona" && p.mode === "area" && (
            <>
              <Check
                label="Refile perimetral"
                checked={line.trim}
                onChange={(v) => update({ trim: v })}
              />
              <Check
                label="Corte a forma en Plotter de Corte"
                checked={line.shapeCut}
                onChange={(v) => update({ shapeCut: v })}
              />
            </>
          )}
          {p.mode === "linear" && (
            <>
              <div className="required-chip">✓ Transfer obligatorio</div>
              <div className="required-chip">✓ Corte y depilado</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>✓</span>
      {label}
    </label>
  );
}
function DesignServicePanel({
  service,
  setService,
  extraChanges,
  setExtraChanges,
  extraAdaptations,
  setExtraAdaptations,
  total,
}: {
  service: DesignService;
  setService: (value: DesignService) => void;
  extraChanges: number;
  setExtraChanges: (value: number) => void;
  extraAdaptations: number;
  setExtraAdaptations: (value: number) => void;
  total: number;
}) {
  const selected = designServices[service];
  return (
    <section className="design-service-panel">
      <div className="design-service-head">
        <div>
          <p className="eyebrow">DISEÑO GRÁFICO</p>
          <h3>Preparación y diseño del proyecto</h3>
          <small>
            Tarifas cerradas. Una propuesta y dos rondas de cambios menores
            incluidas.
          </small>
        </div>
        <strong>{money(total)}</strong>
      </div>
      <div className="design-service-grid">
        <label className="design-main-select">
          Servicio requerido
          <select
            value={service}
            onChange={(e) => {
              setService(e.target.value as DesignService);
              setExtraChanges(0);
              setExtraAdaptations(0);
            }}
          >
            {Object.entries(designServices).map(([code, item]) => (
              <option key={code} value={code}>
                [{code}] {item.name} · {money(item.price)}
              </option>
            ))}
          </select>
          <small>{selected.description}</small>
        </label>
        <label>
          Cambios adicionales
          <input
            type="number"
            min="0"
            step="1"
            value={extraChanges}
            onChange={(e) =>
              setExtraChanges(Math.max(0, Math.floor(Number(e.target.value))))
            }
          />
          <small>$150 cada uno, después de los dos incluidos.</small>
        </label>
        <label>
          Adaptaciones adicionales
          <input
            type="number"
            min="0"
            step="1"
            value={extraAdaptations}
            onChange={(e) =>
              setExtraAdaptations(
                Math.max(0, Math.floor(Number(e.target.value))),
              )
            }
          />
          <small>$100 por medida o formato adicional.</small>
        </label>
      </div>
      <p className="design-exclusion">
        No incluye creación de logotipos, identidad visual ni desarrollo de
        marca.
      </p>
    </section>
  );
}
function CostBreakdown({
  rows,
  designCost,
  procurementFreight = 0,
  structureProfileCost,
  structureFabricationCost,
  structurePaintCost,
  structureLaborCost,
}: {
  rows: {
    line: Line;
    result: ReturnType<typeof calc>;
  }[];
  designCost: number;
  procurementFreight?: number;
  structureEnabled: boolean;
  structureProfileCost: number;
  structureFabricationCost: number;
  structurePaintCost: number;
  structureLaborCost: number;
}) {
  const sums = rows.reduce(
    (a, x) => ({
      material: a.material + x.result.material,
      ink: a.ink + x.result.ink,
      finishes: a.finishes + x.result.finishes,
      transfer: a.transfer + x.result.transfer,
      labor: a.labor + x.result.labor,
    }),
    { material: 0, ink: 0, finishes: 0, transfer: 0, labor: 0 },
  );
  const details = [
    { name: "Sustratos", value: sums.material, group: "Materia prima" },
    { name: "Tinta y operación", value: sums.ink, group: "Costos indirectos" },
    { name: "Acabados", value: sums.finishes, group: "Procesos" },
    { name: "Transfer 122 cm", value: sums.transfer, group: "Materia prima" },
    { name: "Mano de obra / depilado", value: sums.labor, group: "Mano de obra" },
    { name: "Flete de abastecimiento", value: procurementFreight || 0, group: "Costos indirectos" },
    { name: "Diseño gráfico", value: designCost, group: "Mano de obra" },
    { name: "Perfil de herrería", value: structureProfileCost, group: "Materia prima" },
    { name: "Insumos de fabricación", value: structureFabricationCost, group: "Costos indirectos" },
    { name: "Pintura y anticorrosivo", value: structurePaintCost, group: "Materia prima" },
    { name: "Mano de obra de herrería", value: structureLaborCost, group: "Mano de obra" },
  ].filter((item) => item.value > 0 || item.name === "Flete de abastecimiento");
  const general = ["Materia prima", "Mano de obra", "Procesos", "Costos indirectos"].map((group) => ({ group, value: details.filter((item) => item.group === group).reduce((total, item) => total + item.value, 0) }));
  const highest = Math.max(1, ...details.map((item) => item.value));
  return <section className="cost-analysis"><div><h3>Costos por insumo y proceso</h3><div className="cost-breakdown">{details.map((item) => <div key={item.name}><span>{item.name}<small>{item.group}</small></span><strong>{money(item.value)}</strong></div>)}</div></div><aside className="cost-chart"><h3>Impacto de cada costo</h3><p>Comparativo del costo interno del proyecto.</p>{details.map((item) => <div className="bar-row" key={item.name}><span>{item.name}</span><div><i style={{ width: `${(item.value / highest) * 100}%` }} /></div><strong>{money(item.value)}</strong></div>)}</aside><div className="cost-groups"><h3>Clasificación general</h3>{general.map((item) => <div key={item.group}><span>{item.group}</span><strong>{money(item.value)}</strong></div>)}</div></section>;
}
function QuotePreviewPanel({
  record,
  onEdit,
  onNavigate,
  onNew,
  onSent,
}: {
  record: QuoteRecord;
  onEdit: () => void;
  onNavigate: (id: string) => void;
  onNew: () => void;
  onSent: () => void;
}) {
  const data = JSON.parse(record.payload),
    items = data.items || [];
  const markSent = async () => {
    await fetch(`/api/quotes/${record.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "Enviada" }),
    });
    onSent();
  };
  return (
    <main className="business-shell">
      <PersistentSidebar
        active="quotes"
        onNavigate={onNavigate}
        onNewQuote={onNew}
      />
      <section className="business-main preview-main">
        <header className="business-topbar preview-top">
          <div>
            <strong>Vista previa de cotización</strong>
          </div>
          <div />
          <div className="preview-status">
            <em className={`status-pill ${record.status.toLowerCase()}`}>
              {record.status}
            </em>
          </div>
        </header>
        <div className="preview-workspace">
          <div className="preview-actions">
            <div>
              <p className="eyebrow">COTIZACIÓN GUARDADA</p>
              <h1>{record.folio}</h1>
              <p>
                Así se presentará el presupuesto al cliente. Revísalo antes de
                enviarlo.
              </p>
            </div>
            <div>
              <button className="ghost" onClick={onEdit}>
                ← Volver a editar
              </button>
              <button
                className="ghost"
                onClick={() => openQuoteDocument(record, "quote")}
              >
                Descargar / imprimir PDF
              </button>
              {record.status !== "Enviada" && (
                <button className="primary" onClick={markSent}>
                  Marcar como enviada
                </button>
              )}
            </div>
          </div>
          <article className="client-quote-preview">
            <header>
              <div className="preview-logo">
                <img src="/custom-graphics-logo.png" alt="Custom Graphics" />
              </div>
              <div>
                <small>COTIZACIÓN</small>
                <strong>{record.folio}</strong>
                <span>
                  {new Date(record.updated_at).toLocaleDateString("es-MX")}
                </span>
              </div>
            </header>
            <section className="preview-client-meta">
              <div>
                <small>CLIENTE</small>
                <strong>{record.customer_name}</strong>
              </div>
              <div>
                <small>ATENDIÓ</small>
                <strong>{record.seller}</strong>
              </div>
              <div>
                <small>VIGENCIA</small>
                <strong>15 días</strong>
              </div>
            </section>
            <div className="preview-line header">
              <span>Descripción del proyecto</span>
              <span>Cantidad</span>
              <span>Precio unitario</span>
              <span>Importe</span>
            </div>
            {items.map((item: any, i: number) => {
              const l = item.line,
                p = l ? products.find((x) => x.id === l.productId) : undefined,
                quantity =
                  item.quantity ||
                  (l
                    ? p?.mode === "linear"
                      ? l.linearMeters
                      : l.quantity
                    : 1),
                unitPrice =
                  item.unitPrice ||
                  (quantity ? item.price / quantity : item.price);
              return (
                <div className="preview-line" key={i}>
                  <span>
                    <strong>{item.product || p?.name}</strong>
                    <small>
                      {item.description ||
                        (l
                          ? commercialDescription(l)
                          : "Servicio de diseño gráfico")}
                    </small>
                  </span>
                  <span>
                    {quantity} {item.unit || ""}
                  </span>
                  <strong>{money(unitPrice || 0)}</strong>
                  <strong>{money(item.price || 0)}</strong>
                </div>
              );
            })}
            <section className="preview-totals">
              {data.discountPercent > 0 && (
                <>
                  <div>
                    <span>Precio de lista</span>
                    <strong>
                      {money(data.grossSubtotal || record.subtotal)}
                    </strong>
                  </div>
                  <div className="discount-row">
                    <span>Descuento {data.discountPercent}%</span>
                    <strong>− {money(data.discountAmount || 0)}</strong>
                  </div>
                </>
              )}
              <div>
                <span>Subtotal</span>
                <strong>{money(record.subtotal)}</strong>
              </div>
              <div>
                <span>IVA 16%</span>
                <strong>{money(record.tax)}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{money(record.total)}</strong>
              </div>
            </section>
            <footer>
              <strong>Condiciones comerciales</strong>
              <p>
                Precios expresados en moneda nacional. Producción sujeta a
                confirmación de anticipo y aprobación de archivos. Vigencia de
                15 días.
              </p>
            </footer>
          </article>
        </div>
      </section>
    </main>
  );
}
function PersistentSidebar({
  active,
  onNavigate,
  onNewQuote,
  quoteCount,
}: {
  active: string;
  onNavigate: (id: string) => void;
  onNewQuote: () => void;
  quoteCount?: number;
}) {
  return (
    <aside className="business-sidebar">
      <div className="side-brand">
        <img src="/custom-graphics-logo.png" alt="Custom Graphics" />
        <div>
          <small>Gestión comercial</small>
        </div>
      </div>
      <button
        className={`new-quote ${active === "new" ? "current" : ""}`}
        onClick={onNewQuote}
      >
        ＋ Nueva cotización
      </button>
      <nav>
        {[
          ["dashboard", "⌂", "Inicio"],
          ["materials", "▦", "Materias primas"],
          ["suppliers", "◇", "Proveedores"],
          ["purchases", "▧", "Órdenes de compra"],
          ["clients", "♙", "Clientes"],
          ["quotes", "▤", "Cotizaciones"],
          ["sales", "✓", "Ventas"],
          ["settings", "⚙", "Configuración"],
        ].map(([id, icon, label]) => (
          <button
            key={id}
            className={active === id ? "active" : ""}
            onClick={() => onNavigate(id)}
          >
            <i>{icon}</i>
            {label}
            {id === "quotes" && quoteCount !== undefined && (
              <em>{quoteCount}</em>
            )}
          </button>
        ))}
      </nav>
      <div className="side-module">
        <small>MÓDULO ACTIVO</small>
        <strong>Cotizador</strong>
        <span>Selección por módulo</span>
      </div>
    </aside>
  );
}
function BusinessPlatform({
  initialSection,
  onNewQuote,
  onEditQuote,
}: {
  initialSection: string;
  onNewQuote: () => void;
  onEditQuote: (r: QuoteRecord) => void;
}) {
  const [section, setSection] = useState(initialSection),
    [quotes, setQuotes] = useState<QuoteRecord[]>([]),
    [materials, setMaterials] = useState<MaterialRecord[]>([]),
    [clients, setClients] = useState<ClientRecord[]>([]),
    [suppliers, setSuppliers] = useState<SupplierRecord[]>([]),
    [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>([]),
    [organization, setOrganization] = useState<OrganizationRecord | null>(null),
    [users, setUsers] = useState<AppUserRecord[]>([]),
    [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const safe = async <T,>(url: string, fallback: T): Promise<T> => {
      try {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`${url}: ${r.status}`);
        return await r.json();
      } catch (e) {
        console.error("Error al cargar módulo", e);
        return fallback;
      }
    };
    const [q, m, c, s, po, o, u] = await Promise.all([
      safe<QuoteRecord[]>("/api/quotes", []),
      safe<MaterialRecord[]>("/api/materials", []),
      safe<ClientRecord[]>("/api/clients", []),
      safe<SupplierRecord[]>("/api/suppliers", []),
      safe<PurchaseOrderRecord[]>("/api/purchase-orders", []),
      safe<OrganizationRecord | null>("/api/organization", null),
      safe<AppUserRecord[]>("/api/users", []),
    ]);
    setQuotes(q);
    setMaterials(m);
    setClients(c);
    setSuppliers(s);
    setPurchaseOrders(po);
    setOrganization(o);
    setUsers(u);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  const titles: Record<string, string> = {
    dashboard: "Inicio",
    materials: "Materias primas",
    suppliers: "Proveedores",
    purchases: "Órdenes de compra",
    clients: "Clientes",
    quotes: "Cotizaciones",
    sales: "Ventas",
    settings: "Configuración",
  };
  return (
    <main className="business-shell">
      <PersistentSidebar
        active={section}
        onNavigate={setSection}
        onNewQuote={onNewQuote}
        quoteCount={quotes.length}
      />
      <section className="business-main">
        <header className="business-topbar">
          <div>
            <button className="mobile-menu">☰</button>
            <strong>{titles[section]}</strong>
          </div>
          <div className="top-search">
            ⌕ <input placeholder="Buscar en el sistema" />
          </div>
          <div className="user-chip">
            <span>HG</span>
            <div>
              <strong>Héctor Gradilla</strong>
              <small>Administrador</small>
            </div>
          </div>
        </header>
        {loading ? (
          <div className="business-loading">
            Cargando información del negocio...
          </div>
        ) : section === "dashboard" ? (
          <DashboardView
            quotes={quotes}
            clients={clients}
            materials={materials}
            onNewQuote={onNewQuote}
            onSection={setSection}
          />
        ) : section === "materials" ? (
          <MaterialsView records={materials} reload={load} />
        ) : section === "suppliers" ? (
          <SuppliersView records={suppliers} reload={load} />
        ) : section === "purchases" ? (
          <PurchaseOrdersView
            records={purchaseOrders}
            suppliers={suppliers}
            materials={materials}
            reload={load}
          />
        ) : section === "clients" ? (
          <ClientsView records={clients} reload={load} />
        ) : section === "settings" && organization ? (
          <SettingsView
            organization={organization}
            users={users}
            reload={load}
          />
        ) : (
          <CommercialTable
            records={
              section === "sales"
                ? quotes.filter((x) => x.status === "Venta")
                : quotes
            }
            salesOnly={section === "sales"}
            onEdit={onEditQuote}
            reload={load}
            onNewQuote={onNewQuote}
          />
        )}
      </section>
    </main>
  );
}
function DashboardView({
  quotes,
  clients,
  materials,
  onNewQuote,
  onSection,
}: {
  quotes: QuoteRecord[];
  clients: ClientRecord[];
  materials: MaterialRecord[];
  onNewQuote: () => void;
  onSection: (s: string) => void;
}) {
  const now = new Date(),
    monthly = quotes.filter((q) => {
      const d = new Date(q.created_at);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }),
    sales = monthly.filter((q) => q.status === "Venta"),
    salesTotal = sales.reduce((a, b) => a + b.total, 0),
    pipeline = monthly
      .filter((q) => q.status !== "Venta")
      .reduce((a, b) => a + b.total, 0),
    goal = 600000,
    progress = Math.min(100, (salesTotal / goal) * 100),
    close = monthly.length ? (sales.length / monthly.length) * 100 : 0;
  return (
    <div className="business-content">
      <div className="content-head">
        <div>
          <p className="eyebrow">RESUMEN DEL MES</p>
          <h1>Panel comercial</h1>
          <p>
            Una vista rápida de cotizaciones, oportunidades y ventas de{" "}
            {now.toLocaleDateString("es-MX", {
              month: "long",
              year: "numeric",
            })}
            .
          </p>
        </div>
        <button className="primary" onClick={onNewQuote}>
          ＋ Crear cotización
        </button>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Cotizaciones realizadas</span>
          <strong>{monthly.length}</strong>
          <small>{quotes.length} en el historial</small>
        </div>
        <div className="kpi-card">
          <span>Oportunidades abiertas</span>
          <strong>{money(pipeline)}</strong>
          <small>Presupuestos aún no convertidos</small>
        </div>
        <div className="kpi-card">
          <span>Ventas del mes</span>
          <strong>{money(salesTotal)}</strong>
          <small>{sales.length} cotizaciones aceptadas</small>
        </div>
        <div className="kpi-card">
          <span>Tasa de cierre</span>
          <strong>{close.toFixed(1)}%</strong>
          <small>Conversión de cotización a venta</small>
        </div>
      </div>
      <div className="dashboard-grid">
        <section className="dashboard-card goal-card">
          <div className="panel-title">
            <div>
              <h2>Meta mensual de ventas</h2>
              <p>Avance acumulado contra la meta establecida.</p>
            </div>
            <strong>{progress.toFixed(1)}%</strong>
          </div>
          <div className="goal-values">
            <strong>{money(salesTotal)}</strong>
            <span>de {money(goal)}</span>
          </div>
          <div className="progress">
            <i style={{ width: `${progress}%` }} />
          </div>
          <div className="goal-foot">
            <span>
              Faltan <strong>{money(Math.max(0, goal - salesTotal))}</strong>
            </span>
            <span>
              Pipeline <strong>{money(pipeline)}</strong>
            </span>
          </div>
        </section>
        <section className="dashboard-card quick-card">
          <div className="panel-title">
            <div>
              <h2>Base operativa</h2>
              <p>Registros disponibles para cotizar.</p>
            </div>
          </div>
          <button onClick={() => onSection("clients")}>
            <span>Clientes</span>
            <strong>{clients.length} →</strong>
          </button>
          <button onClick={() => onSection("materials")}>
            <span>Materias primas</span>
            <strong>{materials.length} →</strong>
          </button>
          <button onClick={() => onSection("quotes")}>
            <span>Cotizaciones</span>
            <strong>{quotes.length} →</strong>
          </button>
        </section>
      </div>
      <section className="dashboard-card recent-card">
        <div className="panel-title">
          <div>
            <h2>Cotizaciones recientes</h2>
            <p>Últimos movimientos comerciales registrados.</p>
          </div>
          <button onClick={() => onSection("quotes")}>
            Ver historial completo →
          </button>
        </div>
        <div className="simple-table">
          <div className="simple-row header">
            <span>Fecha</span>
            <span>Folio</span>
            <span>Cliente</span>
            <span>Estado</span>
            <span>Total</span>
          </div>
          {quotes.slice(0, 6).map((q) => (
            <div className="simple-row" key={q.id}>
              <span>{new Date(q.updated_at).toLocaleDateString("es-MX")}</span>
              <strong>{q.folio}</strong>
              <span>{q.customer_name}</span>
              <em className={`status-pill ${q.status.toLowerCase()}`}>
                {q.status}
              </em>
              <strong>{money(q.total)}</strong>
            </div>
          ))}
          {quotes.length === 0 && (
            <div className="empty-row">
              Crea tu primera cotización para comenzar el historial.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
function SuppliersView({
  records,
  reload,
}: {
  records: SupplierRecord[];
  reload: () => void;
}) {
  const empty: SupplierRecord = {
      id: "",
      code: "",
      name: "",
      legal_name: "",
      tax_id: "",
      contact_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "Jalisco",
      postal_code: "",
      payment_terms: "Contado",
      default_freight: 0,
      free_shipping_threshold: 0,
      notes: "",
      active: 1,
      updated_at: 0,
    },
    [draft, setDraft] = useState<SupplierRecord | null>(null),
    [search, setSearch] = useState("");
  const filtered = records.filter((x) =>
      `${x.code} ${x.name} ${x.legal_name} ${x.contact_name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
    save = async () => {
      if (!draft?.name) return;
      await fetch(draft.id ? `/api/suppliers/${draft.id}` : "/api/suppliers", {
        method: draft.id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      setDraft(null);
      reload();
    };
  return (
    <div className="business-content">
      <div className="content-head">
        <div>
          <p className="eyebrow">COMPRAS Y ABASTECIMIENTO</p>
          <h1>Proveedores</h1>
          <p>
            Datos comerciales, fiscales, fletes y condiciones para insumos
            comprados por proyecto.
          </p>
        </div>
        <button className="primary" onClick={() => setDraft(empty)}>
          ＋ Nuevo proveedor
        </button>
      </div>
      <div className="list-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar proveedor, código o contacto"
        />
        <span>{filtered.length} proveedores</span>
      </div>
      <div className="admin-table suppliers-table">
        <div className="admin-row admin-header">
          <span>Código</span>
          <span>Proveedor</span>
          <span>Contacto</span>
          <span>Condiciones</span>
          <span>Flete</span>
          <span></span>
        </div>
        {filtered.map((x) => (
          <div className="admin-row" key={x.id}>
            <strong>{x.code || "—"}</strong>
            <span>
              {x.name}
              <small>{x.tax_id || "Sin RFC"}</small>
            </span>
            <span>
              {x.contact_name || "—"}
              <small>{x.email || x.phone}</small>
            </span>
            <span>
              {x.payment_terms}
              <small>
                {x.free_shipping_threshold
                  ? `Envío gratis desde ${money(x.free_shipping_threshold)}`
                  : "Sin umbral"}
              </small>
            </span>
            <strong>{money(x.default_freight)}</strong>
            <button onClick={() => setDraft(x)}>Editar</button>
          </div>
        ))}
      </div>
      {draft && (
        <RecordModal
          title={draft.id ? "Editar proveedor" : "Nuevo proveedor"}
          close={() => setDraft(null)}
          save={save}
        >
          <div className="modal-grid">
            <label>
              Código
              <input
                value={draft.code}
                onChange={(e) =>
                  setDraft({ ...draft, code: e.target.value.toUpperCase() })
                }
              />
            </label>
            <label>
              Nombre comercial
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="wide">
              Razón social
              <input
                value={draft.legal_name}
                onChange={(e) =>
                  setDraft({ ...draft, legal_name: e.target.value })
                }
              />
            </label>
            <label>
              RFC
              <input
                value={draft.tax_id}
                onChange={(e) =>
                  setDraft({ ...draft, tax_id: e.target.value.toUpperCase() })
                }
              />
            </label>
            <label>
              Contacto
              <input
                value={draft.contact_name}
                onChange={(e) =>
                  setDraft({ ...draft, contact_name: e.target.value })
                }
              />
            </label>
            <label>
              Correo
              <input
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </label>
            <label>
              Teléfono
              <input
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              />
            </label>
            <label className="wide">
              Dirección
              <input
                value={draft.address}
                onChange={(e) =>
                  setDraft({ ...draft, address: e.target.value })
                }
              />
            </label>
            <label>
              Ciudad
              <input
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
              />
            </label>
            <label>
              Estado
              <input
                value={draft.state}
                onChange={(e) => setDraft({ ...draft, state: e.target.value })}
              />
            </label>
            <label>
              Código postal
              <input
                value={draft.postal_code}
                onChange={(e) =>
                  setDraft({ ...draft, postal_code: e.target.value })
                }
              />
            </label>
            <label>
              Condiciones de pago
              <input
                value={draft.payment_terms}
                onChange={(e) =>
                  setDraft({ ...draft, payment_terms: e.target.value })
                }
              />
            </label>
            <label>
              Flete habitual
              <input
                type="number"
                value={draft.default_freight}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    default_freight: Number(e.target.value),
                  })
                }
              />
            </label>
            <label>
              Envío gratis desde
              <input
                type="number"
                value={draft.free_shipping_threshold}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    free_shipping_threshold: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="wide">
              Notas
              <textarea
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </label>
          </div>
        </RecordModal>
      )}
    </div>
  );
}
function PurchaseOrdersView({
  records,
  suppliers,
  materials,
  reload,
}: {
  records: PurchaseOrderRecord[];
  suppliers: SupplierRecord[];
  materials: MaterialRecord[];
  reload: () => void;
}) {
  type Draft = Partial<PurchaseOrderRecord> & { items: PurchaseItem[] };
  const empty: Draft = {
      supplier_id: "",
      supplier_name: "",
      quote_folio: "",
      project_name: "",
      status: "Borrador",
      items: [
        {
          category: "Gran formato",
          description: "",
          quantity: 1,
          unit: "metro lineal",
          unit_cost: 0,
        },
      ],
      freight: 0,
      requested_by: "",
      required_date: "",
      notes: "",
    },
    [draft, setDraft] = useState<Draft | null>(null);
  const [rigids, setRigids] = useState<RigidMaterialRecord[]>([]),
    [arlon, setArlon] = useState<ArlonRecord[]>([]),
    [lx, setLx] = useState<LxRecord[]>([]);
  useEffect(() => {
    fetch("/api/rigid-materials")
      .then((r) => r.json())
      .then(setRigids)
      .catch(() => {});
    fetch("/api/arlon")
      .then((r) => r.json())
      .then(setArlon)
      .catch(() => {});
    fetch("/api/lx")
      .then((r) => r.json())
      .then(setLx)
      .catch(() => {});
  }, []);
  const catalog = [
    ...materials.map((x) => ({
      key: `material-${x.id}`,
      department: x.category.startsWith("Herrería")
        ? "Herrería y estructuras"
        : "Gran formato",
      label: `${x.category} · ${x.name}`,
      description: x.name,
      unit: x.unit,
      cost: x.purchase_cost || x.cost,
    })),
    ...rigids.map((x) => ({
      key: `rigid-${x.id}`,
      department: "Materiales rígidos",
      label: `Materiales rígidos · ${x.name}`,
      description: x.name,
      unit: "lámina",
      cost: x.sheet_cost,
    })),
    ...arlon.map((x) => ({
      key: `arlon-${x.id}`,
      department: "Corte de vinil",
      label: `Corte de vinil · Arlon ${x.series} · ${x.color_code} ${x.color_name}`,
      description: `Arlon ${x.series} · ${x.color_code} ${x.color_name}`,
      unit: "metro lineal",
      cost: x.meter_cost_061 || x.meter_cost_122 || 0,
    })),
    ...lx.map((x) => ({
      key: `lx-${x.id}`,
      department: "Corte de vinil",
      label: `Corte de vinil · ${x.brand} ${x.series} · ${x.color_code} ${x.color_name}`,
      description: `${x.brand} ${x.series} · ${x.color_code} ${x.color_name}`,
      unit: "metro lineal",
      cost: x.meter_cost_061 || x.meter_cost_122 || 0,
    })),
  ];
  const totals = (d: Draft) => {
    const subtotal = d.items.reduce((s, x) => s + x.quantity * x.unit_cost, 0),
      freight = Number(d.freight) || 0,
      tax = (subtotal + freight) * 0.16;
    return { subtotal, freight, tax, total: subtotal + freight + tax };
  };
  const save = async () => {
    if (!draft?.supplier_id || !draft.items.some((x) => x.description)) return;
    const t = totals(draft);
    await fetch(
      draft.id ? `/api/purchase-orders/${draft.id}` : "/api/purchase-orders",
      {
        method: draft.id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...draft, ...t }),
      },
    );
    setDraft(null);
    reload();
  };
  const edit = (x: PurchaseOrderRecord) =>
    setDraft({ ...x, items: JSON.parse(x.items_json || "[]") });
  return (
    <div className="business-content">
      <div className="content-head">
        <div>
          <p className="eyebrow">ABASTECIMIENTO POR PROYECTO</p>
          <h1>Órdenes de compra</h1>
          <p>
            Solicita materiales que no se manejan en inventario y relaciónalos
            con una cotización.
          </p>
        </div>
        <button className="primary" onClick={() => setDraft(empty)}>
          ＋ Nueva orden
        </button>
      </div>
      <div className="admin-table purchase-table">
        <div className="admin-row admin-header">
          <span>Folio</span>
          <span>Proveedor / proyecto</span>
          <span>Requerida</span>
          <span>Estado</span>
          <span>Total</span>
          <span></span>
        </div>
        {records.map((x) => (
          <div className="admin-row" key={x.id}>
            <strong>{x.folio}</strong>
            <span>
              {x.supplier_name}
              <small>{x.project_name || x.quote_folio || "Sin proyecto"}</small>
            </span>
            <span>{x.required_date || "Por definir"}</span>
            <em className={`status-pill ${x.status.toLowerCase()}`}>
              {x.status}
            </em>
            <strong>{money(x.total)}</strong>
            <div className="purchase-actions">
              <button onClick={() => edit(x)}>Abrir</button>
              <button onClick={() => openPurchaseOrderDocument(x)}>PDF</button>
            </div>
          </div>
        ))}
      </div>
      {records.length === 0 && (
        <div className="empty-row">Aún no hay órdenes de compra.</div>
      )}
      {draft && (
        <RecordModal
          title={draft.id ? `Editar ${draft.folio}` : "Nueva orden de compra"}
          close={() => setDraft(null)}
          save={save}
        >
          <div className="modal-grid">
            <label>
              Proveedor
              <select
                value={draft.supplier_id}
                onChange={(e) => {
                  const s = suppliers.find((x) => x.id === e.target.value);
                  setDraft({
                    ...draft,
                    supplier_id: e.target.value,
                    supplier_name: s?.name || "",
                    freight: s?.default_freight || 0,
                  });
                }}
              >
                <option value="">Seleccionar proveedor</option>
                {suppliers.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cotización relacionada
              <input
                value={draft.quote_folio || ""}
                onChange={(e) =>
                  setDraft({ ...draft, quote_folio: e.target.value })
                }
                placeholder="Ej. PTG-00128"
              />
            </label>
            <label className="wide">
              Proyecto
              <input
                value={draft.project_name || ""}
                onChange={(e) =>
                  setDraft({ ...draft, project_name: e.target.value })
                }
              />
            </label>
            <label>
              Solicitó
              <input
                value={draft.requested_by || ""}
                onChange={(e) =>
                  setDraft({ ...draft, requested_by: e.target.value })
                }
              />
            </label>
            <label>
              Fecha requerida
              <input
                type="date"
                value={draft.required_date || ""}
                onChange={(e) =>
                  setDraft({ ...draft, required_date: e.target.value })
                }
              />
            </label>
            <label>
              Estado
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
              >
                <option>Borrador</option>
                <option>Solicitada</option>
                <option>Autorizada</option>
                <option>Comprada</option>
                <option>Recibida</option>
                <option>Cancelada</option>
              </select>
            </label>
          </div>
          <div className="purchase-items">
            <div className="purchase-item-head">
              <strong>Insumos requeridos</strong>
              <button
                onClick={() =>
                  setDraft({
                    ...draft,
                    items: [
                      ...draft.items,
                      {
                        description: "",
                        quantity: 1,
                        unit: "pieza",
                        unit_cost: 0,
                      },
                    ],
                  })
                }
              >
                ＋ Agregar insumo
              </button>
            </div>
            {draft.items.map((x, i) => (
              <div className="purchase-item-row" key={i}>
                <select
                  value={x.category || "Gran formato"}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      items: draft.items.map((v, j) =>
                        j === i
                          ? {
                              ...v,
                              category: e.target.value,
                              description: "",
                              unit: "pieza",
                              unit_cost: 0,
                            }
                          : v,
                      ),
                    })
                  }
                >
                  <option>Gran formato</option>
                  <option>Materiales rígidos</option>
                  <option>Corte de vinil</option>
                  <option>Herrería y estructuras</option>
                </select>
                <select
                  value={x.description}
                  onChange={(e) => {
                    const m = catalog.find(
                      (v) =>
                        v.description === e.target.value &&
                        v.department === (x.category || "Gran formato"),
                    );
                    setDraft({
                      ...draft,
                      items: draft.items.map((v, j) =>
                        j === i
                          ? m
                            ? {
                                ...v,
                                description: m.description,
                                unit: m.unit,
                                unit_cost: m.cost,
                              }
                            : { ...v, description: e.target.value }
                          : v,
                      ),
                    });
                  }}
                >
                  <option value="">Seleccionar materia prima</option>
                  {catalog
                    .filter(
                      (m) => m.department === (x.category || "Gran formato"),
                    )
                    .map((m) => (
                      <option key={m.key} value={m.description}>
                        {m.label}
                      </option>
                    ))}
                </select>
                <input
                  type="number"
                  value={x.quantity}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      items: draft.items.map((v, j) =>
                        j === i
                          ? { ...v, quantity: Number(e.target.value) }
                          : v,
                      ),
                    })
                  }
                />
                <select
                  value={x.unit}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      items: draft.items.map((v, j) =>
                        j === i ? { ...v, unit: e.target.value } : v,
                      ),
                    })
                  }
                >
                  <option>metro lineal</option>
                  <option>m²</option>
                  <option>pieza</option>
                  <option>rollo</option>
                  <option>lámina</option>
                </select>
                <input
                  type="number"
                  value={x.unit_cost}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      items: draft.items.map((v, j) =>
                        j === i
                          ? { ...v, unit_cost: Number(e.target.value) }
                          : v,
                      ),
                    })
                  }
                  placeholder="Costo unitario"
                />
                <strong>{money(x.quantity * x.unit_cost)}</strong>
                <button
                  onClick={() =>
                    setDraft({
                      ...draft,
                      items: draft.items.filter((_, j) => j !== i),
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="purchase-total">
            <label>
              Flete
              <input
                type="number"
                value={draft.freight || 0}
                onChange={(e) =>
                  setDraft({ ...draft, freight: Number(e.target.value) })
                }
              />
            </label>
            <div>
              <span>Subtotal {money(totals(draft).subtotal)}</span>
              <span>IVA {money(totals(draft).tax)}</span>
              <strong>Total {money(totals(draft).total)}</strong>
            </div>
          </div>
        </RecordModal>
      )}
    </div>
  );
}
function SettingsView({
  organization,
  users,
  reload,
}: {
  organization: OrganizationRecord;
  users: AppUserRecord[];
  reload: () => void;
}) {
  const [org, setOrg] = useState(organization),
    [draft, setDraft] = useState<AppUserRecord | null>(null),
    empty: AppUserRecord = {
      id: "",
      name: "",
      email: "",
      role: "Ventas",
      can_sales: 1,
      can_production: 0,
      can_purchases: 0,
      can_admin: 0,
      active: 1,
      updated_at: 0,
    };
  const saveOrg = async () => {
      await fetch("/api/organization", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(org),
      });
      reload();
    },
    applyRole = (role: string, d: AppUserRecord) => ({
      ...d,
      role,
      can_sales: role === "Ventas" || role === "Administración" ? 1 : 0,
      can_production:
        role === "Producción" || role === "Administración" ? 1 : 0,
      can_purchases: role === "Compras" || role === "Administración" ? 1 : 0,
      can_admin: role === "Administración" ? 1 : 0,
    }),
    saveUser = async () => {
      if (!draft?.name || !draft.email) return;
      await fetch(draft.id ? `/api/users/${draft.id}` : "/api/users", {
        method: draft.id ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      setDraft(null);
      reload();
    };
  return (
    <div className="business-content">
      <div className="content-head">
        <div>
          <p className="eyebrow">ADMINISTRACIÓN GENERAL</p>
          <h1>Configuración</h1>
          <p>Datos de la organización y facultades internas de los usuarios.</p>
        </div>
      </div>
      <div className="settings-grid">
        <section className="dashboard-card">
          <div className="panel-title">
            <div>
              <h2>Organización</h2>
              <p>Información general, fiscal y comercial.</p>
            </div>
            <button className="primary" onClick={saveOrg}>
              Guardar datos
            </button>
          </div>
          <div className="modal-grid inline-settings">
            <label>
              Nombre comercial
              <input
                value={org.name}
                onChange={(e) => setOrg({ ...org, name: e.target.value })}
              />
            </label>
            <label>
              Razón social
              <input
                value={org.legal_name}
                onChange={(e) => setOrg({ ...org, legal_name: e.target.value })}
              />
            </label>
            <label>
              RFC
              <input
                value={org.tax_id}
                onChange={(e) =>
                  setOrg({ ...org, tax_id: e.target.value.toUpperCase() })
                }
              />
            </label>
            <label>
              Régimen fiscal
              <input
                value={org.tax_regime}
                onChange={(e) => setOrg({ ...org, tax_regime: e.target.value })}
              />
            </label>
            <label>
              Correo
              <input
                value={org.email}
                onChange={(e) => setOrg({ ...org, email: e.target.value })}
              />
            </label>
            <label>
              Teléfono
              <input
                value={org.phone}
                onChange={(e) => setOrg({ ...org, phone: e.target.value })}
              />
            </label>
            <label>
              Meta mensual
              <input
                type="number"
                value={org.monthly_goal}
                onChange={(e) =>
                  setOrg({ ...org, monthly_goal: Number(e.target.value) })
                }
              />
            </label>
            <label>
              IVA
              <input
                type="number"
                value={org.tax_rate}
                onChange={(e) =>
                  setOrg({ ...org, tax_rate: Number(e.target.value) })
                }
              />
            </label>
            <label className="wide">
              Domicilio
              <input
                value={`${org.street}${org.exterior_number ? ` ${org.exterior_number}` : ""}`}
                onChange={(e) =>
                  setOrg({
                    ...org,
                    street: e.target.value,
                    exterior_number: "",
                  })
                }
              />
            </label>
            <label>
              Municipio
              <input
                value={org.municipality}
                onChange={(e) =>
                  setOrg({ ...org, municipality: e.target.value })
                }
              />
            </label>
            <label>
              Estado
              <input
                value={org.state}
                onChange={(e) => setOrg({ ...org, state: e.target.value })}
              />
            </label>
            <label>
              Código postal
              <input
                value={org.postal_code}
                onChange={(e) =>
                  setOrg({ ...org, postal_code: e.target.value })
                }
              />
            </label>
          </div>
        </section>
        <section className="dashboard-card">
          <div className="panel-title">
            <div>
              <h2>Usuarios y facultades</h2>
              <p>
                Los permisos controlan las secciones visibles y modificables.
              </p>
            </div>
            <button className="primary" onClick={() => setDraft(empty)}>
              ＋ Nuevo usuario
            </button>
          </div>
          <div className="user-permissions-list">
            {users.map((x) => (
              <button key={x.id} onClick={() => setDraft(x)}>
                <span className="user-avatar">
                  {x.name
                    .split(" ")
                    .map((v) => v[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span>
                  <strong>{x.name}</strong>
                  <small>{x.email}</small>
                </span>
                <em>{x.role}</em>
                <i className={x.active ? "active" : "inactive"}>
                  {x.active ? "Activo" : "Inactivo"}
                </i>
              </button>
            ))}
            {users.length === 0 && (
              <div className="empty-row">
                Agrega los usuarios internos y asigna sus facultades.
              </div>
            )}
          </div>
        </section>
      </div>
      {draft && (
        <RecordModal
          title={draft.id ? "Editar usuario" : "Nuevo usuario"}
          close={() => setDraft(null)}
          save={saveUser}
        >
          <div className="modal-grid">
            <label>
              Nombre
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label>
              Correo de acceso
              <input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </label>
            <label>
              Rol principal
              <select
                value={draft.role}
                onChange={(e) => setDraft(applyRole(e.target.value, draft))}
              >
                <option>Ventas</option>
                <option>Producción</option>
                <option>Compras</option>
                <option>Administración</option>
              </select>
            </label>
            <label>
              Estado
              <select
                value={draft.active}
                onChange={(e) =>
                  setDraft({ ...draft, active: Number(e.target.value) })
                }
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </label>
          </div>
          <div className="permission-grid">
            <Check
              label="Ventas y cotizaciones"
              checked={!!draft.can_sales}
              onChange={(v) => setDraft({ ...draft, can_sales: v ? 1 : 0 })}
            />
            <Check
              label="Producción"
              checked={!!draft.can_production}
              onChange={(v) =>
                setDraft({ ...draft, can_production: v ? 1 : 0 })
              }
            />
            <Check
              label="Compras y proveedores"
              checked={!!draft.can_purchases}
              onChange={(v) => setDraft({ ...draft, can_purchases: v ? 1 : 0 })}
            />
            <Check
              label="Administración y costos"
              checked={!!draft.can_admin}
              onChange={(v) => setDraft({ ...draft, can_admin: v ? 1 : 0 })}
            />
          </div>
          <p className="access-note">
            El alta crea el perfil y sus permisos internos. La invitación de
            acceso se enviará desde el sistema de autenticación cuando
            conectemos el registro de cuentas.
          </p>
        </RecordModal>
      )}
    </div>
  );
}
function RigidQuoteConfigurator({
  catalog,
  labor,
  draft,
  setDraft,
  material,
  area,
  billableSheets,
  materialCost,
  laborCost,
  price,
  arlonCatalog,
  lxCatalog,
  vinylCost,
  operatorHours,
  assistantHours,
}: {
  catalog: RigidMaterialRecord[];
  labor: RigidLaborRecord[];
  draft: RigidQuoteDraft;
  setDraft: (value: RigidQuoteDraft) => void;
  material?: RigidMaterialRecord;
  area: number;
  billableSheets: number;
  materialCost: number;
  laborCost: number;
  price: number;
  arlonCatalog: ArlonRecord[];
  lxCatalog: LxRecord[];
  vinylCost: number;
  operatorHours: number;
  assistantHours: number;
}) {
  const operator = labor.find((x) => x.role.toLowerCase().includes("operador")),
    assistant = labor.find((x) => x.role.toLowerCase().includes("asistente"));
  const change = <K extends keyof RigidQuoteDraft>(
    key: K,
    value: RigidQuoteDraft[K],
  ) => setDraft({ ...draft, [key]: value });
  return (
    <div className="rigid-quote-config">
      <div className="rigid-quote-grid">
        <label className="wide">
          Material rígido
          <select
            value={draft.materialId}
            onChange={(e) => {
              const item = catalog.find((x) => x.id === e.target.value);
              setDraft({
                ...draft,
                materialId: e.target.value,
                cutProcess: item?.default_cut || draft.cutProcess,
              });
            }}
          >
            <option value="">Seleccionar lámina del catálogo</option>
            {catalog.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name} · {x.thickness} · {x.stock_status}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ancho de pieza (m)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={draft.width}
            onChange={(e) => change("width", Number(e.target.value))}
          />
        </label>
        <label>
          Alto de pieza (m)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={draft.height}
            onChange={(e) => change("height", Number(e.target.value))}
          />
        </label>
        <label>
          Cantidad
          <input
            type="number"
            min="1"
            step="1"
            value={draft.quantity}
            onChange={(e) =>
              change("quantity", Math.max(1, Math.ceil(Number(e.target.value))))
            }
          />
        </label>
        <label>
          Proceso de corte
          <select
            value={draft.cutProcess}
            onChange={(e) => change("cutProcess", e.target.value)}
          >
            <option value="">Seleccionar proceso</option>
            <option>Corte láser</option>
            <option>Router CNC</option>
            <option>Corte manual / sierra</option>
            <option>Sin corte</option>
          </select>
        </label>
        <label className="wide">
          Describir el proyecto
          <input
            value={draft.description}
            onChange={(e) => change("description", e.target.value)}
            placeholder="Describir el proyecto"
          />
        </label>
        <label>
          Complemento gráfico
          <select
            value={draft.graphic}
            onChange={(e) =>
              setDraft({
                ...draft,
                graphic: e.target.value as RigidQuoteDraft["graphic"],
                vinylProductId: "",
                vinylCost: 0,
                cutCatalog: "",
                laminationId: "",
              })
            }
          >
            <option value="none">Sin vinil</option>
            <option value="printed">Vinil impreso</option>
            <option value="cut">Vinil de recorte</option>
          </select>
        </label>
        {draft.graphic === "cut" && (
          <label>
            Marca / catálogo
            <select
              value={draft.cutCatalog || ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cutCatalog: e.target.value as RigidQuoteDraft["cutCatalog"],
                  vinylProductId: "",
                  vinylCost: 0,
                })
              }
            >
              <option value="">Seleccionar marca</option>
              <option value="arlon">Arlon</option>
              <option value="lx">LX Hausys / DM Lite</option>
            </select>
            <small>Elige primero la marca para consultar sus códigos.</small>
          </label>
        )}
        <label className={draft.graphic === "cut" ? "wide" : ""}>
          {draft.graphic === "cut" ? "Marca y código de vinil" : "Tipo de vinil"}
          <select
            value={draft.vinylProductId}
            disabled={
              draft.graphic === "none" ||
              (draft.graphic === "cut" && !draft.cutCatalog)
            }
            onChange={(e) =>
              setDraft({
                ...draft,
                vinylProductId: e.target.value,
                vinylCost: 0,
              })
            }
          >
            <option value="">Seleccionar vinil</option>
            {draft.graphic === "printed" &&
              products
                .filter(
                  (item) =>
                    item.mode === "area" &&
                    item.id !== "lona" &&
                    item.id !== "recorte",
                )
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            {draft.graphic === "cut" &&
              draft.cutCatalog === "arlon" &&
              arlonCatalog
                .filter((item) => item.active)
                .map((item) => (
                  <option key={item.id} value={`arlon:${item.id}`}>
                    Arlon {item.series} · {item.color_code} · {item.color_name}
                  </option>
                ))}
            {draft.graphic === "cut" &&
              draft.cutCatalog === "lx" &&
              lxCatalog
                .filter((item) => item.active)
                .map((item) => (
                  <option key={item.id} value={`lx:${item.id}`}>
                    {item.brand} {item.series} · {item.color_code} ·{" "}
                    {item.color_name}
                  </option>
                ))}
          </select>
          <small>
            {draft.graphic === "none"
              ? "Selecciona primero el complemento gráfico."
              : draft.graphic === "printed"
                ? "Catálogo de viniles imprimibles de Gran Formato."
                : "Catálogo real de viniles de corte por marca y código."}
          </small>
        </label>
        {draft.graphic === "printed" && (
          <label>
            Laminado
            <select
              value={draft.laminationId || ""}
              onChange={(e) =>
                change(
                  "laminationId",
                  e.target.value as RigidQuoteDraft["laminationId"],
                )
              }
            >
              <option value="">Sin laminado</option>
              <option value="transparente-mate">
                Transparente económico mate
              </option>
              <option value="transparente-brillante">
                Transparente económico brillante
              </option>
              <option value="arlon-3510">
                Arlon 3510 transparente mate
              </option>
            </select>
            <small>
              El material y el tiempo de aplicación se agregan automáticamente.
            </small>
          </label>
        )}
        <label>
          Complejidad estimada
          <select
            value={draft.workComplexity || "standard"}
            onChange={(e) =>
              change(
                "workComplexity",
                e.target.value as RigidQuoteDraft["workComplexity"],
              )
            }
          >
            <option value="simple">Simple</option>
            <option value="standard">Estándar</option>
            <option value="complex">Compleja</option>
          </select>
          <small>Ajusta automáticamente los tiempos de producción.</small>
        </label>
        <label>
          Costo calculado del vinil
          <input type="number" value={vinylCost.toFixed(2)} readOnly />
          <small>
            Incluye material, impresión o rendimiento del rollo seleccionado.
          </small>
        </label>
        <label>
          Horas operador
          <input type="number" value={operatorHours} readOnly />
          <small>
            Cálculo automático ·{" "}
            {operator
              ? `${money(operator.productive_hour_cost)}/h productiva`
              : "Costo laboral pendiente"}
          </small>
        </label>
        <label>
          Horas asistente
          <input type="number" value={assistantHours} readOnly />
          <small>
            Cálculo automático ·{" "}
            {assistant
              ? `${money(assistant.productive_hour_cost)}/h productiva`
              : "Costo laboral pendiente"}
          </small>
        </label>
      </div>
      <div className="rigid-process-options">
        <label>
          <input
            type="checkbox"
            checked={draft.mounting}
            onChange={(e) => change("mounting", e.target.checked)}
          />{" "}
          Pegado de vinil
        </label>
        <label>
          <input
            type="checkbox"
            checked={draft.weeding}
            onChange={(e) => change("weeding", e.target.checked)}
          />{" "}
          Depilado
        </label>
      </div>
      {material ? (
        <div className="rigid-quote-summary">
          <div>
            <span>Lámina seleccionada</span>
            <strong>{material.name}</strong>
            <small>
              {material.width.toFixed(2)} × {material.length.toFixed(2)} m ·{" "}
              {material.default_cut}
            </small>
          </div>
          <div>
            <span>Área requerida</span>
            <strong>{area.toFixed(2)} m²</strong>
            <small>{billableSheets} lámina(s) facturable(s)</small>
          </div>
          <div>
            <span>Costo base</span>
            <strong>{money(materialCost + laborCost + vinylCost)}</strong>
            <small>
              Material {money(materialCost)} · Mano de obra {money(laborCost)}
            </small>
          </div>
          <div>
            <span>Precio antes de IVA</span>
            <strong>{money(price)}</strong>
            <small>
              Margen aplicado:{" "}
              {price
                ? Math.round(
                    (1 - (materialCost + laborCost + vinylCost) / price) *
                      100,
                  )
                : 0}
              %
            </small>
          </div>
        </div>
      ) : (
        <div className="empty compact-empty">
          <h3>Selecciona un material rígido</h3>
          <p>
            El sistema calculará el aprovechamiento por fracción o lámina
            completa según el catálogo.
          </p>
        </div>
      )}
    </div>
  );
}
function RigidMaterialsView({
  records,
  labor,
  onBack,
  reload,
}: {
  records: RigidMaterialRecord[];
  labor: RigidLaborRecord[];
  onBack?: () => void;
  reload?: () => void;
}) {
  const [category, setCategory] = useState("Todos"),
    [search, setSearch] = useState(""),
    [draft, setDraft] = useState<RigidMaterialRecord | null>(null);
  const categories = ["Todos", ...new Set(records.map((x) => x.category))],
    filtered = records.filter(
      (x) =>
        (category === "Todos" || x.category === category) &&
        `${x.name} ${x.sku} ${x.thickness} ${x.supplier}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
  const combined = labor.reduce((s, x) => s + x.productive_hour_cost, 0),
    monthly = labor.reduce((s, x) => s + x.loaded_monthly, 0);
  const save = async () => {
    if (!draft) return;
    await fetch(`/api/rigid-materials/${draft.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft(null);
    reload?.();
  };
  return (
    <div className="business-content rigid-module">
      <div className="content-head">
        <div>
          <p className="eyebrow">MATERIAS PRIMAS · LÁMINAS</p>
          <h1>Materiales rígidos</h1>
          <p>
            Láminas, costos normalizados, reglas de aprovechamiento y procesos
            de corte.
          </p>
        </div>
        <div className="catalog-head-actions">
          {onBack && (
            <button className="ghost" onClick={onBack}>
              ← Materias primas
            </button>
          )}
          <span className="phase-chip">{records.length} INSUMOS</span>
        </div>
      </div>
      <div className="rigid-kpis">
        <div>
          <span>Materiales cargados</span>
          <strong>{records.length}</strong>
          <small>Lámina estándar 1.22 × 2.44 m</small>
        </div>
        <div>
          <span>Costo laboral del área</span>
          <strong>{money(monthly)}/mes</strong>
          <small>Sueldos + carga patronal estimada</small>
        </div>
        <div>
          <span>Hora productiva combinada</span>
          <strong>{money(combined)}/h</strong>
          <small>Operador + asistente cuando participan juntos</small>
        </div>
        <div>
          <span>Mínimo facturable</span>
          <strong>¼ lámina</strong>
          <small>Especiales: lámina completa</small>
        </div>
      </div>
      <section className="rigid-labor-panel">
        <div className="panel-title">
          <div>
            <h2>Personal asignado al módulo</h2>
            <p>
              Supuesto inicial: sueldos mensuales brutos, 34% de carga patronal
              y 85% de utilización productiva.
            </p>
          </div>
        </div>
        <div className="rigid-labor-grid">
          {labor.map((x) => (
            <div key={x.id}>
              <span>{x.role}</span>
              <strong>{money(x.monthly_salary)} salario</strong>
              <small>Costo empresa: {money(x.loaded_monthly)}/mes</small>
              <b>{money(x.productive_hour_cost)} por hora productiva</b>
            </div>
          ))}
        </div>
        <p className="labor-note">
          La carga incluye provisión de aguinaldo y prima vacacional, seguridad
          social, retiro, Infonavit e impuesto estatal sobre nómina. Se dejará
          editable cuando confirmemos antigüedad, prima de riesgo y si los
          sueldos son netos.
        </p>
      </section>
      <div className="list-toolbar rigid-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar material, espesor, proveedor o SKU"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <span>{filtered.length} materiales</span>
      </div>
      <div className="rigid-table">
        <div className="rigid-row rigid-header">
          <span>Material</span>
          <span>Lámina</span>
          <span>Costo compra</span>
          <span>Costo m²</span>
          <span>Regla mínima</span>
          <span>Corte sugerido</span>
          <span>Estado</span>
          <span></span>
        </div>
        {filtered.map((x) => (
          <div className="rigid-row" key={x.id}>
            <span>
              <strong>{x.name}</strong>
              <small>
                {x.sku} · {x.category} · {x.thickness}
              </small>
            </span>
            <span>
              {x.width.toFixed(2)} × {x.length.toFixed(2)} m
              <small>{(x.width * x.length).toFixed(2)} m²</small>
            </span>
            <strong>{money(x.sheet_cost)}</strong>
            <strong>{money(x.cost_m2)}</strong>
            <span>
              {x.special_full_sheet ? "Lámina completa" : "¼ de lámina"}
              <small>
                {x.special_full_sheet
                  ? "Acabado especial"
                  : "Sobrante reutilizable"}
              </small>
            </span>
            <span>{x.default_cut}</span>
            <em>{x.stock_status}</em>
            <button onClick={() => setDraft({ ...x })}>Editar</button>
          </div>
        ))}
      </div>
      {draft && (
        <RecordModal
          title={`Editar ${draft.name}`}
          close={() => setDraft(null)}
          save={save}
        >
          <div className="modal-grid">
            <label>
              Código
              <input
                value={draft.sku}
                onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
              />
            </label>
            <label className="wide">
              Material
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label>
              Categoría
              <input
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
              />
            </label>
            <label>
              Espesor
              <input
                value={draft.thickness}
                onChange={(e) =>
                  setDraft({ ...draft, thickness: e.target.value })
                }
              />
            </label>
            <label>
              Ancho de lámina (m)
              <input
                type="number"
                min=".01"
                step=".01"
                value={draft.width}
                onChange={(e) =>
                  setDraft({ ...draft, width: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Largo de lámina (m)
              <input
                type="number"
                min=".01"
                step=".01"
                value={draft.length}
                onChange={(e) =>
                  setDraft({ ...draft, length: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Costo de compra por lámina
              <input
                type="number"
                min="0"
                step=".01"
                value={draft.sheet_cost}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    sheet_cost: Number(e.target.value),
                    cost_m2:
                      Number(e.target.value) /
                      Math.max(0.0001, draft.width * draft.length),
                  })
                }
              />
            </label>
            <label>
              Proveedor
              <input
                value={draft.supplier}
                onChange={(e) =>
                  setDraft({ ...draft, supplier: e.target.value })
                }
              />
            </label>
            <label>
              Fracción mínima
              <select
                value={
                  draft.special_full_sheet
                    ? "1"
                    : String(draft.minimum_fraction)
                }
                onChange={(e) =>
                  e.target.value === "1"
                    ? setDraft({
                        ...draft,
                        special_full_sheet: 1,
                        minimum_fraction: 1,
                      })
                    : setDraft({
                        ...draft,
                        special_full_sheet: 0,
                        minimum_fraction: Number(e.target.value),
                      })
                }
              >
                <option value=".25">¼ de lámina</option>
                <option value=".5">½ lámina</option>
                <option value="1">Lámina completa</option>
              </select>
            </label>
            <label>
              Corte sugerido
              <select
                value={draft.default_cut}
                onChange={(e) =>
                  setDraft({ ...draft, default_cut: e.target.value })
                }
              >
                <option>Corte láser</option>
                <option>Router CNC</option>
                <option>Láser / Router CNC</option>
                <option>Corte manual / Router CNC</option>
                <option>Sin corte</option>
              </select>
            </label>
            <label className="wide">
              Disponibilidad
              <select
                value={draft.stock_status}
                onChange={(e) =>
                  setDraft({ ...draft, stock_status: e.target.value })
                }
              >
                <option>Disponible</option>
                <option>Costo pendiente</option>
                <option>Sobre pedido</option>
                <option>No disponible</option>
              </select>
            </label>
            <div className="wide normalized-cost-preview">
              <span>
                Costo para cotizar:{" "}
                <strong>
                  {money(
                    draft.sheet_cost /
                      Math.max(0.0001, draft.width * draft.length),
                  )}{" "}
                  por m²
                </strong>
              </span>
              <span>
                Presentación:{" "}
                <strong>
                  {draft.width.toFixed(2)} × {draft.length.toFixed(2)} m
                </strong>
              </span>
              <small>
                El costo por m² se recalcula automáticamente al guardar.
              </small>
            </div>
          </div>
        </RecordModal>
      )}
    </div>
  );
}
function MaterialsView({
  records,
  reload,
}: {
  records: MaterialRecord[];
  reload: () => void;
}) {
  const empty: MaterialRecord = {
      id: "",
      code: "",
      name: "",
      category: "Sustrato",
      unit: "m²",
      cost: 0,
      supplier: "",
      purchase_unit: "rollo",
      purchase_cost: 0,
      freight: 0,
      width: 0,
      length: 0,
      package_quantity: 1,
      updated_at: 0,
    },
    [draft, setDraft] = useState<MaterialRecord | null>(null),
    [rigidDraft, setRigidDraft] = useState<RigidMaterialRecord | null>(null),
    [cutDraft, setCutDraft] = useState<any>(null),
    [search, setSearch] = useState(""),
    [special, setSpecial] = useState<"" | "arlon" | "lx">(""),
    [rigidRecords, setRigidRecords] = useState<RigidMaterialRecord[]>([]),
    [rigidLabor, setRigidLabor] = useState<RigidLaborRecord[]>([]),
    [arlonRecords, setArlonRecords] = useState<ArlonRecord[]>([]),
    [lxRecords, setLxRecords] = useState<LxRecord[]>([]),
    [collapsedCatalog, setCollapsedCatalog] = useState<string[]>([]);
  const loadRigid = () =>
      Promise.all([
        fetch("/api/rigid-materials")
          .then((r) => r.json())
          .then(setRigidRecords),
        fetch("/api/rigid-labor")
          .then((r) => r.json())
          .then(setRigidLabor),
      ]),
    loadCut = () =>
      Promise.all([
        fetch("/api/arlon")
          .then((r) => r.json())
          .then(setArlonRecords),
        fetch("/api/lx")
          .then((r) => r.json())
          .then(setLxRecords),
      ]);
  useEffect(() => {
    loadRigid();
    loadCut();
  }, []);
  const normalizedCost = (x: MaterialRecord) => {
      const total = (Number(x.purchase_cost) || 0) + (Number(x.freight) || 0),
        qty = Math.max(0.0001, Number(x.package_quantity) || 1);
      if (x.unit === "m²" && x.width > 0 && x.length > 0)
        return total / (x.width * x.length * qty);
      if ((x.unit === "metro lineal" || x.unit === "ml") && x.length > 0)
        return total / (x.length * qty);
      return total / qty;
    },
    yieldText = (x: MaterialRecord) =>
      x.unit === "m²" && x.width > 0 && x.length > 0
        ? `${(x.width * x.length * Math.max(1, x.package_quantity || 1)).toFixed(2)} m²`
        : x.unit === "metro lineal" && x.length > 0
          ? `${(x.length * Math.max(1, x.package_quantity || 1)).toFixed(2)} ml`
          : `${Math.max(1, x.package_quantity || 1)} ${x.unit}`;
  const editMaterial = (x: MaterialRecord) =>
    setDraft({
      ...x,
      purchase_unit: x.purchase_unit || "unidad",
      purchase_cost: x.purchase_cost || x.cost,
      freight: x.freight || 0,
      width: x.width || 0,
      length: x.length || 0,
      package_quantity: x.package_quantity || 1,
    });
  const save = async () => {
    if (!draft?.name) return;
    await fetch(draft.id ? `/api/materials/${draft.id}` : "/api/materials", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft(null);
    reload();
  };
  const saveRigid = async () => {
      if (!rigidDraft) return;
      await fetch(`/api/rigid-materials/${rigidDraft.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(rigidDraft),
      });
      setRigidDraft(null);
      loadRigid();
    },
    saveCut = async () => {
      if (!cutDraft) return;
      await fetch(`/api/${cutDraft.source}/${cutDraft.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(cutDraft),
      });
      setCutDraft(null);
      loadCut();
    };
  const catalogRows = [
      ...records.map((x) => ({
        kind: "general" as const,
        id: x.id,
        code: x.code,
        name: x.name,
        category: x.category,
        presentation: x.purchase_unit || "unidad",
        yield: yieldText(x),
        purchaseCost: x.purchase_cost,
        cost: x.cost,
        unit: x.unit,
        supplier: x.supplier,
        raw: x,
      })),
      ...[
        ...arlonRecords.map((x) => ({
          kind: "cut" as const,
          id: x.id,
          code: x.color_code,
          name: `Arlon ${x.series} · ${x.color_name}`,
          category: "Corte de vinil · Arlon",
          presentation: "metro lineal",
          yield: `0.61 / 1.22 m · ${x.finish}`,
          purchaseCost: x.meter_cost_061 || x.meter_cost_122 || 0,
          cost: x.meter_cost_061 || x.meter_cost_122 || 0,
          unit: "ml",
          supplier: x.supplier,
          raw: { ...x, source: "arlon" },
        })),
        ...lxRecords.map((x) => ({
          kind: "cut" as const,
          id: x.id,
          code: x.color_code,
          name: `${x.brand} ${x.series} · ${x.color_name}`,
          category: `Corte de vinil · ${x.brand}`,
          presentation: "metro lineal",
          yield: `0.61 / 1.22 m · ${x.finish}`,
          purchaseCost: x.meter_cost_061 || x.meter_cost_122 || 0,
          cost: x.meter_cost_061 || x.meter_cost_122 || 0,
          unit: "ml",
          supplier: x.supplier,
          raw: { ...x, source: "lx" },
        })),
      ].map((x) => x),
      ...rigidRecords.map((x) => ({
        kind: "rigid" as const,
        id: x.id,
        code: x.sku,
        name: x.name,
        category: `Materiales rígidos · ${x.category}`,
        presentation: "lámina",
        yield: `${Number(x.width).toFixed(2)} × ${Number(x.length).toFixed(2)} m · ${x.thickness}`,
        purchaseCost: x.sheet_cost,
        cost: x.cost_m2,
        unit: "m²",
        supplier: x.supplier,
        average: x.historical_avg_cost,
        updates: x.historical_updates,
        raw: x,
      })),
    ],
    filtered = catalogRows.filter((x) =>
      `${x.code} ${x.name} ${x.category} ${x.supplier}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
    generalRows = filtered.filter(
      (x) => x.kind === "general" && !x.category.startsWith("Herrería"),
    ),
    steelRows = filtered.filter(
      (x) => x.kind === "general" && x.category.startsWith("Herrería"),
    ),
    rigidRows = filtered.filter((x) => x.kind === "rigid"),
    cutRows = filtered.filter((x) => x.kind === "cut"),
    rigidCategoryGroups = Object.values(
      rigidRows.reduce(
        (groups: any, row: any) => {
          const names: Record<string, string> = {
              "PVC espumado": "Láminas de PVC",
              Acrílico: "Láminas de Acrílico",
              Aluminio: "Láminas de Aluminio",
              "Panel de aluminio": "Láminas de Panel de Aluminio",
              Coroplast: "Láminas de Coroplast",
            },
            label = names[row.raw.category] || `Láminas de ${row.raw.category}`,
            id = `rigid-category-${row.raw.category}`;
          (groups[id] ??= { id, label, items: [] }).items.push(row);
          return groups;
        },
        {} as Record<string, { id: string; label: string; items: any[] }>,
      ),
    ).sort((a: any, b: any) => a.label.localeCompare(b.label)),
    cutSeriesGroups = Object.values(
      cutRows.reduce(
        (groups: any, row: any) => {
          const brand =
              row.raw.source === "arlon"
                ? "Arlon"
                : row.raw.brand || "LX Hausys",
            label =
              row.raw.source === "arlon"
                ? `Arlon serie ${row.raw.series}`
                : `${brand} ${row.raw.series}`,
            id = `cut-series-${row.raw.source}-${brand}-${row.raw.series}`;
          (groups[id] ??= { id, label, items: [] }).items.push(row);
          return groups;
        },
        {} as Record<string, { id: string; label: string; items: any[] }>,
      ),
    ).sort((a: any, b: any) => a.label.localeCompare(b.label)),
    toggleGroup = (id: string) =>
      setCollapsedCatalog((current) =>
        current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id],
      ),
    tableRow = (x: any) => (
      <div className="admin-row" key={`${x.kind}-${x.id}`}>
        <strong>{x.code}</strong>
        <span>{x.name}</span>
        <span>{x.category}</span>
        <span>
          {x.presentation}
          <small className="material-yield">{x.yield}</small>
        </span>
        <strong>
          {money(x.purchaseCost)}
          <small className="material-yield">por {x.presentation}</small>
        </strong>
        <strong>
          {money(x.cost)}
          <small className="material-yield">por {x.unit}</small>
        </strong>
        <span>
          {x.supplier || "—"}
          <small className="material-yield">
            Promedio histórico:{" "}
            {x.average
              ? money(x.average)
              : x.kind === "general" && x.raw.historical_avg_cost
                ? money(x.raw.historical_avg_cost)
                : "se formará con las actualizaciones"}
          </small>
        </span>
        <button
          onClick={() =>
            x.kind === "rigid"
              ? setRigidDraft({ ...x.raw })
              : x.kind === "cut"
                ? setCutDraft({ ...x.raw })
                : editMaterial(x.raw)
          }
        >
          Editar
        </button>
      </div>
    );
  if (special === "arlon")
    return <ArlonCatalogManager onBack={() => setSpecial("")} />;
  if (special === "lx")
    return <LxCatalogManager onBack={() => setSpecial("")} />;
  return (
    <div className="business-content">
      <div className="content-head">
        <div>
          <p className="eyebrow">CATÁLOGO DE COSTOS</p>
          <h1>Materias primas</h1>
          <p>
            Captura la presentación de compra y el sistema convierte
            automáticamente el costo a m², metro lineal o pieza.
          </p>
        </div>
        <div className="catalog-head-actions">
          <button className="primary" onClick={() => setDraft(empty)}>
            ＋ Nuevo insumo
          </button>
        </div>
      </div>
      <div className="list-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por código, nombre o categoría"
        />
        <span>{filtered.length} registros</span>
      </div>
      {(
        [
          ["general", "Gran formato", generalRows],
          ["steel", "Herrería y estructuras", steelRows],
        ] as const
      ).map(([group, title, items]) => {
        const collapsed = collapsedCatalog.includes(group);
        return (
          <section
            className={
              collapsed
                ? "material-catalog-group collapsed"
                : "material-catalog-group"
            }
            key={group}
          >
            <button
              className="material-catalog-toggle"
              onClick={() => toggleGroup(group)}
            >
              <span>{collapsed ? "⌄" : "⌃"}</span>
              <strong>{title}</strong>
              <small>
                {items.length} {items.length === 1 ? "insumo" : "insumos"}
              </small>
              <em>{collapsed ? "Maximizar" : "Minimizar"}</em>
            </button>
            {!collapsed && (
              <div className="admin-table materials-table">
                <div className="admin-row admin-header">
                  <span>Código</span>
                  <span>Materia prima</span>
                  <span>Categoría</span>
                  <span>Presentación</span>
                  <span>Costo de compra</span>
                  <span>Costo para cotizar</span>
                  <span>Proveedor</span>
                  <span></span>
                </div>
                {items.map(tableRow)}
                {items.length === 0 && (
                  <div className="empty-row">
                    No hay insumos que coincidan con la búsqueda.
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}
      <section
        className={
          collapsedCatalog.includes("rigid")
            ? "material-catalog-group collapsed"
            : "material-catalog-group"
        }
      >
        <button
          className="material-catalog-toggle"
          onClick={() => toggleGroup("rigid")}
        >
          <span>{collapsedCatalog.includes("rigid") ? "⌄" : "⌃"}</span>
          <strong>Materiales rígidos</strong>
          <small>
            {rigidRows.length} {rigidRows.length === 1 ? "lámina" : "láminas"}
          </small>
          <em>
            {collapsedCatalog.includes("rigid") ? "Maximizar" : "Minimizar"}
          </em>
        </button>
        {!collapsedCatalog.includes("rigid") && (
          <div className="cut-series-list">
            {rigidCategoryGroups.map((family: any) => {
              const collapsed = collapsedCatalog.includes(family.id);
              return (
                <section className="cut-series-group" key={family.id}>
                  <button
                    className="cut-series-toggle"
                    onClick={() => toggleGroup(family.id)}
                  >
                    <span>{collapsed ? "⌄" : "⌃"}</span>
                    <strong>{family.label}</strong>
                    <small>
                      {family.items.length}{" "}
                      {family.items.length === 1 ? "lámina" : "láminas"}
                    </small>
                    <em>{collapsed ? "Mostrar" : "Ocultar"}</em>
                  </button>
                  {!collapsed && (
                    <div className="admin-table materials-table">
                      <div className="admin-row admin-header">
                        <span>Código</span>
                        <span>Materia prima</span>
                        <span>Categoría</span>
                        <span>Presentación</span>
                        <span>Costo de compra</span>
                        <span>Costo para cotizar</span>
                        <span>Proveedor</span>
                        <span></span>
                      </div>
                      {family.items.map(tableRow)}
                    </div>
                  )}
                </section>
              );
            })}
            {rigidCategoryGroups.length === 0 && (
              <div className="empty-row">
                No hay insumos que coincidan con la búsqueda.
              </div>
            )}
          </div>
        )}
      </section>
      <section
        className={
          collapsedCatalog.includes("cut")
            ? "material-catalog-group collapsed"
            : "material-catalog-group"
        }
      >
        <button
          className="material-catalog-toggle"
          onClick={() => toggleGroup("cut")}
        >
          <span>{collapsedCatalog.includes("cut") ? "⌄" : "⌃"}</span>
          <strong>Corte de vinil</strong>
          <small>
            {cutRows.length}{" "}
            {cutRows.length === 1 ? "referencia" : "referencias"}
          </small>
          <em>
            {collapsedCatalog.includes("cut") ? "Maximizar" : "Minimizar"}
          </em>
        </button>
        {!collapsedCatalog.includes("cut") && (
          <div className="cut-series-list">
            {cutSeriesGroups.map((series: any) => {
              const collapsed = collapsedCatalog.includes(series.id);
              return (
                <section className="cut-series-group" key={series.id}>
                  <button
                    className="cut-series-toggle"
                    onClick={() => toggleGroup(series.id)}
                  >
                    <span>{collapsed ? "⌄" : "⌃"}</span>
                    <strong>{series.label}</strong>
                    <small>
                      {series.items.length}{" "}
                      {series.items.length === 1 ? "color" : "colores"}
                    </small>
                    <em>{collapsed ? "Mostrar" : "Ocultar"}</em>
                  </button>
                  {!collapsed && (
                    <div className="admin-table materials-table">
                      <div className="admin-row admin-header">
                        <span>Código</span>
                        <span>Materia prima</span>
                        <span>Categoría</span>
                        <span>Presentación</span>
                        <span>Costo de compra</span>
                        <span>Costo para cotizar</span>
                        <span>Proveedor</span>
                        <span></span>
                      </div>
                      {series.items.map(tableRow)}
                    </div>
                  )}
                </section>
              );
            })}
            {cutSeriesGroups.length === 0 && (
              <div className="empty-row">
                No hay insumos que coincidan con la búsqueda.
              </div>
            )}
          </div>
        )}
      </section>
      {cutDraft && (
        <RecordModal
          title="Editar vinil de recorte"
          close={() => setCutDraft(null)}
          save={saveCut}
        >
          <div className="modal-grid">
            <label>
              Marca
              <input
                value={cutDraft.source === "arlon" ? "Arlon" : cutDraft.brand}
                disabled
              />
            </label>
            <label>
              Serie
              <input value={cutDraft.series} disabled />
            </label>
            <label>
              Código de color
              <input value={cutDraft.color_code} disabled />
            </label>
            <label>
              Color
              <input value={cutDraft.color_name} disabled />
            </label>
            <label>
              Precio por metro · 0.61 m
              <div className="currency-field">
                <span>$</span>
                <input
                  className="currency-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cutDraft.meter_cost_061}
                  onChange={(e) =>
                    setCutDraft({
                      ...cutDraft,
                      meter_cost_061: Number(e.target.value),
                    })
                  }
                />
              </div>
            </label>
            <label>
              Precio por metro · 1.22 m
              <div className="currency-field">
                <span>$</span>
                <input
                  className="currency-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={cutDraft.meter_cost_122}
                  onChange={(e) =>
                    setCutDraft({
                      ...cutDraft,
                      meter_cost_122: Number(e.target.value),
                    })
                  }
                />
              </div>
            </label>
            <label>
              Proveedor
              <input
                value={cutDraft.supplier}
                onChange={(e) =>
                  setCutDraft({ ...cutDraft, supplier: e.target.value })
                }
              />
            </label>
            <label>
              Disponibilidad
              <select
                value={cutDraft.stock_status}
                onChange={(e) =>
                  setCutDraft({ ...cutDraft, stock_status: e.target.value })
                }
              >
                <option>Disponible con proveedor</option>
                <option>Disponible localmente</option>
                <option>Disponible en Guadalajara</option>
                <option>Costo pendiente</option>
                <option>Sobre pedido</option>
                <option>No disponible</option>
              </select>
            </label>
            <div className="wide normalized-cost-preview">
              <span>
                Se cotiza por: <strong>metro lineal</strong>
              </span>
              <span>
                Decimales habilitados: <strong>$0.00</strong>
              </span>
              <small>
                El costo actualizado estará disponible de inmediato al cotizar
                vinil de recorte.
              </small>
            </div>
          </div>
        </RecordModal>
      )}
      {rigidDraft && (
        <RecordModal
          title={`Editar ${rigidDraft.name}`}
          close={() => setRigidDraft(null)}
          save={saveRigid}
        >
          <div className="modal-grid">
            <label>
              Código
              <input
                value={rigidDraft.sku}
                onChange={(e) =>
                  setRigidDraft({ ...rigidDraft, sku: e.target.value })
                }
              />
            </label>
            <label className="wide">
              Material
              <input
                value={rigidDraft.name}
                onChange={(e) =>
                  setRigidDraft({ ...rigidDraft, name: e.target.value })
                }
              />
            </label>
            <label>
              Categoría
              <input
                value={rigidDraft.category}
                onChange={(e) =>
                  setRigidDraft({ ...rigidDraft, category: e.target.value })
                }
              />
            </label>
            <label>
              Espesor
              <input
                value={rigidDraft.thickness}
                onChange={(e) =>
                  setRigidDraft({ ...rigidDraft, thickness: e.target.value })
                }
              />
            </label>
            <label>
              Ancho de lámina (m)
              <input
                type="number"
                min=".01"
                step=".01"
                value={rigidDraft.width}
                onChange={(e) =>
                  setRigidDraft({
                    ...rigidDraft,
                    width: Number(e.target.value),
                  })
                }
              />
            </label>
            <label>
              Largo de lámina (m)
              <input
                type="number"
                min=".01"
                step=".01"
                value={rigidDraft.length}
                onChange={(e) =>
                  setRigidDraft({
                    ...rigidDraft,
                    length: Number(e.target.value),
                  })
                }
              />
            </label>
            <label>
              Costo de compra por lámina
              <div className="currency-field">
                <span>$</span>
                <input
                  className="currency-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={rigidDraft.sheet_cost}
                  onChange={(e) =>
                    setRigidDraft({
                      ...rigidDraft,
                      sheet_cost: Number(e.target.value),
                      cost_m2:
                        Number(e.target.value) /
                        Math.max(0.0001, rigidDraft.width * rigidDraft.length),
                    })
                  }
                />
              </div>
            </label>
            <label>
              Proveedor
              <input
                value={rigidDraft.supplier}
                onChange={(e) =>
                  setRigidDraft({ ...rigidDraft, supplier: e.target.value })
                }
              />
            </label>
            <label>
              Fracción mínima
              <select
                value={
                  rigidDraft.special_full_sheet
                    ? "1"
                    : String(rigidDraft.minimum_fraction)
                }
                onChange={(e) =>
                  e.target.value === "1"
                    ? setRigidDraft({
                        ...rigidDraft,
                        special_full_sheet: 1,
                        minimum_fraction: 1,
                      })
                    : setRigidDraft({
                        ...rigidDraft,
                        special_full_sheet: 0,
                        minimum_fraction: Number(e.target.value),
                      })
                }
              >
                <option value=".25">¼ de lámina</option>
                <option value=".5">½ lámina</option>
                <option value="1">Lámina completa</option>
              </select>
            </label>
            <label>
              Corte sugerido
              <select
                value={rigidDraft.default_cut}
                onChange={(e) =>
                  setRigidDraft({ ...rigidDraft, default_cut: e.target.value })
                }
              >
                <option>Corte láser</option>
                <option>Router CNC</option>
                <option>Láser / Router CNC</option>
                <option>Corte manual / Router CNC</option>
                <option>Sin corte</option>
              </select>
            </label>
            <label className="wide">
              Disponibilidad
              <select
                value={rigidDraft.stock_status}
                onChange={(e) =>
                  setRigidDraft({ ...rigidDraft, stock_status: e.target.value })
                }
              >
                <option>Disponible</option>
                <option>Costo pendiente</option>
                <option>Sobre pedido</option>
                <option>No disponible</option>
              </select>
            </label>
            <div className="wide normalized-cost-preview">
              <span>
                Costo para cotizar:{" "}
                <strong>
                  {money(
                    rigidDraft.sheet_cost /
                      Math.max(0.0001, rigidDraft.width * rigidDraft.length),
                  )}{" "}
                  por m²
                </strong>
              </span>
              <span>
                Promedio histórico:{" "}
                <strong>
                  {rigidDraft.historical_avg_cost
                    ? money(rigidDraft.historical_avg_cost)
                    : "se calcula desde el primer cambio"}
                </strong>
              </span>
              <small>
                Al guardar, se registra esta actualización y las cotizaciones
                nuevas tomarán el costo actualizado.
              </small>
            </div>
          </div>
        </RecordModal>
      )}
      {draft && (
        <RecordModal
          title={draft.id ? "Editar materia prima" : "Nueva materia prima"}
          close={() => setDraft(null)}
          save={save}
        >
          <div className="modal-grid">
            <label>
              Código
              <input
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value })}
              />
            </label>
            <label className="wide">
              Nombre
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label>
              Categoría
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
              >
                <option>Sustrato</option>
                <option>Tinta / equipo</option>
                <option>Acabado</option>
                <option>Consumible</option>
                <option>Herrería · Tubular</option>
                <option>Herrería · Soldadura</option>
                <option>Herrería · Consumible</option>
              </select>
            </label>
            <label>
              Unidad de costeo
              <select
                value={draft.unit}
                onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
              >
                <option>m²</option>
                <option>metro lineal</option>
                <option>pieza</option>
                <option>kg</option>
                <option>litro</option>
                <option>hora</option>
              </select>
            </label>
            <label>
              Presentación de compra
              <select
                value={draft.purchase_unit}
                onChange={(e) =>
                  setDraft({ ...draft, purchase_unit: e.target.value })
                }
              >
                <option>rollo</option>
                <option>tramo de 6 m</option>
                <option>paquete</option>
                <option>caja</option>
                <option>pieza</option>
                <option>kg</option>
                <option>litro</option>
                <option>unidad</option>
              </select>
            </label>
            <label>
              Costo de compra
              <div className="currency-field">
                <span>$</span>
                <input
                  className="currency-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.purchase_cost}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      purchase_cost: Number(e.target.value),
                    })
                  }
                />
              </div>
            </label>
            <label>
              Flete aplicable
              <div className="currency-field">
                <span>$</span>
                <input
                  className="currency-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.freight}
                  onChange={(e) =>
                    setDraft({ ...draft, freight: Number(e.target.value) })
                  }
                />
              </div>
            </label>
            {(draft.unit === "m²" || draft.unit === "metro lineal") && (
              <label>
                Ancho (m)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.width}
                  onChange={(e) =>
                    setDraft({ ...draft, width: Number(e.target.value) })
                  }
                />
              </label>
            )}
            {(draft.unit === "m²" || draft.unit === "metro lineal") && (
              <label>
                Largo (m)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.length}
                  onChange={(e) =>
                    setDraft({ ...draft, length: Number(e.target.value) })
                  }
                />
              </label>
            )}
            <label>
              Cantidad por presentación
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={draft.package_quantity}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    package_quantity: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="wide">
              Proveedor
              <input
                value={draft.supplier}
                onChange={(e) =>
                  setDraft({ ...draft, supplier: e.target.value })
                }
              />
            </label>
            <div className="wide normalized-cost-preview">
              <span>
                Rendimiento calculado: <strong>{yieldText(draft)}</strong>
              </span>
              <span>
                Costo para cotización:{" "}
                <strong>
                  {money(normalizedCost(draft))} por {draft.unit}
                </strong>
              </span>
              <small>
                Incluye el flete capturado. Esta cifra conserva la unidad que
                utiliza el motor de cotización.
              </small>
            </div>
          </div>
        </RecordModal>
      )}
    </div>
  );
}
function ArlonCatalogManager({ onBack }: { onBack: () => void }) {
  const [records, setRecords] = useState<ArlonRecord[]>([]),
    [loading, setLoading] = useState(true),
    [search, setSearch] = useState(""),
    [series, setSeries] = useState("Todas"),
    [draft, setDraft] = useState<ArlonRecord | null>(null);
  const load = () =>
    fetch("/api/arlon")
      .then((r) => r.json())
      .then(setRecords)
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);
  const seriesList = [...new Set(records.map((x) => x.series))];
  const filtered = records.filter(
    (x) =>
      (series === "Todas" || x.series === series) &&
      `${x.series} ${x.color_code} ${x.color_name} ${x.color_family} ${x.application}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const save = async () => {
    if (!draft) return;
    await fetch(`/api/arlon/${draft.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft(null);
    load();
  };
  return (
    <div className="business-content arlon-manager">
      <div className="content-head">
        <div>
          <p className="eyebrow">MATERIAS PRIMAS · CORTE DE VINIL</p>
          <h1>Catálogo Arlon Cut Graphics</h1>
          <p>
            Administra códigos, costos por metro lineal y disponibilidad en
            anchos de 0.61 y 1.22 m.
          </p>
        </div>
        <button className="ghost" onClick={onBack}>
          ← Materias primas generales
        </button>
      </div>
      <div className="arlon-guidance">
        <div>
          <strong>Arlon siempre disponible</strong>
          <span>Ventas puede cotizar la marca en cualquier metraje.</span>
        </div>
        <div>
          <strong>{records.length}</strong>
          <span>colores y especialidades</span>
        </div>
        <div>
          <strong>{seriesList.length}</strong>
          <span>series Arlon</span>
        </div>
        <div>
          <strong>
            {records.filter((x) => x.meter_cost_061 || x.meter_cost_122).length}
          </strong>
          <span>con costo por metro</span>
        </div>
      </div>
      <div className="list-toolbar arlon-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar código, color, aplicación o familia"
        />
        <select value={series} onChange={(e) => setSeries(e.target.value)}>
          <option>Todas</option>
          {seriesList.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <span>{filtered.length} registros</span>
      </div>
      {loading ? (
        <div className="business-loading">Cargando catálogo Arlon...</div>
      ) : (
        <div className="arlon-table">
          <div className="arlon-row arlon-header">
            <span>Color</span>
            <span>Serie / acabado</span>
            <span>Aplicación</span>
            <span>Anchos</span>
            <span>Costos por metro</span>
            <span>Estado</span>
            <span></span>
          </div>
          {filtered.map((x) => (
            <div className="arlon-row" key={x.id}>
              <span className="arlon-color-cell">
                <i style={{ background: x.hex }} />
                <strong>
                  {x.color_code}
                  <small>{x.color_name}</small>
                </strong>
              </span>
              <span>
                <strong>Arlon {x.series}</strong>
                <small>
                  {x.finish} · {x.film_type}
                </small>
              </span>
              <span>
                {x.application}
                <small>{x.durability}</small>
              </span>
              <span>
                {x.available_widths
                  .split(",")
                  .filter((w) => w !== "0.76")
                  .map((w) => `${w} m`)
                  .join(" · ")}
              </span>
              <span className="arlon-costs">
                <small>
                  0.61: {x.meter_cost_061 ? money(x.meter_cost_061) : "—"}
                </small>
                <small>
                  1.22: {x.meter_cost_122 ? money(x.meter_cost_122) : "—"}
                </small>
              </span>
              <em
                className={
                  x.stock_status === "No disponible"
                    ? "cost-pending"
                    : "cost-ready"
                }
              >
                {x.stock_status === "No disponible"
                  ? "STOP · No disponible"
                  : x.stock_status}
              </em>
              <button onClick={() => setDraft(x)}>Editar costos</button>
            </div>
          ))}
        </div>
      )}
      {draft && (
        <RecordModal
          title={`Arlon ${draft.series} · ${draft.color_code} ${draft.color_name}`}
          close={() => setDraft(null)}
          save={save}
        >
          <div className="arlon-edit-summary">
            <i style={{ background: draft.hex }} />
            <div>
              <strong>{draft.finish}</strong>
              <span>
                {draft.application} ·{" "}
                {draft.available_widths
                  .split(",")
                  .filter((w) => w !== "0.76")
                  .join(",")}{" "}
                m
              </span>
            </div>
          </div>
          <div className="modal-grid">
            <label>
              Costo por metro 0.61 m
              <input
                type="number"
                min="0"
                step="0.01"
                value={draft.meter_cost_061}
                onChange={(e) =>
                  setDraft({ ...draft, meter_cost_061: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Costo por metro 1.22 m
              <input
                type="number"
                min="0"
                step="0.01"
                value={draft.meter_cost_122}
                onChange={(e) =>
                  setDraft({ ...draft, meter_cost_122: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Proveedor en Guadalajara
              <input
                value={draft.supplier}
                onChange={(e) =>
                  setDraft({ ...draft, supplier: e.target.value })
                }
              />
            </label>
            <label className="wide">
              Disponibilidad
              <select
                value={draft.stock_status}
                onChange={(e) =>
                  setDraft({ ...draft, stock_status: e.target.value })
                }
              >
                <option>Costo pendiente</option>
                <option>Disponible con proveedor</option>
                <option>Sobre pedido</option>
                <option>No disponible</option>
              </select>
            </label>
          </div>
        </RecordModal>
      )}
    </div>
  );
}
function LxCatalogManager({ onBack }: { onBack: () => void }) {
  const [records, setRecords] = useState<LxRecord[]>([]),
    [loading, setLoading] = useState(true),
    [search, setSearch] = useState(""),
    [series, setSeries] = useState("Todas"),
    [draft, setDraft] = useState<LxRecord | null>(null);
  const load = () =>
    fetch("/api/lx")
      .then((r) => r.json())
      .then(setRecords)
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);
  const seriesList = [...new Set(records.map((x) => `${x.brand} ${x.series}`))],
    filtered = records.filter(
      (x) =>
        (series === "Todas" || `${x.brand} ${x.series}` === series) &&
        `${x.brand} ${x.series} ${x.color_code} ${x.color_name} ${x.application}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
  const save = async () => {
    if (!draft) return;
    await fetch(`/api/lx/${draft.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDraft(null);
    load();
  };
  return (
    <div className="business-content arlon-manager">
      <div className="content-head">
        <div>
          <p className="eyebrow">MATERIAS PRIMAS · CORTE DE VINIL</p>
          <h1>Catálogo LX Hausys / DM Lite</h1>
          <p>
            Códigos y costos por metro lineal para compra local o en
            Guadalajara.
          </p>
        </div>
        <button className="ghost" onClick={onBack}>
          ← Materias primas generales
        </button>
      </div>
      <div className="arlon-guidance">
        <div>
          <strong>Marca siempre disponible</strong>
          <span>Ventas puede elegir LX o Arlon sin restricciones.</span>
        </div>
        <div>
          <strong>{records.length}</strong>
          <span>colores y especialidades</span>
        </div>
        <div>
          <strong>{seriesList.length}</strong>
          <span>series</span>
        </div>
        <div>
          <strong>Sin flete</strong>
          <span>en pedidos desde 5 metros</span>
        </div>
      </div>
      <div className="list-toolbar arlon-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar código, color o aplicación"
        />
        <select value={series} onChange={(e) => setSeries(e.target.value)}>
          <option>Todas</option>
          {seriesList.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <span>{filtered.length} registros</span>
      </div>
      {loading ? (
        <div className="business-loading">Cargando catálogo...</div>
      ) : (
        <div className="arlon-table">
          <div className="arlon-row arlon-header">
            <span>Color</span>
            <span>Serie / acabado</span>
            <span>Aplicación</span>
            <span>Anchos</span>
            <span>Costos por metro</span>
            <span>Estado</span>
            <span></span>
          </div>
          {filtered.map((x) => (
            <div className="arlon-row" key={x.id}>
              <span className="arlon-color-cell">
                <i style={{ background: x.hex }} />
                <strong>
                  {x.color_code}
                  <small>{x.color_name}</small>
                </strong>
              </span>
              <span>
                <strong>
                  {x.brand} {x.series}
                </strong>
                <small>
                  {x.finish} · {x.film_type}
                </small>
              </span>
              <span>
                {x.application}
                <small>{x.durability}</small>
              </span>
              <span>
                {x.available_widths
                  .split(",")
                  .map((w) => `${w} m`)
                  .join(" · ")}
              </span>
              <span className="arlon-costs">
                <small>
                  0.61: {x.meter_cost_061 ? money(x.meter_cost_061) : "—"}
                </small>
                <small>
                  1.22: {x.meter_cost_122 ? money(x.meter_cost_122) : "—"}
                </small>
              </span>
              <em
                className={
                  x.stock_status === "No disponible"
                    ? "cost-pending"
                    : "cost-ready"
                }
              >
                {x.stock_status === "No disponible"
                  ? "STOP · No disponible"
                  : x.stock_status}
              </em>
              <button onClick={() => setDraft(x)}>Editar costos</button>
            </div>
          ))}
        </div>
      )}
      {draft && (
        <RecordModal
          title={`${draft.brand} ${draft.series} · ${draft.color_code} ${draft.color_name}`}
          close={() => setDraft(null)}
          save={save}
        >
          <div className="arlon-edit-summary">
            <i style={{ background: draft.hex }} />
            <div>
              <strong>{draft.finish}</strong>
              <span>{draft.application}</span>
            </div>
          </div>
          <div className="modal-grid">
            <label>
              Costo por metro 0.61 m
              <input
                type="number"
                min="0"
                step="0.01"
                value={draft.meter_cost_061}
                onChange={(e) =>
                  setDraft({ ...draft, meter_cost_061: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Costo por metro 1.22 m
              <input
                type="number"
                min="0"
                step="0.01"
                value={draft.meter_cost_122}
                onChange={(e) =>
                  setDraft({ ...draft, meter_cost_122: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Proveedor
              <input
                value={draft.supplier}
                onChange={(e) =>
                  setDraft({ ...draft, supplier: e.target.value })
                }
              />
            </label>
            <label>
              Disponibilidad
              <select
                value={draft.stock_status}
                onChange={(e) =>
                  setDraft({ ...draft, stock_status: e.target.value })
                }
              >
                <option>Costo pendiente</option>
                <option>Disponible localmente</option>
                <option>Disponible en Guadalajara</option>
                <option>Sobre pedido</option>
                <option>No disponible</option>
              </select>
            </label>
            <label className="wide">
              Equivalencia con otra marca
              <select
                value={draft.equivalence_status}
                onChange={(e) =>
                  setDraft({ ...draft, equivalence_status: e.target.value })
                }
              >
                <option>Sin validar</option>
                <option>Equivalente autorizado</option>
                <option>No equivalente</option>
              </select>
            </label>
          </div>
        </RecordModal>
      )}
    </div>
  );
}
function ClientsView({
  records,
  reload,
}: {
  records: ClientRecord[];
  reload: () => void;
}) {
  const empty: ClientRecord = {
      id: "",
      name: "",
      company: "",
      legal_name: "",
      tax_id: "",
      tax_regime: "",
      cfdi_use: "G03",
      fiscal_postal_code: "",
      street: "",
      exterior_number: "",
      interior_number: "",
      neighborhood: "",
      municipality: "",
      state: "Jalisco",
      country: "México",
      email: "",
      phone: "",
      customer_type: "Cliente Final",
      updated_at: 0,
    },
    [draft, setDraft] = useState<ClientRecord | null>(null),
    [search, setSearch] = useState("");
  const save = async () => {
    if (!draft?.name && !draft?.legal_name) return;
    const normalized = { ...draft, name: draft.name || draft.legal_name };
    await fetch(draft.id ? `/api/clients/${draft.id}` : "/api/clients", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(normalized),
    });
    setDraft(null);
    reload();
  };
  const filtered = records.filter((x) =>
    `${x.name} ${x.company} ${x.legal_name} ${x.tax_id} ${x.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="business-content">
      <div className="content-head">
        <div>
          <p className="eyebrow">DIRECTORIO COMERCIAL Y FISCAL</p>
          <h1>Clientes</h1>
          <p>
            Administra contactos, empresas y datos fiscales requeridos para
            facturar en México.
          </p>
        </div>
        <button className="primary" onClick={() => setDraft(empty)}>
          ＋ Nuevo cliente
        </button>
      </div>
      <div className="list-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar contacto, empresa, razón social o RFC"
        />
        <span>{filtered.length} clientes</span>
      </div>
      <div className="admin-table clients-table">
        <div className="admin-row admin-header">
          <span>Contacto / empresa</span>
          <span>Razón social / RFC</span>
          <span>Contacto</span>
          <span>Tipo</span>
          <span>Actualización</span>
          <span></span>
        </div>
        {filtered.map((x) => (
          <div className="admin-row" key={x.id}>
            <strong>
              {x.name}
              <small>{x.company || "Cliente particular"}</small>
            </strong>
            <span>
              {x.legal_name || "—"}
              <small>{x.tax_id || "Sin RFC"}</small>
            </span>
            <span>{x.email || x.phone || "—"}</span>
            <span>{x.customer_type}</span>
            <span>{new Date(x.updated_at).toLocaleDateString("es-MX")}</span>
            <button onClick={() => setDraft({ ...empty, ...x })}>Editar</button>
          </div>
        ))}
      </div>
      {draft && (
        <RecordModal
          title={draft.id ? "Editar expediente del cliente" : "Nuevo cliente"}
          close={() => setDraft(null)}
          save={save}
        >
          <div className="client-form-sections">
            <section>
              <h3>Datos generales</h3>
              <div className="modal-grid">
                <label>
                  Contacto
                  <input
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Empresa o nombre comercial
                  <input
                    value={draft.company}
                    onChange={(e) =>
                      setDraft({ ...draft, company: e.target.value })
                    }
                  />
                </label>
                <label className="wide">
                  Razón social
                  <input
                    value={draft.legal_name}
                    onChange={(e) =>
                      setDraft({ ...draft, legal_name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Correo
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(e) =>
                      setDraft({ ...draft, email: e.target.value })
                    }
                  />
                </label>
                <label>
                  Teléfono
                  <input
                    value={draft.phone}
                    onChange={(e) =>
                      setDraft({ ...draft, phone: e.target.value })
                    }
                  />
                </label>
                <label>
                  Tipo de cliente
                  <select
                    value={draft.customer_type}
                    onChange={(e) =>
                      setDraft({ ...draft, customer_type: e.target.value })
                    }
                  >
                    <option>Cliente Maquila</option>
                    <option>Cliente Frecuente</option>
                    <option>Cliente Final</option>
                  </select>
                </label>
              </div>
            </section>
            <section>
              <h3>Datos fiscales de México</h3>
              <div className="modal-grid">
                <label>
                  RFC
                  <input
                    maxLength={13}
                    value={draft.tax_id}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        tax_id: e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9&Ñ]/g, ""),
                      })
                    }
                  />
                </label>
                <label>
                  Código postal fiscal
                  <input
                    maxLength={5}
                    inputMode="numeric"
                    value={draft.fiscal_postal_code}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        fiscal_postal_code: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </label>
                <label className="wide">
                  Régimen fiscal
                  <select
                    value={draft.tax_regime}
                    onChange={(e) =>
                      setDraft({ ...draft, tax_regime: e.target.value })
                    }
                  >
                    <option value="">Seleccionar régimen</option>
                    {taxRegimes.map(([code, name]) => (
                      <option key={code} value={code}>
                        {code} · {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="wide">
                  Uso de CFDI
                  <select
                    value={draft.cfdi_use}
                    onChange={(e) =>
                      setDraft({ ...draft, cfdi_use: e.target.value })
                    }
                  >
                    <option value="G01">G01 · Adquisición de mercancías</option>
                    <option value="G03">G03 · Gastos en general</option>
                    <option value="I08">I08 · Otra maquinaria y equipo</option>
                    <option value="S01">S01 · Sin efectos fiscales</option>
                    <option value="CP01">CP01 · Pagos</option>
                    <option value="CN01">CN01 · Nómina</option>
                  </select>
                </label>
                <label className="wide">
                  Calle
                  <input
                    value={draft.street}
                    onChange={(e) =>
                      setDraft({ ...draft, street: e.target.value })
                    }
                  />
                </label>
                <label>
                  Número exterior
                  <input
                    value={draft.exterior_number}
                    onChange={(e) =>
                      setDraft({ ...draft, exterior_number: e.target.value })
                    }
                  />
                </label>
                <label>
                  Número interior
                  <input
                    value={draft.interior_number}
                    onChange={(e) =>
                      setDraft({ ...draft, interior_number: e.target.value })
                    }
                  />
                </label>
                <label>
                  Colonia
                  <input
                    value={draft.neighborhood}
                    onChange={(e) =>
                      setDraft({ ...draft, neighborhood: e.target.value })
                    }
                  />
                </label>
                <label>
                  Municipio / alcaldía
                  <input
                    value={draft.municipality}
                    onChange={(e) =>
                      setDraft({ ...draft, municipality: e.target.value })
                    }
                  />
                </label>
                <label>
                  Estado
                  <input
                    value={draft.state}
                    onChange={(e) =>
                      setDraft({ ...draft, state: e.target.value })
                    }
                  />
                </label>
                <label>
                  País
                  <input
                    value={draft.country}
                    onChange={(e) =>
                      setDraft({ ...draft, country: e.target.value })
                    }
                  />
                </label>
              </div>
            </section>
          </div>
        </RecordModal>
      )}
    </div>
  );
}
function QuickClientModal({
  close,
  onSaved,
}: {
  close: () => void;
  onSaved: (id: string) => void;
}) {
  const [form, setForm] = useState({
      name: "",
      company: "",
      legal_name: "",
      tax_id: "",
      email: "",
      phone: "",
      customer_type: "Cliente Final",
      tax_regime: "",
      cfdi_use: "G03",
      fiscal_postal_code: "",
      street: "",
      exterior_number: "",
      interior_number: "",
      neighborhood: "",
      municipality: "",
      state: "Jalisco",
      country: "México",
    }),
    [saving, setSaving] = useState(false);
  const save = async () => {
    if (!form.name && !form.legal_name) return;
    setSaving(true);
    const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name || form.legal_name }),
      }),
      data = await response.json();
    onSaved(data.id);
  };
  return (
    <RecordModal title="Nuevo cliente" close={close} save={save}>
      <div className="client-form-sections quick-client">
        <section>
          <h3>Datos generales</h3>
          <div className="modal-grid">
            <label>
              Contacto
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Empresa o nombre comercial
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label className="wide">
              Razón social
              <input
                value={form.legal_name}
                onChange={(e) =>
                  setForm({ ...form, legal_name: e.target.value })
                }
              />
            </label>
            <label>
              Correo
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              Teléfono
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label>
              Tipo de cliente
              <select
                value={form.customer_type}
                onChange={(e) =>
                  setForm({ ...form, customer_type: e.target.value })
                }
              >
                <option>Cliente Maquila</option>
                <option>Cliente Frecuente</option>
                <option>Cliente Final</option>
              </select>
            </label>
          </div>
        </section>
        <section>
          <h3>Datos fiscales opcionales</h3>
          <div className="modal-grid">
            <label>
              RFC
              <input
                maxLength={13}
                value={form.tax_id}
                onChange={(e) =>
                  setForm({ ...form, tax_id: e.target.value.toUpperCase() })
                }
              />
            </label>
            <label>
              Código postal fiscal
              <input
                maxLength={5}
                value={form.fiscal_postal_code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fiscal_postal_code: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </label>
            <label className="wide">
              Régimen fiscal
              <select
                value={form.tax_regime}
                onChange={(e) =>
                  setForm({ ...form, tax_regime: e.target.value })
                }
              >
                <option value="">Completar después</option>
                {taxRegimes.map(([code, name]) => (
                  <option key={code} value={code}>
                    {code} · {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
        {saving && <p className="saving-client">Guardando cliente...</p>}
      </div>
    </RecordModal>
  );
}
function RecordModal({
  title,
  children,
  close,
  save,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
  save: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <div className="record-modal">
        <div className="modal-head">
          <h2>{title}</h2>
          <button onClick={close}>×</button>
        </div>
        {children}
        <div className="modal-actions">
          <button className="ghost" onClick={close}>
            Cancelar
          </button>
          <button className="primary" onClick={save}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
function CommercialTable({
  records,
  salesOnly,
  onEdit,
  reload,
  onNewQuote,
}: {
  records: QuoteRecord[];
  salesOnly: boolean;
  onEdit: (r: QuoteRecord) => void;
  reload: () => void;
  onNewQuote: () => void;
}) {
  const [search, setSearch] = useState("");
  const [convertingId, setConvertingId] = useState("");
  const [conversionError, setConversionError] = useState("");
  const filtered = records.filter((r) =>
    `${r.folio} ${r.customer_name} ${r.seller}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const convertToSale = async (id: string) => {
    setConvertingId(id);
    setConversionError("");
    try {
      const response = await fetch(`/api/quotes/${id}/convert-to-sale`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result?.error || "No fue posible convertir la cotización.",
        );
      }
      reload();
    } catch (error) {
      setConversionError(
        error instanceof Error
          ? error.message
          : "No fue posible convertir la cotización.",
      );
    } finally {
      setConvertingId("");
    }
  };
  return (
    <div className="business-content">
      <div className="content-head">
        <div>
          <p className="eyebrow">MÓDULO COMERCIAL</p>
          <h1>{salesOnly ? "Ventas" : "Cotizaciones"}</h1>
          <p>
            {salesOnly
              ? "Cotizaciones aceptadas y convertidas en pedidos de venta."
              : "Consulta, edita, envía y convierte presupuestos."}
          </p>
        </div>
        {!salesOnly && (
          <button className="primary" onClick={onNewQuote}>
            ＋ Nueva cotización
          </button>
        )}
      </div>
      {conversionError && (
        <div className="quote-warning">{conversionError}</div>
      )}
      <div className="list-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente, folio o vendedor"
        />
        <span>{filtered.length} registros</span>
      </div>
      <div className="admin-table quote-admin-table">
        <div className="admin-row admin-header">
          <span>Fecha</span>
          <span>Folio</span>
          <span>Cliente</span>
          <span>Vendedor</span>
          <span>Estado</span>
          <span>Total</span>
          <span>Acciones</span>
        </div>
        {filtered.map((r) => (
          <div className="admin-row" key={r.id}>
            <span>{new Date(r.updated_at).toLocaleDateString("es-MX")}</span>
            <strong>{r.folio}</strong>
            <span>{r.customer_name}</span>
            <span>{r.seller}</span>
            <em className={`status-pill ${r.status.toLowerCase()}`}>
              {r.status}
            </em>
            <strong>{money(r.total)}</strong>
            <div className="compact-actions">
              <button onClick={() => onEdit(r)}>Editar</button>
              <button onClick={() => openQuoteDocument(r, "quote")}>PDF</button>
              {salesOnly ? (
                <button onClick={() => openQuoteDocument(r, "production")}>
                  Producción
                </button>
              ) : (
                r.status !== "Venta" && (
                  <button
                    className="sale-action"
                    disabled={convertingId === r.id}
                    onClick={() => convertToSale(r.id)}
                  >
                    {convertingId === r.id
                      ? "Generando órdenes..."
                      : "Convertir a venta"}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-row">No hay registros en esta sección.</div>
        )}
      </div>
    </div>
  );
}
function HistoryView({
  onBack,
  onEdit,
}: {
  onBack: () => void;
  onEdit: (record: QuoteRecord) => void;
}) {
  const [records, setRecords] = useState<QuoteRecord[]>([]),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("Todos"),
    [loading, setLoading] = useState(true),
    [convertingId, setConvertingId] = useState(""),
    [conversionError, setConversionError] = useState("");
  const load = () =>
    fetch("/api/quotes")
      .then((r) => r.json())
      .then(setRecords)
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);
  const changeStatus = async (id: string, next: string) => {
    setConversionError("");
    if (next === "Venta") {
      setConvertingId(id);
      try {
        const response = await fetch(
          `/api/quotes/${id}/convert-to-sale`,
          { method: "POST" },
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result?.error || "No fue posible convertir la cotización.",
          );
        }
      } catch (error) {
        setConversionError(
          error instanceof Error
            ? error.message
            : "No fue posible convertir la cotización.",
        );
      } finally {
        setConvertingId("");
      }
    } else {
      await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
    }
    load();
  };
  const filtered = records.filter(
    (r) =>
      (status === "Todos" || r.status === status) &&
      `${r.folio} ${r.customer_name} ${r.seller}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <main className="history-shell">
      <header className="topbar">
        <div className="brand">
          <img
            className="brand-logo-horizontal"
            src="/custom-graphics-logo.png"
            alt="Custom Graphics"
          />
          <div>
            <small>Cotizaciones y ventas</small>
          </div>
        </div>
        <button className="ghost" onClick={onBack}>
          ← Módulos
        </button>
      </header>
      <section className="history-page">
        <div className="history-head">
          <div>
            <p className="eyebrow">MÓDULO COMERCIAL</p>
            <h1>Cotizaciones y ventas</h1>
            <p>
              Consulta, edita, convierte y genera documentos de cada
              presupuesto.
            </p>
          </div>
          <button className="primary" onClick={onBack}>
            ＋ Nueva cotización
          </button>
        </div>
        {conversionError && (
          <div className="quote-warning">{conversionError}</div>
        )}
        <div className="history-filters">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente, folio o vendedor"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Todos</option>
            <option>Borrador</option>
            <option>Enviada</option>
            <option>Venta</option>
          </select>
        </div>
        <div className="history-table">
          <div className="history-row history-header">
            <span>Folio / cliente</span>
            <span>Vendedor</span>
            <span>Estado</span>
            <span>Total</span>
            <span>Actualización</span>
            <span>Acciones</span>
          </div>
          {loading ? (
            <div className="history-empty">Cargando historial...</div>
          ) : filtered.length === 0 ? (
            <div className="history-empty">
              Aún no hay cotizaciones guardadas con estos filtros.
            </div>
          ) : (
            filtered.map((record) => (
              <div className="history-row" key={record.id}>
                <span>
                  <strong>{record.folio}</strong>
                  <small>{record.customer_name}</small>
                </span>
                <span>{record.seller}</span>
                <span>
                  <em className={`status-pill ${record.status.toLowerCase()}`}>
                    {record.status}
                  </em>
                </span>
                <strong>{money(record.total)}</strong>
                <span>
                  {new Date(record.updated_at).toLocaleDateString("es-MX")}
                </span>
                <div className="history-actions">
                  <button onClick={() => onEdit(record)}>Editar</button>
                  <button onClick={() => openQuoteDocument(record, "quote")}>
                    Cotización PDF
                  </button>
                  <button
                    onClick={() => openQuoteDocument(record, "production")}
                  >
                    Producción PDF
                  </button>
                  <button onClick={() => openQuoteDocument(record, "invoice")}>
                    Factura PDF
                  </button>
                  {record.status !== "Venta" && (
                    <button
                      className="sale-action"
                      disabled={convertingId === record.id}
                      onClick={() => changeStatus(record.id, "Venta")}
                    >
                      {convertingId === record.id
                        ? "Generando órdenes..."
                        : "Convertir a venta"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
const LETTER_DOCUMENT_CSS = `@page{size:letter portrait;margin:3mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}html,body{width:100%;max-width:100%}body{font-family:Arial,sans-serif;color:#333;margin:0;padding:12mm 12mm 8mm;font-size:10.5px;line-height:1.42;overflow-wrap:anywhere}table{width:100%;max-width:100%;table-layout:fixed;border-collapse:collapse}thead{display:table-header-group}tr{break-inside:avoid}th,td{overflow-wrap:anywhere}.top{border-bottom:0!important;padding-bottom:0!important}.brand-logo{width:235px!important}.doc h1{font-size:30px!important;font-weight:400!important}.meta div{border:0!important;border-radius:0!important}.meta small{text-transform:uppercase}.company-info{margin:10px 0 34px;font-size:10px;line-height:1.35}.company-info strong{display:block;font-size:11px}thead tr{border-top:2px solid #111!important;border-bottom:3px solid #111!important}th{background:#baff00!important;color:#111!important;border-bottom:0!important;font-weight:600!important}tbody tr{border-bottom:1px solid #aaa!important}tbody tr:last-child{border-bottom:2px solid #111!important}.sales-document-table th:first-child,.sales-document-table td:first-child{width:4ch!important;max-width:4ch!important;text-align:center!important;white-space:nowrap}.sales-document-table th:nth-child(2),.sales-document-table td:nth-child(2){width:52%!important}.sales-document-table th:nth-child(3),.sales-document-table td:nth-child(3){width:13%!important}.sales-document-table th:nth-child(4),.sales-document-table td:nth-child(4){width:14%!important;text-align:right}.sales-document-table th:nth-child(5),.sales-document-table td:nth-child(5){width:17%!important;text-align:right}.production-document-table th:first-child,.production-document-table td:first-child{width:4ch!important;max-width:4ch!important;text-align:center!important;white-space:nowrap}.production-document-table th:nth-child(2),.production-document-table td:nth-child(2){width:auto!important}.totals .grand{background:#f1f1f1!important;border:0!important;color:#111!important}.totals .grand strong{color:#111!important}.footer{left:12mm!important;right:12mm!important;bottom:3mm!important;border-top:1px solid #aaa!important;color:#aaa!important}.footer:after{content:"Página " counter(page);margin-left:auto}`;
const DOCUMENT_COMPANY_INFO = `<section class="company-info"><strong>CREA IMPRIME Y TRANSMITE SA DE CV</strong><span>Carretera a Las Palmas 1280, Int. 1282-C Vallarta Park II<br>Col. Los Tamarindos Ixtapa, Jalisco<br>Puerto Vallarta Jalisco 48280<br>México</span></section>`;
function openPurchaseOrderDocument(record: PurchaseOrderRecord) {
  const items: PurchaseItem[] = JSON.parse(record.items_json || "[]"),
    rows = items
      .map(
        (item, i) =>
          `<tr><td>${i + 1}</td><td><strong>${item.description}</strong></td><td>${item.quantity} ${item.unit}</td><td>${money(item.unit_cost)}</td><td>${money(item.quantity * item.unit_cost)}</td></tr>`,
      )
      .join(""),
    logoUrl = `${window.location.origin}/custom-graphics-logo.png`,
    html = `<!doctype html><html><head><meta charset="utf-8"><title>ORDEN DE COMPRA ${record.folio}</title><style>${LETTER_DOCUMENT_CSS}.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:5px solid #baff00;padding-bottom:12px}.brand-logo{width:190px;height:auto}.doc{text-align:right}.doc h1{font-size:18px;margin:0}.meta{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:8px;margin:14px 0}.meta div{border:1px solid #d9e0da;border-radius:6px;padding:8px}.meta small{display:block;color:#6b776f;margin-bottom:3px}th{background:#0a0a0a;color:#fff;text-align:left;padding:8px;border-bottom:3px solid #baff00}td{padding:9px 8px;border-bottom:1px solid #dfe4df;vertical-align:top}th:first-child,td:first-child{width:7%}th:nth-child(3),td:nth-child(3){width:18%}th:nth-child(4),td:nth-child(4),th:nth-child(5),td:nth-child(5){width:16%;text-align:right}.totals{width:260px;margin:16px 0 0 auto}.totals div{display:flex;justify-content:space-between;padding:5px}.totals .grand{border-top:2px solid #111;font-size:15px}.notes{margin-top:20px;border-top:1px solid #d9e0da;padding-top:10px}.footer{position:fixed;bottom:0;left:0;right:0;border-top:1px solid #d9e0da;padding-top:5px;font-size:8px;color:#748078;display:flex;justify-content:space-between}</style></head><body><header class="top"><img class="brand-logo" src="${logoUrl}" alt="Custom Graphics"/><div class="doc"><h1>ORDEN DE COMPRA</h1><strong>${record.folio}</strong><br><span>${new Date(record.updated_at).toLocaleDateString("es-MX")}</span></div></header><section class="meta"><div><small>Proveedor</small><strong>${record.supplier_name}</strong></div><div><small>Proyecto / cotización</small><strong>${record.project_name || record.quote_folio || "Sin referencia"}</strong></div><div><small>Fecha requerida</small><strong>${record.required_date || "Por definir"}</strong></div></section><table><thead><tr><th>#</th><th>Insumo</th><th>Cantidad</th><th>Costo unitario</th><th>Importe</th></tr></thead><tbody>${rows}</tbody></table><section class="totals"><div><span>Subtotal</span><strong>${money(record.subtotal)}</strong></div><div><span>Flete</span><strong>${money(record.freight)}</strong></div><div><span>IVA</span><strong>${money(record.tax)}</strong></div><div class="grand"><span>Total</span><strong>${money(record.total)}</strong></div></section>${record.notes ? `<div class="notes"><strong>Notas</strong><p>${record.notes}</p></div>` : ""}<footer class="footer"><span>Custom Graphics</span><span>Documento generado desde el sistema de compras</span></footer><script>setTimeout(()=>window.print(),350)<\/script></body></html>`;
  const popup = window.open("", "_blank");
  if (popup) {
    popup.document.write(html);
    popup.document.close();
  }
}
function openQuoteDocument(
  record: QuoteRecord,
  type: "quote" | "production" | "invoice",
) {
  const data = JSON.parse(record.payload),
    items = data.items || [],
    isProduction = type === "production",
    title =
      type === "quote"
        ? "COTIZACIÓN"
        : type === "production"
          ? "ORDEN DE PRODUCCIÓN"
          : "FACTURA",
    rows = items
      .map((item: any, i: number) => {
        const l = item.line,
          p = l ? products.find((x) => x.id === l.productId) : undefined,
          quantity =
            item.quantity ||
            (l ? (p?.mode === "linear" ? l.linearMeters : l.quantity) : 1),
          unitPrice =
            item.unitPrice || (quantity ? item.price / quantity : item.price),
          details =
            item.description ||
            (l ? commercialDescription(l) : "Servicio de diseño gráfico"),
          production = isProduction
            ? l
              ? `<small>Equipo: ${l.productId === "lona" ? "Solvente Flytoo" : l.equipment} · Área: ${(item.area || 0).toFixed(2)} m² · Área cobrable: ${(item.billableArea || 0).toFixed(2)} m²${l.productId === "lona" ? ` · ${l.perimeterFinish} · ${l.grommetPattern} (${automaticGrommets(l)} ojillos)` : ""}</small>`
              : `<small>Servicio de diseño: una propuesta y dos rondas incluidas.</small>`
            : "";
        return `<tr>
<td>${i + 1}</td>
<td>
<strong>${item.product || p?.name || "Producto"}</strong>
<br>
<span>${details}</span>${production}</td>${
          isProduction
            ? ""
            : `<td>${quantity} ${item.unit || ""}</td>
<td>${money(unitPrice || 0)}</td>
<td>${money(item.price || 0)}</td>`
        }</tr>`;
      })
      .join("");
  const displayTitle = title.charAt(0) + title.slice(1).toLowerCase();
  const discount =
      data.discountPercent > 0
        ? `<div>
<span>Precio de lista</span>
<strong>${money(data.grossSubtotal || record.subtotal)}</strong>
</div>
<div>
<span>Descuento ${data.discountPercent}%</span>
<strong>− ${money(data.discountAmount || 0)}</strong>
</div>`
        : "",
    totals = isProduction
      ? ""
      : `<section class="totals">${discount}<div>
<span>Subtotal</span>
<strong>${money(record.subtotal)}</strong>
</div>
<div>
<span>IVA 16%</span>
<strong>${money(record.tax)}</strong>
</div>
<div class="grand">
<span>Total</span>
<strong>${money(record.total)}</strong>
</div>
</section>`;
  const invoiceNote =
    type === "invoice"
      ? `<p class="legal">Documento administrativo. La factura fiscal CFDI deberá emitirse mediante el sistema de facturación autorizado.</p>`
      : "";
  const tableHead = isProduction
    ? `<tr>
<th>#</th>
<th>Especificaciones de producción</th>
</tr>`
    : `<tr>
<th>#</th>
<th>Descripción del proyecto</th>
<th>Cant.</th>
<th>Tarifa</th>
<th>Cantidad</th>
</tr>`;
  const logoUrl = `${window.location.origin}/custom-graphics-logo.png`;
  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${title} ${record.folio}</title>
<style>${LETTER_DOCUMENT_CSS}.top{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:0}.brand-logo{width:235px;height:auto}.doc{text-align:right}.doc h1{font-size:32px;font-weight:400;margin:0 0 2px}.doc strong{display:block;font-size:11px}.doc span{display:block;margin-top:22px}.meta{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:18px;margin:0 0 20px;align-items:end}.meta div{padding:0}.meta small{display:block;color:#555;margin-bottom:2px;text-transform:uppercase}.meta div:not(:first-child){text-align:right}th{background:#baff00;color:#111;text-align:left;padding:8px 10px;font-weight:500}td{padding:10px;vertical-align:top;border-bottom:0}td:first-child{width:34px}td:last-child{text-align:right;width:110px}td span,td small{color:#555;line-height:1.5}.totals{width:300px;margin:28px 0 0 auto;border-top:1px solid #aaa}.totals div{display:flex;justify-content:space-between;padding:8px 12px}.totals .grand{border:0;margin-top:3px;padding:12px;background:#f1f1f1;font-size:14px}.totals .grand strong{color:#111}.notes{margin-top:28px;padding-top:12px;color:#555}.legal{margin-top:25px;font-size:9px;color:#777}.footer{position:fixed;padding-top:5px;font-size:8px;display:flex;justify-content:space-between}</style>
</head>
<body>
<header class="top">
<img class="brand-logo" src="${logoUrl}" alt="Custom Graphics"/>
<div class="doc">
<h1>${displayTitle}</h1>
<strong>${record.folio}</strong>
<span>${new Date(record.updated_at).toLocaleDateString("es-MX")}</span>
</div>
</header>
${DOCUMENT_COMPANY_INFO}
<section class="meta">
<div>
<small>Atención a</small>
<strong>${record.customer_name}</strong>
</div>
<div>
<small>Vendedor</small>
<strong>${record.seller}</strong>
</div>
<div>
<small>Estado</small>
<strong>${record.status}</strong>
</div>
</section>
<table class="${isProduction ? "production-document-table" : "sales-document-table"}">
<thead>${tableHead}</thead>
<tbody>${rows}</tbody>
</table>${totals}${type === "quote" ? '<div class="notes"><strong>Condiciones comerciales</strong><p>Precios en MXN. Vigencia de 15 días. Producción sujeta a confirmación de anticipo y archivos.</p></div>' : ""}${invoiceNote}<footer class="footer">
<span>Custom Graphics</span>
<span>${isProduction ? "Documento interno - sin precios" : "Documento generado desde el sistema de cotización"}</span>
</footer>
<script>setTimeout(()=>window.print(),350)<\/script>
</body>
</html>`;
  const popup = window.open("", "_blank");
  if (popup) {
    popup.document.write(html);
    popup.document.close();
  }
}
