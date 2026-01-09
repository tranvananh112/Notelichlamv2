-- Add timestamp column to notes table
ALTER TABLE notes ADD COLUMN IF NOT EXISTS timestamp TEXT;

-- Update existing records with timestamp from created_at
UPDATE notes 
SET timestamp = TO_CHAR(created_at AT TIME ZONE 'Asia/Ho_Chi_Minh', 'HH24:MI:SS')
WHERE timestamp IS NULL;

-- Add comment
COMMENT ON COLUMN notes.timestamp IS 'Display timestamp in local time format (HH:MM:SS)';
