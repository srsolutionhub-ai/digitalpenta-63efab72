-- Safe helper: is the caller a member of the company folder this file lives in?
CREATE OR REPLACE FUNCTION public.can_access_client_file(_path text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  _account uuid;
BEGIN
  BEGIN
    _account := (storage.foldername(_path))[1]::uuid;
  EXCEPTION WHEN others THEN
    RETURN false;
  END;
  RETURN public.is_account_member(auth.uid(), _account);
END;
$$;

-- Clients can read and upload files inside their company's folder
DROP POLICY IF EXISTS "Clients read company files" ON storage.objects;
CREATE POLICY "Clients read company files" ON storage.objects FOR SELECT
USING (bucket_id = 'client-files' AND public.can_access_client_file(name));

DROP POLICY IF EXISTS "Clients upload company files" ON storage.objects;
CREATE POLICY "Clients upload company files" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-files' AND public.can_access_client_file(name));

-- Clients can register the files they upload
DROP POLICY IF EXISTS "Clients add company files" ON public.campaign_files;
CREATE POLICY "Clients add company files" ON public.campaign_files FOR INSERT
TO authenticated
WITH CHECK (public.is_account_member(auth.uid(), account_id) AND uploaded_by = auth.uid());