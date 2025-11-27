CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Enable insert access for authenticated users" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for authenticated users" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for authenticated users" ON notifications
  FOR DELETE USING (auth.uid() = user_id);
