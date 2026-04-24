-- 1. Time entries: approval workflow
ALTER TABLE public.time_entries
  ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;

-- Allow users to delete their own time entries (RLS already covers ALL via user_id = auth.uid())
-- Add admin update policy explicitly so approval works
CREATE POLICY "Admins approve time entries"
  ON public.time_entries
  FOR UPDATE
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'account_manager'::app_role) OR has_role(auth.uid(), 'finance'::app_role));

-- 2. Audits: per-recommendation status map
ALTER TABLE public.audits
  ADD COLUMN IF NOT EXISTS recommendation_statuses jsonb NOT NULL DEFAULT '{}'::jsonb;

-- 3. Quotation activity log: trigger writes to audit_log on every status change
CREATE OR REPLACE FUNCTION public.log_quotation_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.audit_log (entity_type, entity_id, action, actor_id, before_state, after_state)
    VALUES (
      'quotation',
      NEW.id,
      'status_changed:' || COALESCE(NEW.status, 'null'),
      auth.uid(),
      jsonb_build_object('status', OLD.status, 'total', OLD.total),
      jsonb_build_object('status', NEW.status, 'total', NEW.total, 'quote_number', NEW.quote_number, 'client_name', NEW.client_name, 'notes', NEW.notes)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS quotation_activity_log ON public.quotations;
CREATE TRIGGER quotation_activity_log
  AFTER UPDATE ON public.quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.log_quotation_activity();

-- 4. Log auto-invoice creation linked back to quotation
CREATE OR REPLACE FUNCTION public.log_invoice_auto_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.quotation_id IS NOT NULL THEN
    INSERT INTO public.audit_log (entity_type, entity_id, action, actor_id, after_state)
    VALUES (
      'quotation',
      NEW.quotation_id,
      'invoice_auto_created',
      auth.uid(),
      jsonb_build_object('invoice_id', NEW.id, 'invoice_number', NEW.invoice_number, 'total', NEW.total, 'due_date', NEW.due_date)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS invoice_auto_created_log ON public.invoices;
CREATE TRIGGER invoice_auto_created_log
  AFTER INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.log_invoice_auto_created();

-- Index for activity-feed queries
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.audit_log (entity_type, entity_id, created_at DESC);
