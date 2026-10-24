-- 1. set_doc_account_id: never evaluate client_email on support_messages records
CREATE OR REPLACE FUNCTION public.set_doc_account_id() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.account_id IS NULL THEN
    IF TG_TABLE_NAME <> 'support_messages' THEN
      IF NEW.client_email IS NOT NULL THEN
        SELECT atm.account_id INTO NEW.account_id
        FROM public.profiles p
        JOIN public.account_team_members atm ON atm.user_id = p.id
        WHERE lower(p.email) = lower(NEW.client_email)
        LIMIT 1;
      END IF;
    END IF;
    IF NEW.account_id IS NULL AND NEW.client_id IS NOT NULL THEN
      SELECT atm.account_id INTO NEW.account_id
      FROM public.account_team_members atm
      WHERE atm.user_id = NEW.client_id
      LIMIT 1;
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.set_doc_account_id() FROM PUBLIC, anon, authenticated;

-- 2. Support messages: split the broad FOR ALL client policy into read + send-only
DROP POLICY IF EXISTS "Clients see company messages" ON public.support_messages;
CREATE POLICY "Clients read company messages" ON public.support_messages
  FOR SELECT TO authenticated
  USING (public.is_account_member(auth.uid(), account_id));
CREATE POLICY "Clients send company messages" ON public.support_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND client_id = auth.uid()
    AND public.is_account_member(auth.uid(), account_id)
  );

-- 3. Auto invoice from accepted quote: copy company + full tax identity
CREATE OR REPLACE FUNCTION public.create_invoice_from_quotation()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  existing_invoice_id uuid;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS DISTINCT FROM 'accepted') THEN
    SELECT id INTO existing_invoice_id FROM public.invoices WHERE quotation_id = NEW.id LIMIT 1;
    IF existing_invoice_id IS NOT NULL THEN
      RETURN NEW;
    END IF;
    INSERT INTO public.invoices (
      quotation_id, account_id, client_id, client_name, client_email,
      client_gstin, place_of_supply,
      items, subtotal, tax_rate, tax_amount, cgst_amount, sgst_amount, igst_amount,
      total, currency, due_date, status, invoice_number
    ) VALUES (
      NEW.id, NEW.account_id, NEW.client_id, NEW.client_name, NEW.client_email,
      NEW.client_gstin, NEW.place_of_supply,
      NEW.items, NEW.subtotal, NEW.tax_rate, NEW.tax_amount, NEW.cgst_amount, NEW.sgst_amount, NEW.igst_amount,
      NEW.total, NEW.currency, (CURRENT_DATE + INTERVAL '30 days')::date, 'draft', 'DRAFT'
    );
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.create_invoice_from_quotation() FROM PUBLIC, anon, authenticated;

-- 4. Numbering triggers: treat empty string as blank too
CREATE OR REPLACE FUNCTION public.generate_quote_number() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE next_seq integer;
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' OR NEW.quote_number = 'DRAFT' THEN
    SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 'QT-[0-9]{4}-([0-9]+)') AS integer)), 0) + 1
    INTO next_seq FROM public.quotations
    WHERE quote_number LIKE 'QT-' || to_char(now(), 'YYYY') || '-%';
    NEW.quote_number := 'QT-' || to_char(now(), 'YYYY') || '-' || LPAD(next_seq::text, 3, '0');
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.generate_invoice_number() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
DECLARE next_seq integer;
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' OR NEW.invoice_number = 'DRAFT' THEN
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-[0-9]{4}-([0-9]+)') AS integer)), 0) + 1
    INTO next_seq FROM public.invoices
    WHERE invoice_number LIKE 'INV-' || to_char(now(), 'YYYY') || '-%';
    NEW.invoice_number := 'INV-' || to_char(now(), 'YYYY') || '-' || LPAD(next_seq::text, 3, '0');
  END IF;
  RETURN NEW;
END $$;

