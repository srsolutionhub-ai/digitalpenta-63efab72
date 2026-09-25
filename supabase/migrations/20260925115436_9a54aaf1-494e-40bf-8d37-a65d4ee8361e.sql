CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(_token text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n int;
BEGIN
  IF _token IS NULL OR length(_token) < 16 OR length(_token) > 200 THEN RETURN false; END IF;
  UPDATE public.newsletter_subscribers SET unsubscribed_at = COALESCE(unsubscribed_at, now()), status = 'unsubscribed'
  WHERE unsub_token::text = _token;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END; $$;
REVOKE ALL ON FUNCTION public.unsubscribe_newsletter(text) FROM public;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(text) TO anon, authenticated, service_role;