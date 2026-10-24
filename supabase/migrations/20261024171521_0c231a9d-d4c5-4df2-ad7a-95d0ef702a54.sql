DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='support_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='support_threads') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.support_threads;
  END IF;
END $$;

DELETE FROM public.quotations WHERE id = '3b300874-7d3f-4b36-bc6b-1620eeaaa859' AND client_name = 'QA Audit';