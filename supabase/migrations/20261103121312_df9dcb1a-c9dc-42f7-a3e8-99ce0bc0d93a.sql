DROP POLICY IF EXISTS "Clients view company quotations" ON public.quotations;
DROP POLICY IF EXISTS "Clients decide company quotations" ON public.quotations;
DROP POLICY IF EXISTS "Clients view company invoices" ON public.invoices;
CREATE POLICY "Clients view company quotations" ON public.quotations FOR SELECT TO authenticated
  USING (status <> 'draft' AND ((account_id IS NULL AND client_id = auth.uid()) OR (account_id IS NOT NULL AND public.is_account_member(auth.uid(), account_id))));
CREATE POLICY "Clients decide company quotations" ON public.quotations FOR UPDATE TO authenticated
  USING (status <> 'draft' AND ((account_id IS NULL AND client_id = auth.uid()) OR (account_id IS NOT NULL AND public.is_account_member(auth.uid(), account_id))));
CREATE POLICY "Clients view company invoices" ON public.invoices FOR SELECT TO authenticated
  USING (status <> 'draft' AND ((account_id IS NULL AND client_id = auth.uid()) OR (account_id IS NOT NULL AND public.is_account_member(auth.uid(), account_id))));
ALTER TABLE public.strategy_call_bookings ADD COLUMN IF NOT EXISTS confirmation_sent_at timestamptz;