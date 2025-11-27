
ALTER TABLE tutor_applications
ADD COLUMN rejection_reason TEXT,
ADD COLUMN notified BOOLEAN DEFAULT FALSE;
