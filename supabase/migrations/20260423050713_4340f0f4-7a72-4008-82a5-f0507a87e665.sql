-- 1. Trigger: accepted quotation -> draft invoice
CREATE OR REPLACE FUNCTION public.create_invoice_from_quotation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_invoice_id uuid;
BEGIN
  -- Only fire on status transition to 'accepted'
  IF NEW.status = 'accepted' AND (OLD.status IS DISTINCT FROM 'accepted') THEN
    -- Skip if invoice already exists for this quote
    SELECT id INTO existing_invoice_id FROM public.invoices WHERE quotation_id = NEW.id LIMIT 1;
    IF existing_invoice_id IS NOT NULL THEN
      RETURN NEW;
    END IF;

    INSERT INTO public.invoices (
      quotation_id, client_id, client_name, client_email,
      items, subtotal, tax_amount, total, currency,
      due_date, status, invoice_number
    ) VALUES (
      NEW.id, NEW.client_id, NEW.client_name, NEW.client_email,
      NEW.items, NEW.subtotal, NEW.tax_amount, NEW.total, NEW.currency,
      (CURRENT_DATE + INTERVAL '30 days')::date, 'draft', 'DRAFT'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS quotation_to_invoice ON public.quotations;
CREATE TRIGGER quotation_to_invoice
  AFTER UPDATE ON public.quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_invoice_from_quotation();

-- 2. Auto-number invoices on insert (existing function already defined)
DROP TRIGGER IF EXISTS set_invoice_number ON public.invoices;
CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number = 'DRAFT' OR NEW.invoice_number IS NULL)
  EXECUTE FUNCTION public.generate_invoice_number();

-- 3. Auto-number quotations on insert
DROP TRIGGER IF EXISTS set_quote_number ON public.quotations;
CREATE TRIGGER set_quote_number
  BEFORE INSERT ON public.quotations
  FOR EACH ROW
  WHEN (NEW.quote_number = 'DRAFT' OR NEW.quote_number IS NULL)
  EXECUTE FUNCTION public.generate_quote_number();

-- 4. Team workload weekly view
CREATE OR REPLACE VIEW public.team_workload_weekly AS
SELECT
  te.user_id,
  date_trunc('week', te.entry_date)::date AS week_start,
  ROUND(SUM(te.duration_minutes) / 60.0, 2) AS total_hours,
  ROUND(SUM(te.duration_minutes) FILTER (WHERE te.billable) / 60.0, 2) AS billable_hours,
  COUNT(DISTINCT te.task_id) AS tasks_worked
FROM public.time_entries te
GROUP BY te.user_id, date_trunc('week', te.entry_date);

-- 5. Project billing summary function
CREATE OR REPLACE FUNCTION public.project_billing_summary(p_account_id uuid DEFAULT NULL)
RETURNS TABLE (
  project_id uuid,
  project_name text,
  account_id uuid,
  estimated_hours numeric,
  logged_hours numeric,
  billable_hours numeric,
  budget numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id AS project_id,
    p.name AS project_name,
    p.account_id,
    COALESCE(SUM(t.estimate_hours), 0) AS estimated_hours,
    COALESCE(SUM(te.duration_minutes) / 60.0, 0) AS logged_hours,
    COALESCE(SUM(te.duration_minutes) FILTER (WHERE te.billable) / 60.0, 0) AS billable_hours,
    p.budget
  FROM public.projects p
  LEFT JOIN public.tasks t ON t.project_id = p.id
  LEFT JOIN public.time_entries te ON te.task_id = t.id
  WHERE p_account_id IS NULL OR p.account_id = p_account_id
  GROUP BY p.id, p.name, p.account_id, p.budget;
$$;

-- 6. Task logged-hours helper function
CREATE OR REPLACE FUNCTION public.task_logged_hours(p_task_id uuid)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(duration_minutes) / 60.0, 0)
  FROM public.time_entries
  WHERE task_id = p_task_id;
$$;