-- Add a unique constraint on phone for non-null, non-empty values.
-- This allows multiple profiles to have NULL or empty phone,
-- but prevents two profiles from sharing the same valid phone number.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique
  ON profiles (phone)
  WHERE phone IS NOT NULL AND phone <> '';
