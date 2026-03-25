-- Add follow_up_days column to surgeries table
-- Allows doctors to customize the follow-up period per surgery
-- Defaults to NULL; when NULL, the app falls back to surgery_types.expected_recovery_days
ALTER TABLE surgeries ADD COLUMN follow_up_days INTEGER;
