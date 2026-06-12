-- Temporary password reset for super admin (user requested fix)
-- Sets password to: DigitalPenta@2026 (user MUST change after first login)
UPDATE auth.users
SET encrypted_password = crypt('DigitalPenta@2026', gen_salt('bf')),
    updated_at = now()
WHERE id = '9c8cb5e5-13f4-41b0-b104-3c3cd3ac4357';