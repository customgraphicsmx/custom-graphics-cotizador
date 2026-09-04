-- Structural fabrication catalog: pending prices are intentional until supplier costs are captured.
INSERT INTO cost_categories (code, name, kind, sort_order) VALUES
  ('hardware', 'Ferretería', 'materia_prima', 31),
  ('adhesives', 'Adhesivos', 'materia_prima', 32)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  kind = EXCLUDED.kind,
  sort_order = EXCLUDED.sort_order;

INSERT INTO materials (
  legacy_id, code, name, category_code, unit, cost, purchase_unit,
  purchase_cost, freight, width_m, length_m, package_quantity, active
)
VALUES
  ('HERR14', 'HERR14', 'Tubular galvanizado 1 x 1 · calibre 18', 'steel', 'metro lineal', 0, 'tramo de 6 m', 0, 0, 0, 6, 1, true),
  ('FERR01', 'FERR01', 'Pija punta de broca #8 x 1 con rondana', 'hardware', 'pieza', 0, 'caja de 100 piezas', 0, 0, 0, 0, 100, true),
  ('FERR02', 'FERR02', 'Pija punta de broca #10 x 1½ con rondana', 'hardware', 'pieza', 0, 'caja de 100 piezas', 0, 0, 0, 0, 100, true),
  ('FERR03', 'FERR03', 'Pija punta de broca #12 x 2 con rondana', 'hardware', 'pieza', 0, 'caja de 100 piezas', 0, 0, 0, 0, 100, true),
  ('ADH01', 'ADH01', 'Cinta doble cara estructural', 'adhesives', 'metro lineal', 0, 'rollo', 0, 0, 0, 50, 1, true),
  ('ADH02', 'ADH02', 'Silicón estructural Hi-Bond Pensilvania', 'adhesives', 'cartucho', 0, 'cartucho', 0, 0, 0, 0, 1, true)
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