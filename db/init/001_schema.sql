-- Custom Graphics Cotizador: base relacional autohospedada.
-- Todos los importes son MXN y se almacenan con precisión decimal.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE organization_settings (
  id text PRIMARY KEY DEFAULT 'default',
  name text NOT NULL,
  legal_name text NOT NULL DEFAULT '',
  tax_id text NOT NULL DEFAULT '',
  tax_regime text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  address jsonb NOT NULL DEFAULT '{}'::jsonb,
  quote_prefix text NOT NULL DEFAULT 'CG',
  tax_rate numeric(5,2) NOT NULL DEFAULT 16.00,
  monthly_goal numeric(14,2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  legal_name text NOT NULL DEFAULT '',
  tax_id text NOT NULL DEFAULT '',
  contact jsonb NOT NULL DEFAULT '{}'::jsonb,
  address jsonb NOT NULL DEFAULT '{}'::jsonb,
  payment_terms text NOT NULL DEFAULT '',
  default_freight numeric(14,2) NOT NULL DEFAULT 0,
  free_shipping_threshold numeric(14,2) NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cost_categories (
  code text PRIMARY KEY,
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('materia_prima', 'mano_obra', 'indirecto', 'servicio')),
  sort_order integer NOT NULL DEFAULT 0
);

INSERT INTO cost_categories (code, name, kind, sort_order) VALUES
  ('raw_material', 'Materia prima', 'materia_prima', 10),
  ('vinyl', 'Vinil', 'materia_prima', 20),
  ('steel', 'Herrería', 'materia_prima', 30),
  ('finishing', 'Acabados', 'materia_prima', 40),
  ('labor', 'Mano de obra', 'mano_obra', 50),
  ('indirect', 'Costos indirectos', 'indirecto', 60),
  ('logistics', 'Logística', 'servicio', 70)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  category_code text NOT NULL REFERENCES cost_categories(code),
  unit text NOT NULL,
  supplier_id uuid REFERENCES suppliers(id),
  cost numeric(14,4) NOT NULL CHECK (cost >= 0),
  purchase_unit text NOT NULL DEFAULT 'unidad',
  purchase_cost numeric(14,4) NOT NULL DEFAULT 0,
  freight numeric(14,4) NOT NULL DEFAULT 0,
  width_m numeric(10,4) NOT NULL DEFAULT 0,
  length_m numeric(10,4) NOT NULL DEFAULT 0,
  package_quantity numeric(12,4) NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE material_cost_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  cost numeric(14,4) NOT NULL CHECK (cost >= 0),
  supplier_id uuid REFERENCES suppliers(id),
  source text NOT NULL DEFAULT 'manual',
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE vinyl_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  brand text NOT NULL,
  series text NOT NULL,
  application text NOT NULL DEFAULT '',
  film_type text NOT NULL DEFAULT '',
  finish text NOT NULL DEFAULT '',
  durability text NOT NULL DEFAULT '',
  color_code text NOT NULL DEFAULT '',
  color_name text NOT NULL DEFAULT '',
  color_family text NOT NULL DEFAULT '',
  hex text NOT NULL DEFAULT '',
  available_widths text NOT NULL DEFAULT '',
  cost_061 numeric(14,4) NOT NULL DEFAULT 0,
  cost_122 numeric(14,4) NOT NULL DEFAULT 0,
  stock_status text NOT NULL DEFAULT 'Disponible',
  active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rigid_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  sku text NOT NULL UNIQUE,
  category text NOT NULL,
  name text NOT NULL,
  supplier_id uuid REFERENCES suppliers(id),
  thickness text NOT NULL DEFAULT '',
  width_m numeric(10,4) NOT NULL DEFAULT 1.22,
  length_m numeric(10,4) NOT NULL DEFAULT 2.44,
  sheet_cost numeric(14,4) NOT NULL DEFAULT 0,
  cost_m2 numeric(14,4) NOT NULL DEFAULT 0,
  minimum_fraction numeric(8,4) NOT NULL DEFAULT 0.25,
  special_full_sheet boolean NOT NULL DEFAULT false,
  reusable_offcut boolean NOT NULL DEFAULT true,
  default_cut text NOT NULL DEFAULT 'Router CNC',
  stock_status text NOT NULL DEFAULT 'Disponible',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE labor_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  role text NOT NULL UNIQUE,
  monthly_salary numeric(14,2) NOT NULL,
  employer_burden numeric(8,4) NOT NULL DEFAULT 0.34,
  scheduled_hours numeric(10,2) NOT NULL DEFAULT 176,
  utilization numeric(8,4) NOT NULL DEFAULT 0.85,
  loaded_monthly numeric(14,2) NOT NULL,
  productive_hour_cost numeric(14,4) NOT NULL,
  notes text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  name text NOT NULL,
  company text NOT NULL DEFAULT '',
  fiscal jsonb NOT NULL DEFAULT '{}'::jsonb,
  address jsonb NOT NULL DEFAULT '{}'::jsonb,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  customer_type text NOT NULL DEFAULT 'Cliente Final',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  folio text NOT NULL UNIQUE,
  client_id uuid REFERENCES clients(id),
  customer_name text NOT NULL,
  customer_type text NOT NULL,
  seller text NOT NULL,
  status text NOT NULL DEFAULT 'Borrador',
  margin numeric(8,4) NOT NULL,
  subtotal numeric(14,2) NOT NULL,
  tax numeric(14,2) NOT NULL,
  total numeric(14,2) NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE quote_cost_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  category_code text NOT NULL REFERENCES cost_categories(code),
  label text NOT NULL,
  quantity numeric(14,4) NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'unidad',
  unit_cost numeric(14,4) NOT NULL DEFAULT 0,
  total_cost numeric(14,2) NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id text UNIQUE,
  folio text NOT NULL UNIQUE,
  supplier_id uuid REFERENCES suppliers(id),
  supplier_name text NOT NULL,
  quote_folio text NOT NULL DEFAULT '',
  project_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Borrador',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  freight numeric(14,2) NOT NULL DEFAULT 0,
  tax numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  requested_by text NOT NULL DEFAULT '',
  required_date date,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX materials_category_idx ON materials(category_code);
CREATE INDEX materials_name_idx ON materials(name);
CREATE INDEX vinyl_catalog_brand_series_idx ON vinyl_catalog(brand, series);
CREATE INDEX rigid_materials_category_idx ON rigid_materials(category);
CREATE INDEX quote_cost_lines_quote_idx ON quote_cost_lines(quote_id);
