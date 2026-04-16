-- Insert super_admin role for the user
INSERT INTO public.user_roles (user_id, role)
VALUES ('9c8cb5e5-13f4-41b0-b104-3c3cd3ac4357', 'super_admin')
ON CONFLICT (user_id, role) DO NOTHING;