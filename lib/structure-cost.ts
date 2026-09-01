export type StructureProfile = {
  id: string;
  label: string;
  barLengthM: number;
  barCost: number;
};

export const structureProfiles: StructureProfile[] = [
  { id: "tubular-12-18", label: "Tubular ½ × ½ cal. 18", barLengthM: 6, barCost: 125.34 },
  { id: "tubular-34-18", label: "Tubular ¾ × ¾ cal. 18", barLengthM: 6, barCost: 216.92 },
  { id: "galvanizado-2x1-18", label: "Tubular galvanizado 2 × 1 cal. 18", barLengthM: 6, barCost: 455.53 },
  { id: "galvanizado-2x1-19", label: "Tubular galvanizado 2 × 1 cal. 19", barLengthM: 6, barCost: 462 },
  { id: "galvanizado-2x1-20", label: "Tubular galvanizado 2 × 1 cal. 20", barLengthM: 6, barCost: 465 },
];

export type StructureInput = {
  widthM: number;
  heightM: number;
  horizontalCrossbars: number;
  verticalCrossbars: number;
  profile: StructureProfile;
  finish: "none" | "anticorrosive";
};

export type CostLine = { label: string; category: "materia_prima" | "mano_obra" | "indirecto"; total: number; note: string };

const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const weldingPerMeter = 4.35;
const cuttingPerBar = 3.69;
const fastenerCost = 1.2;
const anticorrosivePaintPerMeter = 21.06;

export function calculateStructure(input: StructureInput) {
  const widthM = Math.max(0.1, input.widthM);
  const heightM = Math.max(0.1, input.heightM);
  const horizontalCrossbars = Math.max(0, Math.floor(input.horizontalCrossbars));
  const verticalCrossbars = Math.max(0, Math.floor(input.verticalCrossbars));
  const perimeterM = 2 * (widthM + heightM);
  const reinforcementM = horizontalCrossbars * widthM + verticalCrossbars * heightM;
  const requiredM = perimeterM + reinforcementM;
  const bars = Math.ceil(requiredM / input.profile.barLengthM);
  const joints = 4 + 2 * (horizontalCrossbars + verticalCrossbars);
  const laborHours = round(0.5 + requiredM * 0.32 + (horizontalCrossbars + verticalCrossbars) * 0.14);
  const fasteners = 4 + joints * 2;

  const lines: CostLine[] = [
    { label: input.profile.label, category: "materia_prima", total: round(bars * input.profile.barCost), note: `${bars} barra(s) de ${input.profile.barLengthM} m` },
    { label: "Soldadura", category: "materia_prima", total: round(requiredM * weldingPerMeter), note: "Consumo estimado de electrodo" },
    { label: "Discos de corte", category: "indirecto", total: round(bars * cuttingPerBar), note: "Prorrateo por barra" },
    { label: "Pijas con rondana", category: "materia_prima", total: round(fasteners * fastenerCost), note: `${fasteners} pieza(s) estimadas` },
    { label: "Mano de obra de fabricación", category: "mano_obra", total: round(laborHours * 105), note: `${laborHours.toFixed(2)} h estimadas` },
  ];

  if (input.finish === "anticorrosive") {
    lines.splice(3, 0, { label: "Primer, pintura y thinner", category: "materia_prima", total: round(requiredM * anticorrosivePaintPerMeter), note: "Aplicación anticorrosiva" });
  }
  const cost = round(lines.reduce((sum, line) => sum + line.total, 0));

  return {
    widthM,
    heightM,
    horizontalCrossbars,
    verticalCrossbars,
    perimeterM: round(perimeterM),
    reinforcementM: round(reinforcementM),
    requiredM: round(requiredM),
    purchasedM: round(bars * input.profile.barLengthM),
    bars,
    joints,
    fasteners,
    laborHours,
    lines,
    cost,
  };
}
