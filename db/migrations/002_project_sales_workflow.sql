BEGIN;

CREATE SEQUENCE IF NOT EXISTS project_folio_seq START 1;
CREATE SEQUENCE IF NOT EXISTS sales_order_folio_seq START 1;
CREATE SEQUENCE IF NOT EXISTS production_order_folio_seq START 1;
CREATE SEQUENCE IF NOT EXISTS invoice_folio_seq START 1;

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio text NOT NULL UNIQUE,
  client_id uuid REFERENCES clients(id),
  name text NOT NULL,
  customer_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  estimator text NOT NULL DEFAULT '',
  closer text NOT NULL DEFAULT '',
  customer_type text NOT NULL DEFAULT '',
  quote_date date,
  expiration_date date,
  status text NOT NULL DEFAULT 'Cotización',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id);
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS accepted_at timestamptz;

CREATE TABLE IF NOT EXISTS quote_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  version_no integer NOT NULL,
  status text NOT NULL DEFAULT 'Borrador',
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (quote_id, version_no)
);

CREATE TABLE IF NOT EXISTS quote_concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  version_id uuid REFERENCES quote_versions(id) ON DELETE CASCADE,
  sequence_no integer NOT NULL DEFAULT 1,
  module_code text NOT NULL DEFAULT '',
  product_code text NOT NULL DEFAULT '',
  product_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  quantity numeric(14,4) NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'pieza',
  unit_price numeric(14,4) NOT NULL DEFAULT 0,
  price numeric(14,2) NOT NULL DEFAULT 0,
  cost numeric(14,2) NOT NULL DEFAULT 0,
  technical_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quote_cost_lines ADD COLUMN IF NOT EXISTS concept_id uuid REFERENCES quote_concepts(id) ON DELETE CASCADE;
ALTER TABLE quote_cost_lines ADD COLUMN IF NOT EXISTS module_code text NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS sales_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio text NOT NULL UNIQUE,
  project_id uuid NOT NULL REFERENCES projects(id),
  quote_id uuid NOT NULL UNIQUE REFERENCES quotes(id),
  quote_version_id uuid REFERENCES quote_versions(id),
  customer_name text NOT NULL,
  status text NOT NULL DEFAULT 'Confirmada',
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  accepted_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS production_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio text NOT NULL UNIQUE,
  sales_order_id uuid NOT NULL UNIQUE REFERENCES sales_orders(id),
  project_id uuid NOT NULL REFERENCES projects(id),
  quote_id uuid NOT NULL REFERENCES quotes(id),
  status text NOT NULL DEFAULT 'Pendiente',
  priority text NOT NULL DEFAULT 'Normal',
  technical_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS production_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  production_order_id uuid NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  concept_id uuid REFERENCES quote_concepts(id),
  sequence_no integer NOT NULL DEFAULT 1,
  module_code text NOT NULL DEFAULT '',
  product_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  quantity numeric(14,4) NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'pieza',
  specifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'Pendiente'
);

ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id);
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS sales_order_id uuid REFERENCES sales_orders(id);
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS production_order_id uuid REFERENCES production_orders(id);
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS auto_generated boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  concept_id uuid REFERENCES quote_concepts(id),
  sequence_no integer NOT NULL DEFAULT 1,
  material_code text NOT NULL DEFAULT '',
  description text NOT NULL,
  quantity numeric(14,4) NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'unidad',
  unit_cost numeric(14,4) NOT NULL DEFAULT 0,
  total_cost numeric(14,2) NOT NULL DEFAULT 0,
  technical_details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio text NOT NULL UNIQUE,
  sales_order_id uuid NOT NULL REFERENCES sales_orders(id),
  project_id uuid NOT NULL REFERENCES projects(id),
  status text NOT NULL DEFAULT 'Borrador',
  invoice_date date NOT NULL DEFAULT current_date,
  due_date date,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  fiscal_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  external_invoice_id text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoice_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  concept_id uuid REFERENCES quote_concepts(id),
  description text NOT NULL,
  quantity numeric(14,4) NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'servicio',
  unit_price numeric(14,4) NOT NULL DEFAULT 0,
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id),
  sales_order_id uuid REFERENCES sales_orders(id),
  payment_date date NOT NULL DEFAULT current_date,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  method text NOT NULL DEFAULT '',
  reference text NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES invoices(id),
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  UNIQUE (payment_id, invoice_id)
);

CREATE INDEX IF NOT EXISTS projects_client_idx ON projects(client_id);
CREATE INDEX IF NOT EXISTS quotes_project_idx ON quotes(project_id);
CREATE INDEX IF NOT EXISTS quote_versions_quote_idx ON quote_versions(quote_id);
CREATE INDEX IF NOT EXISTS quote_concepts_quote_idx ON quote_concepts(quote_id);
CREATE INDEX IF NOT EXISTS sales_orders_project_idx ON sales_orders(project_id);
CREATE INDEX IF NOT EXISTS production_orders_project_idx ON production_orders(project_id);
CREATE INDEX IF NOT EXISTS purchase_orders_project_idx ON purchase_orders(project_id);
CREATE INDEX IF NOT EXISTS invoices_sales_order_idx ON invoices(sales_order_id);
CREATE INDEX IF NOT EXISTS payments_project_idx ON payments(project_id);

COMMIT;
