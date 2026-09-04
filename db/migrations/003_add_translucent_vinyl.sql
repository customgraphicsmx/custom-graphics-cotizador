-- Register a material that must be visible in inventory before its supplier cost is defined.
INSERT INTO materials (
  legacy_id,
  code,
  name,
  category_code,
  unit,
  cost,
  purchase_unit,
  purchase_cost,
  freight,
  width_m,
  length_m,
  package_quantity,
  active
)
VALUES (
  'GF-TRASLUCIDO',
  'GF-TRASLUCIDO',
  'Vinil blanco traslúcido para caja de luz',
  'vinyl',
  'm²',
  0,
  'rollo',
  0,
  0,
  1.50,
  50,
  75,
  true
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  category_code = EXCLUDED.category_code,
  unit = EXCLUDED.unit,
  purchase_unit = EXCLUDED.purchase_unit,
  width_m = EXCLUDED.width_m,
  length_m = EXCLUDED.length_m,
  package_quantity = EXCLUDED.package_quantity,
  active = true,
  updated_at = now();
