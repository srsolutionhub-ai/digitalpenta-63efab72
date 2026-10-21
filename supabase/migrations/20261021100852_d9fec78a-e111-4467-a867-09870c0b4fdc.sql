ALTER TABLE public.crm_deals ADD COLUMN IF NOT EXISTS lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES public.crm_deals(id) ON DELETE SET NULL;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS contact_id uuid REFERENCES public.contacts(id) ON DELETE SET NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS quotation_id uuid REFERENCES public.quotations(id) ON DELETE SET NULL;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_crm_deals_lead_id ON public.crm_deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_quotations_deal_id ON public.quotations(deal_id);
CREATE INDEX IF NOT EXISTS idx_projects_quotation_id ON public.projects(quotation_id);