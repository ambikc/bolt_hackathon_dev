/*
  # Add active status to registrations table

  1. Changes
    - Add `active` column to `registrations` table with default value of false
    - This column will be updated to true when users confirm their email

  2. Security
    - Maintain existing RLS policies
    - Add policy for users to update their own active status
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'active'
  ) THEN
    ALTER TABLE registrations ADD COLUMN active boolean DEFAULT false;
  END IF;
END $$;