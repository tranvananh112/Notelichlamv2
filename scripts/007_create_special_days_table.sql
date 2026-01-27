-- Create special_days table to store marked special days (Tet, holidays, etc.)
CREATE TABLE IF NOT EXISTS special_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL, -- 'tet', 'holiday', 'horse'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_special_days_user_date ON special_days(user_id, date);

-- Enable RLS
ALTER TABLE special_days ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own special days
CREATE POLICY "Users can manage their own special days"
  ON special_days
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
