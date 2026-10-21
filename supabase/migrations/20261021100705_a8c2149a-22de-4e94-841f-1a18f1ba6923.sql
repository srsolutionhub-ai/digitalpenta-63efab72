-- 1. Company link on client-facing documents
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL;
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.accounts(id) ON DELETE SET NULL;

-- 2. Backfill from client email → profile → company membership
UPDATE public.invoices i SET account_id = atm.account_id
FROM public.profiles p JOIN public.account_team_members atm ON atm.user_id = p.id
WHERE i.account_id IS NULL AND i.client_email IS NOT NULL AND lower(i.client_email) = lower(p.email);

UPDATE public.quotations q SET account_id = atm.account_id
FROM public.profiles p JOIN public.account_team_members atm ON atm.user_id = p.id
WHERE q.account_id IS NULL AND q.client_email IS NOT NULL AND lower(q.client_email) = lower(p.email);

UPDATE public.support_messages sm SET account_id = atm.account_id
FROM public.account_team_members atm
WHERE sm.account_id IS NULL AND sm.client_id = atm.user_id;

-- 3. Auto-fill the company link on new/updated documents
CREATE OR REPLACE FUNCTION public.set_doc_account_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.account_id IS NULL THEN
    IF NEW.client_email IS NOT NULL THEN
      SELECT atm.account_id INTO NEW.account_id
      FROM public.profiles p
      JOIN public.account_team_members atm ON atm.user_id = p.id
      WHERE lower(p.email) = lower(NEW.client_email)
      LIMIT 1;
    END IF;
    IF NEW.account_id IS NULL AND NEW.client_id IS NOT NULL THEN
      SELECT atm.account_id INTO NEW.account_id
      FROM public.account_team_members atm
      WHERE atm.user_id = NEW.client_id
      LIMIT 1;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_invoice_account_id ON public.invoices;
CREATE TRIGGER set_invoice_account_id BEFORE INSERT OR UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.set_doc_account_id();

DROP TRIGGER IF EXISTS set_quotation_account_id ON public.quotations;
CREATE TRIGGER set_quotation_account_id BEFORE INSERT OR UPDATE ON public.quotations
FOR EACH ROW EXECUTE FUNCTION public.set_doc_account_id();

DROP TRIGGER IF EXISTS set_support_message_account_id ON public.support_messages;
CREATE TRIGGER set_support_message_account_id BEFORE INSERT OR UPDATE ON public.support_messages
FOR EACH ROW EXECUTE FUNCTION public.set_doc_account_id();

-- 4. Company-wide read access for clients
DROP POLICY IF EXISTS "Clients view own invoices" ON public.invoices;
CREATE POLICY "Clients view company invoices" ON public.invoices FOR SELECT
USING (client_id = auth.uid() OR public.is_account_member(auth.uid(), account_id));

DROP POLICY IF EXISTS "Clients view own quotations" ON public.quotations;
CREATE POLICY "Clients view company quotations" ON public.quotations FOR SELECT
USING (client_id = auth.uid() OR public.is_account_member(auth.uid(), account_id));

DROP POLICY IF EXISTS "Clients decide own quotations" ON public.quotations;
CREATE POLICY "Clients decide company quotations" ON public.quotations FOR UPDATE
USING (client_id = auth.uid() OR public.is_account_member(auth.uid(), account_id));

DROP POLICY IF EXISTS "Clients view own invoice payments" ON public.invoice_payments;
CREATE POLICY "Clients view company invoice payments" ON public.invoice_payments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.invoices i
  WHERE i.id = invoice_payments.invoice_id
    AND (i.client_id = auth.uid() OR public.is_account_member(auth.uid(), i.account_id))
));

DROP POLICY IF EXISTS "Clients see own messages" ON public.support_messages;
CREATE POLICY "Clients see company messages" ON public.support_messages FOR ALL
USING (client_id = auth.uid() OR sender_id = auth.uid() OR public.is_account_member(auth.uid(), account_id))
WITH CHECK (client_id = auth.uid() OR sender_id = auth.uid() OR public.is_account_member(auth.uid(), account_id));