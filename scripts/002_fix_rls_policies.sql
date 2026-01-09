-- Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;

-- Create a simpler policy: Users can only view themselves
-- Admin access will be handled via Supabase service role or via separate logic
CREATE POLICY "Users can view own profile only" ON public.users FOR SELECT
  USING (auth.uid() = id);

-- For admin operations, use service_role client on the backend instead of RLS
