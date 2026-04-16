-- Allow authenticated users to delete blog posts
CREATE POLICY "Allow delete for authenticated users"
ON public.blog_posts
FOR DELETE
USING (auth.role() = 'authenticated'::text);

-- Allow authenticated users to see all posts (including drafts) for admin
CREATE POLICY "Authenticated can view all posts"
ON public.blog_posts
FOR SELECT
USING (auth.role() = 'authenticated'::text);