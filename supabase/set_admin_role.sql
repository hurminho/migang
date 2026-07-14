-- Grant admin role to an existing user (run in Supabase SQL Editor)
-- Replace the email if needed.

UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'migang@gmail.com';

-- Verify:
-- SELECT id, email, role FROM public.profiles WHERE email = 'migang@gmail.com';
