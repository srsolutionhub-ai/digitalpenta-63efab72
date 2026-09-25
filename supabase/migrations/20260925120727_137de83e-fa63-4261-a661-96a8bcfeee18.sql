ALTER TABLE public.quotations
  ADD COLUMN IF NOT EXISTS client_gstin text,
  ADD COLUMN IF NOT EXISTS place_of_supply text,
  ADD COLUMN IF NOT EXISTS cgst_amount numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sgst_amount numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS igst_amount numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS decline_reason text,
  ADD COLUMN IF NOT EXISTS viewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS decided_at timestamptz,
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS client_gstin text,
  ADD COLUMN IF NOT EXISTS place_of_supply text,
  ADD COLUMN IF NOT EXISTS cgst_amount numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sgst_amount numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS igst_amount numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS amount_paid numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS irn text,
  ADD COLUMN IF NOT EXISTS reminder_sent_at timestamptz;

CREATE TABLE IF NOT EXISTS public.invoice_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  method text,
  reference text,
  paid_at timestamptz NOT NULL DEFAULT now(),
  recorded_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_payments TO authenticated;
GRANT ALL ON public.invoice_payments TO service_role;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Finance staff manage payments" ON public.invoice_payments FOR ALL TO authenticated
  USING (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'finance'))
  WITH CHECK (has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'finance'));
CREATE POLICY "Clients view own invoice payments" ON public.invoice_payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.invoices i WHERE i.id = invoice_id AND i.client_id = auth.uid()));

-- Clients may accept/decline their own sent quotations (and mark viewed)
CREATE POLICY "Clients decide own quotations" ON public.quotations FOR UPDATE TO authenticated
  USING (client_id = auth.uid()) WITH CHECK (client_id = auth.uid());

CREATE OR REPLACE FUNCTION public.enforce_client_quotation_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_staff(auth.uid()) THEN RETURN NEW; END IF;
  IF (to_jsonb(NEW) - ARRAY['status','decline_reason','decided_at','viewed_at','updated_at'])
     IS DISTINCT FROM (to_jsonb(OLD) - ARRAY['status','decline_reason','decided_at','viewed_at','updated_at']) THEN
    RAISE EXCEPTION 'Only the decision can be changed';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF OLD.status NOT IN ('sent','viewed') OR NEW.status NOT IN ('accepted','declined') THEN
      RAISE EXCEPTION 'This quotation can no longer be decided';
    END IF;
    NEW.decided_at := now();
  END IF;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.enforce_client_quotation_update() FROM public, anon, authenticated;
CREATE TRIGGER trg_enforce_client_quotation_update BEFORE UPDATE ON public.quotations
  FOR EACH ROW EXECUTE FUNCTION public.enforce_client_quotation_update();