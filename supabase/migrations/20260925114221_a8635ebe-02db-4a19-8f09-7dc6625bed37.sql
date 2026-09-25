CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'sequence_cron_token') THEN
    PERFORM vault.create_secret(encode(gen_random_bytes(32), 'hex'), 'sequence_cron_token');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.verify_cron_token(_token text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, vault AS $$
  SELECT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'sequence_cron_token' AND decrypted_secret = _token)
$$;
REVOKE EXECUTE ON FUNCTION public.verify_cron_token(text) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.verify_cron_token(text) TO service_role;