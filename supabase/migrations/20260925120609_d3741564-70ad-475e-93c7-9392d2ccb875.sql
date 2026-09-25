CREATE TABLE public.wa_quick_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shortcut text NOT NULL CHECK (length(shortcut) BETWEEN 1 AND 40),
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 1024),
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wa_quick_replies TO authenticated;
GRANT ALL ON public.wa_quick_replies TO service_role;
ALTER TABLE public.wa_quick_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage quick replies" ON public.wa_quick_replies FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER trg_wa_quick_replies_updated BEFORE UPDATE ON public.wa_quick_replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();