-- ============ A. Atomic document numbering (counter-row pattern) ============
CREATE TABLE IF NOT EXISTS public.doc_counters (
  kind text NOT NULL,
  year integer NOT NULL,
  last_value bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (kind, year)
);
ALTER TABLE public.doc_counters ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.doc_counters FROM anon, authenticated;
GRANT ALL ON public.doc_counters TO service_role;

-- Seed counters from the current highest numbers so the series continues uninterrupted.
INSERT INTO public.doc_counters (kind, year, last_value)
SELECT 'quote', y.yr, COALESCE((
  SELECT MAX(CAST(SUBSTRING(q.quote_number FROM 'QT-[0-9]{4}-([0-9]+)') AS integer))
  FROM public.quotations q
  WHERE q.quote_number LIKE 'QT-' || y.yr || '-%'
), 0)
FROM (SELECT DISTINCT to_char(now(), 'YYYY')::int AS yr) y
ON CONFLICT (kind, year) DO NOTHING;

INSERT INTO public.doc_counters (kind, year, last_value)
SELECT 'invoice', y.yr, COALESCE((
  SELECT MAX(CAST(SUBSTRING(i.invoice_number FROM 'INV-[0-9]{4}-([0-9]+)') AS integer))
  FROM public.invoices i
  WHERE i.invoice_number LIKE 'INV-' || y.yr || '-%'
), 0)
FROM (SELECT DISTINCT to_char(now(), 'YYYY')::int AS yr) y
ON CONFLICT (kind, year) DO NOTHING;

-- Atomic increment: one statement, row lock, rollback-safe (gap-free).
CREATE OR REPLACE FUNCTION public.next_doc_number(_kind text, _year integer)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _val bigint;
BEGIN
  INSERT INTO public.doc_counters (kind, year, last_value)
  VALUES (_kind, _year, 1)
  ON CONFLICT (kind, year)
  DO UPDATE SET last_value = doc_counters.last_value + 1
  RETURNING last_value INTO _val;
  RETURN _val;
END $$;
REVOKE EXECUTE ON FUNCTION public.next_doc_number(text, integer) FROM PUBLIC, anon, authenticated;

-- Rewrite the numbering triggers to use the atomic counter.
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE _yr integer := to_char(now(), 'YYYY')::int;
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' OR NEW.quote_number = 'DRAFT' THEN
    NEW.quote_number := 'QT-' || _yr || '-' || LPAD(public.next_doc_number('quote', _yr)::text, 3, '0');
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE _yr integer := to_char(now(), 'YYYY')::int;
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' OR NEW.invoice_number = 'DRAFT' THEN
    NEW.invoice_number := 'INV-' || _yr || '-' || LPAD(public.next_doc_number('invoice', _yr)::text, 3, '0');
  END IF;
  RETURN NEW;
END $$;

-- ============ B. Atomic claiming for the email sequence runner ============
ALTER TABLE public.email_sequence_enrollments
  ADD COLUMN IF NOT EXISTS processing_at timestamptz;

-- Claims due enrollments atomically: SKIP LOCKED means two overlapping runs
-- can never pick the same rows. Leases older than 10 minutes are reclaimable
-- so a crashed run never strands an enrollment.
CREATE OR REPLACE FUNCTION public.claim_due_sequence_enrollments(_limit integer DEFAULT 50)
RETURNS SETOF public.email_sequence_enrollments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE public.email_sequence_enrollments e
  SET processing_at = now()
  WHERE e.id IN (
    SELECT id FROM public.email_sequence_enrollments
    WHERE status = 'active'
      AND next_send_at <= now()
      AND (processing_at IS NULL OR processing_at < now() - interval '10 minutes')
    ORDER BY next_send_at
    LIMIT _limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING e.*;
END $$;
REVOKE EXECUTE ON FUNCTION public.claim_due_sequence_enrollments(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_due_sequence_enrollments(integer) TO service_role;