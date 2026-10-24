CREATE OR REPLACE FUNCTION public.set_doc_account_id() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.account_id IS NULL THEN
    -- client_email exists on quotations/invoices but NOT on support_messages;
    -- referencing a missing record field raises an error at execution time.
    IF TG_TABLE_NAME <> 'support_messages' AND NEW.client_email IS NOT NULL THEN
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
END $$;
REVOKE EXECUTE ON FUNCTION public.set_doc_account_id() FROM PUBLIC, anon, authenticated;