-- 5. Clients must not see or modify draft documents
DROP POLICY IF EXISTS "Clients view company quotations" ON public.quotations;
CREATE POLICY "Clients view company quotations" ON public.quotations
  FOR SELECT TO authenticated
  USING (status <> 'draft' AND (client_id = auth.uid() OR public.is_account_member(auth.uid(), account_id)));

DROP POLICY IF EXISTS "Clients decide company quotations" ON public.quotations;
CREATE POLICY "Clients decide company quotations" ON public.quotations
  FOR UPDATE TO authenticated
  USING (status <> 'draft' AND (client_id = auth.uid() OR public.is_account_member(auth.uid(), account_id)));

DROP POLICY IF EXISTS "Clients view company invoices" ON public.invoices;
CREATE POLICY "Clients view company invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (status <> 'draft' AND (client_id = auth.uid() OR public.is_account_member(auth.uid(), account_id)));

-- 6. Deals: record closing date when moved to a won/lost stage
CREATE OR REPLACE FUNCTION public.sync_deal_closed_at() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _won boolean; _lost boolean;
BEGIN
  SELECT COALESCE(is_won, false), COALESCE(is_lost, false) INTO _won, _lost
  FROM public.crm_pipeline_stages WHERE id = NEW.stage_id;
  IF _won OR _lost THEN
    NEW.closed_at := COALESCE(NEW.closed_at, now());
  ELSE
    NEW.closed_at := NULL;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.sync_deal_closed_at() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_deal_closed_at ON public.crm_deals;
CREATE TRIGGER trg_deal_closed_at BEFORE INSERT OR UPDATE OF stage_id ON public.crm_deals
FOR EACH ROW EXECUTE FUNCTION public.sync_deal_closed_at();

-- 7. Notify client logins when something needs their attention
CREATE OR REPLACE FUNCTION public.notify_account_clients(_account_id uuid, _client_id uuid, _title text, _body text, _link text, _type text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, body, link, type)
  SELECT DISTINCT u_id, _title, _body, _link, _type
  FROM (
    SELECT atm.user_id AS u_id FROM public.account_team_members atm
    WHERE _account_id IS NOT NULL AND atm.account_id = _account_id
    UNION
    SELECT _client_id WHERE _client_id IS NOT NULL
  ) recipients;
END $$;
REVOKE EXECUTE ON FUNCTION public.notify_account_clients(uuid, uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.trg_notify_client_events() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_TABLE_NAME = 'client_approvals' AND TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
    PERFORM public.notify_account_clients(NEW.account_id, NULL,
      'Approval requested: ' || NEW.title,
      'Your team is waiting for your sign-off.',
      '/dashboard/client/approvals', 'approval');
  ELSIF TG_TABLE_NAME = 'client_reports' AND NEW.published AND (TG_OP = 'INSERT' OR OLD.published IS DISTINCT FROM true) THEN
    PERFORM public.notify_account_clients(NEW.account_id, NULL,
      'New report published: ' || NEW.title,
      'Your latest performance report is ready to view.',
      '/dashboard/client/reports', 'report');
  ELSIF TG_TABLE_NAME = 'invoices' AND NEW.status = 'sent' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'sent') THEN
    PERFORM public.notify_account_clients(NEW.account_id, NEW.client_id,
      'Invoice ' || NEW.invoice_number || ' sent',
      'A new invoice is available in your portal.',
      '/dashboard/client/invoices', 'invoice');
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.trg_notify_client_events() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_notify_approval ON public.client_approvals;
CREATE TRIGGER trg_notify_approval AFTER INSERT ON public.client_approvals
FOR EACH ROW EXECUTE FUNCTION public.trg_notify_client_events();
DROP TRIGGER IF EXISTS trg_notify_report ON public.client_reports;
CREATE TRIGGER trg_notify_report AFTER INSERT OR UPDATE OF published ON public.client_reports
FOR EACH ROW EXECUTE FUNCTION public.trg_notify_client_events();
DROP TRIGGER IF EXISTS trg_notify_invoice ON public.invoices;
CREATE TRIGGER trg_notify_invoice AFTER INSERT OR UPDATE OF status ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.trg_notify_client_events();