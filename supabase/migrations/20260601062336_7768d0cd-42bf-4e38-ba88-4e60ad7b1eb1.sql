-- Fix: audit_log public INSERT
DROP POLICY IF EXISTS "System writes audit log" ON public.audit_log;
CREATE POLICY "Service role writes audit log"
  ON public.audit_log FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix: quality_check_logs public INSERT
DROP POLICY IF EXISTS "System can insert quality check logs" ON public.quality_check_logs;
CREATE POLICY "Service role inserts quality check logs"
  ON public.quality_check_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix: time_entries self-approval bypass
DROP POLICY IF EXISTS "Users manage own time entries" ON public.time_entries;

CREATE POLICY "Users view own time entries"
  ON public.time_entries FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own time entries"
  ON public.time_entries FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND approval_status = 'pending');

CREATE POLICY "Users update own pending time entries"
  ON public.time_entries FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND approval_status = 'pending')
  WITH CHECK (
    user_id = auth.uid()
    AND approval_status = 'pending'
    AND approved_at IS NULL
    AND approved_by IS NULL
  );

CREATE POLICY "Users delete own pending time entries"
  ON public.time_entries FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND approval_status = 'pending');
