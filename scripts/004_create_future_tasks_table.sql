-- Create future_tasks table for storing planned tasks
CREATE TABLE IF NOT EXISTS public.future_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  text TEXT NOT NULL,
  color TEXT DEFAULT 'blue',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'planning',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.future_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for future_tasks table
CREATE POLICY "Users can view own future tasks" ON public.future_tasks FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own future tasks" ON public.future_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own future tasks" ON public.future_tasks FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own future tasks" ON public.future_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER future_tasks_updated_at
  BEFORE UPDATE ON public.future_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comment
COMMENT ON TABLE public.future_tasks IS 'Store future planned tasks for users';