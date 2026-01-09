-- Create users table with admin flag
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  text TEXT NOT NULL,
  type TEXT DEFAULT 'note',
  color TEXT DEFAULT 'blue',
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create payroll history table
CREATE TABLE IF NOT EXISTS public.payroll_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  paid_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create work tracking table
CREATE TABLE IF NOT EXISTS public.work_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  days_worked INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Admin can view all users" ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- RLS Policies for notes table
CREATE POLICY "Users can view own notes" ON public.notes FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.notes FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.notes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for payroll_history
CREATE POLICY "Users can view own payroll" ON public.payroll_history FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payroll" ON public.payroll_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for work_tracking
CREATE POLICY "Users can view own work tracking" ON public.work_tracking FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own work tracking" ON public.work_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own work tracking" ON public.work_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for auto-creating user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, is_admin)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'is_admin', 'false')::boolean
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
