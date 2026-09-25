CREATE OR REPLACE FUNCTION public.enforce_client_approval_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_staff(auth.uid()) OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  IF OLD.status <> 'pending' THEN RAISE EXCEPTION 'Approval is no longer pending'; END IF;
  IF NEW.status NOT IN ('approved','changes_requested') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  IF NEW.decided_by IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'decided_by must be the current user'; END IF;
  IF NEW.account_id IS DISTINCT FROM OLD.account_id OR NEW.project_id IS DISTINCT FROM OLD.project_id
     OR NEW.title IS DISTINCT FROM OLD.title OR NEW.description IS DISTINCT FROM OLD.description
     OR NEW.file_url IS DISTINCT FROM OLD.file_url OR NEW.created_by IS DISTINCT FROM OLD.created_by
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Only the decision and comment can be changed';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_client_approval_update() FROM anon, authenticated, public;
CREATE TRIGGER trg_enforce_client_approval_update BEFORE UPDATE ON public.client_approvals
FOR EACH ROW EXECUTE FUNCTION public.enforce_client_approval_update();