CREATE OR REPLACE FUNCTION public.link_client_by_email() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.client_id IS NULL AND NEW.client_email IS NOT NULL AND btrim(NEW.client_email) <> '' THEN
    SELECT p.id INTO NEW.client_id FROM public.profiles p
    WHERE lower(p.email) = lower(btrim(NEW.client_email)) LIMIT 1;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.link_client_by_email() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_link_client_invoices ON public.invoices;
CREATE TRIGGER trg_link_client_invoices BEFORE INSERT OR UPDATE OF client_email, client_id ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.link_client_by_email();
DROP TRIGGER IF EXISTS trg_link_client_quotations ON public.quotations;
CREATE TRIGGER trg_link_client_quotations BEFORE INSERT OR UPDATE OF client_email, client_id ON public.quotations
FOR EACH ROW EXECUTE FUNCTION public.link_client_by_email();

UPDATE public.invoices i SET client_id = p.id FROM public.profiles p
WHERE i.client_id IS NULL AND lower(p.email) = lower(btrim(i.client_email));
UPDATE public.quotations q SET client_id = p.id FROM public.profiles p
WHERE q.client_id IS NULL AND lower(p.email) = lower(btrim(q.client_email));

CREATE OR REPLACE FUNCTION public.link_docs_on_client_role() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _email text;
BEGIN
  IF NEW.role = 'client' THEN
    SELECT email INTO _email FROM public.profiles WHERE id = NEW.user_id;
    IF _email IS NOT NULL THEN
      UPDATE public.invoices SET client_id = NEW.user_id WHERE client_id IS NULL AND lower(btrim(client_email)) = lower(_email);
      UPDATE public.quotations SET client_id = NEW.user_id WHERE client_id IS NULL AND lower(btrim(client_email)) = lower(_email);
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.link_docs_on_client_role() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_link_docs_on_client_role ON public.user_roles;
CREATE TRIGGER trg_link_docs_on_client_role AFTER INSERT OR UPDATE OF role ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.link_docs_on_client_role();

CREATE UNIQUE INDEX IF NOT EXISTS account_team_members_account_user_uniq ON public.account_team_members(account_id, user_id);