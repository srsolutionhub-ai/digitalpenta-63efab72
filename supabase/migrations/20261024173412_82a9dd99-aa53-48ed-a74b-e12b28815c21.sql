CREATE OR REPLACE FUNCTION public.backfill_docs_on_membership() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Attach this member's previously unscoped documents to the company they just joined.
  UPDATE public.quotations SET account_id = NEW.account_id
  WHERE account_id IS NULL AND client_id = NEW.user_id;
  UPDATE public.invoices SET account_id = NEW.account_id
  WHERE account_id IS NULL AND client_id = NEW.user_id;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.backfill_docs_on_membership() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_backfill_docs_on_membership ON public.account_team_members;
CREATE TRIGGER trg_backfill_docs_on_membership AFTER INSERT ON public.account_team_members
FOR EACH ROW EXECUTE FUNCTION public.backfill_docs_on_membership();