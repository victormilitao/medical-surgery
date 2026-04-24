-- Add 'pending_return' to the allowed status values
ALTER TABLE surgeries DROP CONSTRAINT surgeries_status_check;
ALTER TABLE surgeries ADD CONSTRAINT surgeries_status_check
  CHECK (status = ANY (ARRAY['active'::text, 'completed'::text, 'cancelled'::text, 'pending_return'::text]));

-- Backfill: move existing completed surgeries to pending_return
UPDATE surgeries
SET status = 'pending_return', updated_at = now()
WHERE status = 'completed';
