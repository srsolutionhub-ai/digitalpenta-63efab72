
-- Role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'account_manager', 'finance', 'content_writer', 'seo_specialist', 'client');

-- User roles table (separate from profiles per security best practices)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Client campaigns table
CREATE TABLE public.client_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  health_score integer DEFAULT 0,
  seo_data jsonb DEFAULT '{}',
  ppc_data jsonb DEFAULT '{}',
  social_data jsonb DEFAULT '{}',
  report_month date,
  report_pdf_url text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.client_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Client sees own campaigns" ON public.client_campaigns
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admins manage campaigns" ON public.client_campaigns
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'account_manager'));

-- Quotations table
CREATE TABLE public.quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text UNIQUE NOT NULL,
  client_id uuid REFERENCES auth.users(id),
  client_name text NOT NULL,
  client_email text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  tax_rate numeric(5,2) DEFAULT 18,
  tax_amount numeric(12,2) DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'INR',
  validity_date date,
  status text DEFAULT 'draft',
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage quotations" ON public.quotations
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Clients view own quotations" ON public.quotations
  FOR SELECT USING (client_id = auth.uid());

-- Invoices table
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  quotation_id uuid REFERENCES public.quotations(id),
  client_id uuid REFERENCES auth.users(id),
  client_name text NOT NULL,
  client_email text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  subtotal numeric(12,2) NOT NULL,
  tax_amount numeric(12,2) DEFAULT 0,
  total numeric(12,2) NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'draft',
  due_date date,
  paid_at timestamptz,
  payment_link text,
  payment_gateway text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage invoices" ON public.invoices
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Clients view own invoices" ON public.invoices
  FOR SELECT USING (client_id = auth.uid());

-- Support messages
CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id) NOT NULL,
  sender_id uuid REFERENCES auth.users(id) NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see own messages" ON public.support_messages
  FOR ALL USING (client_id = auth.uid() OR sender_id = auth.uid());

CREATE POLICY "Admins see all messages" ON public.support_messages
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'account_manager'));

-- Auto-generate quote numbers
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  current_year text;
  next_seq integer;
BEGIN
  current_year := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 9) AS integer)), 0) + 1
    INTO next_seq
    FROM quotations
    WHERE quote_number LIKE 'QT-' || current_year || '-%';
  NEW.quote_number := 'QT-' || current_year || '-' || LPAD(next_seq::text, 3, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_quote_number
  BEFORE INSERT ON public.quotations
  FOR EACH ROW
  WHEN (NEW.quote_number IS NULL OR NEW.quote_number = '')
  EXECUTE FUNCTION public.generate_quote_number();

-- Auto-generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  current_year text;
  next_seq integer;
BEGIN
  current_year := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 10) AS integer)), 0) + 1
    INTO next_seq
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || current_year || '-%';
  NEW.invoice_number := 'INV-' || current_year || '-' || LPAD(next_seq::text, 3, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
  EXECUTE FUNCTION public.generate_invoice_number();

-- Add assigned_to to existing leads table if not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'assigned_to' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN assigned_to uuid;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'company' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN company text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'name' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN name text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'email' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN email text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'phone' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN phone text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'website' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN website text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'notes' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN notes text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_source' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN utm_source text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_medium' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN utm_medium text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_campaign' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN utm_campaign text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'source' AND table_schema = 'public') THEN
    ALTER TABLE public.leads ADD COLUMN source text;
  END IF;
END $$;

-- Add RLS policy for leads with role-based access
DROP POLICY IF EXISTS "Allow insert for all users" ON public.leads;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON public.leads;

CREATE POLICY "AM sees assigned or admin sees all leads" ON public.leads
  FOR ALL USING (
    public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'account_manager')
    OR public.has_role(auth.uid(), 'finance')
  );

CREATE POLICY "Public can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Create storage bucket for reports if not exists
INSERT INTO storage.buckets (id, name, public) VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Clients can view own reports" ON storage.objects
  FOR SELECT USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage reports" ON storage.objects
  FOR ALL USING (
    bucket_id = 'reports' AND (
      public.has_role(auth.uid(), 'super_admin') OR
      public.has_role(auth.uid(), 'account_manager')
    )
  );
