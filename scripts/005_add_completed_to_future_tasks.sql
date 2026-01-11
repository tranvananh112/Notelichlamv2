-- Add completed column to future_tasks table
ALTER TABLE future_tasks 
ADD COLUMN completed BOOLEAN DEFAULT FALSE;

-- Add index for better performance when filtering completed tasks
CREATE INDEX idx_future_tasks_completed ON future_tasks(user_id, date, completed);

-- Update existing records to set completed = false by default
UPDATE future_tasks SET completed = FALSE WHERE completed IS NULL;