-- Add completed column to notes table
ALTER TABLE notes 
ADD COLUMN completed BOOLEAN DEFAULT FALSE;

-- Add index for better performance when filtering completed notes
CREATE INDEX idx_notes_completed ON notes(user_id, date, completed);

-- Update existing records to set completed = false by default
UPDATE notes SET completed = FALSE WHERE completed IS NULL;