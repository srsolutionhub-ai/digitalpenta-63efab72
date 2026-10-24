CREATE POLICY "service role manages doc counters" ON public.doc_counters
FOR ALL TO service_role USING (true) WITH CHECK (true);