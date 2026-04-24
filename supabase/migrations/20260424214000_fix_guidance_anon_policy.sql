-- Fix: Allow anon role to also read guidance tables
-- (migrations run as postgres but API uses anon/authenticated)

CREATE POLICY "Allow anon read surgery_type_signs"
  ON surgery_type_signs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon read surgery_type_phase_guidelines"
  ON surgery_type_phase_guidelines FOR SELECT
  TO anon
  USING (true);

-- Also add INSERT policy for postgres role to allow future seeds
CREATE POLICY "Allow service insert surgery_type_signs"
  ON surgery_type_signs FOR INSERT
  TO postgres
  WITH CHECK (true);

CREATE POLICY "Allow service insert surgery_type_phase_guidelines"
  ON surgery_type_phase_guidelines FOR INSERT
  TO postgres
  WITH CHECK (true);
