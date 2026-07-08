
-- Drop the overly-permissive self-update policy and replace with one that blocks role changes
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can update own profile') THEN
    DROP POLICY "Users can update own profile" ON public.profiles;
  END IF;
END $$;

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      -- non-admins cannot change role: force it to match existing value
      role IS NOT DISTINCT FROM (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
      OR public.has_role(auth.uid(), 'super_admin'::app_role)
    )
  );
