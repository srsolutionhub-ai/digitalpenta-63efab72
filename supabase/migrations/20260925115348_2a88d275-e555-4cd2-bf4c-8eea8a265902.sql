-- Audits and tool runs are only written by backend functions (service role)
DROP POLICY IF EXISTS "Anyone can create audits" ON public.audits;
DROP POLICY IF EXISTS tool_runs_insert_public ON public.tool_runs;

-- Analytics events: validated public insert
DROP POLICY IF EXISTS "Allow insert for all users" ON public.analytics_events;
CREATE POLICY "Validated analytics insert" ON public.analytics_events FOR INSERT TO anon, authenticated
WITH CHECK (length(event_name) BETWEEN 1 AND 100 AND (page_url IS NULL OR length(page_url) <= 2048) AND (custom_properties IS NULL OR pg_column_size(custom_properties) <= 8192));

-- Cookie consent ledger
DROP POLICY IF EXISTS consent_insert_public ON public.cookie_consent_ledger;
CREATE POLICY consent_insert_validated ON public.cookie_consent_ledger FOR INSERT TO anon, authenticated
WITH CHECK (jsonb_typeof(preferences) = 'object' AND pg_column_size(preferences) <= 2048 AND length(policy_version) BETWEEN 1 AND 20 AND email IS NULL AND (user_agent IS NULL OR length(user_agent) <= 512) AND (visitor_id IS NULL OR length(visitor_id) <= 100));

-- Newsletter subscribers
DROP POLICY IF EXISTS "Allow insert for all users" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS public_can_subscribe ON public.newsletter_subscribers;
CREATE POLICY newsletter_subscribe_validated ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254 AND (name IS NULL OR length(name) <= 120) AND (company IS NULL OR length(company) <= 160) AND (status IS NULL OR status = 'active'));

-- Strategy call bookings
DROP POLICY IF EXISTS "Anyone can request a strategy call" ON public.strategy_call_bookings;
CREATE POLICY booking_request_validated ON public.strategy_call_bookings FOR INSERT TO anon, authenticated
WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254 AND length(name) BETWEEN 1 AND 120 AND preferred_date >= (current_date - 1) AND preferred_date <= (current_date + 180));

-- Visitor segments: staff only
DROP POLICY IF EXISTS "Enable read access for visitor_segments" ON public.visitor_segments;
CREATE POLICY "Staff read visitor_segments" ON public.visitor_segments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));