CREATE TABLE IF NOT EXISTS public.support_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'open',
  last_message_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (account_id)
);

GRANT SELECT ON public.support_threads TO authenticated;
GRANT ALL ON public.support_threads TO service_role;

ALTER TABLE public.support_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients read own company thread" ON public.support_threads FOR SELECT
USING (public.is_account_member(auth.uid(), account_id));

CREATE POLICY "Staff manage threads" ON public.support_threads FOR ALL
USING (public.is_staff(auth.uid()))
WITH CHECK (public.is_staff(auth.uid()));

-- Keep the thread in sync with messages: create on first message,
-- bump last_message_at, and reopen when a client (non-staff) replies.
CREATE OR REPLACE FUNCTION public.sync_support_thread()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sender_is_staff boolean;
BEGIN
  IF NEW.account_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT public.is_staff(NEW.sender_id) INTO _sender_is_staff;
  INSERT INTO public.support_threads (account_id, status, last_message_at)
  VALUES (NEW.account_id, 'open', NEW.created_at)
  ON CONFLICT (account_id) DO UPDATE SET
    last_message_at = EXCLUDED.last_message_at,
    updated_at = now(),
    status = CASE WHEN _sender_is_staff THEN support_threads.status ELSE 'open' END;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_support_thread() FROM anon, authenticated;

DROP TRIGGER IF EXISTS sync_support_thread ON public.support_messages;
CREATE TRIGGER sync_support_thread AFTER INSERT ON public.support_messages
FOR EACH ROW EXECUTE FUNCTION public.sync_support_thread();