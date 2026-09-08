BEGIN;

ALTER TABLE quiz_attempts
  ADD COLUMN IF NOT EXISTS student_identity_key TEXT;

ALTER TABLE quiz_attempts
  ADD COLUMN IF NOT EXISTS identity_source TEXT;

CREATE INDEX IF NOT EXISTS quiz_attempts_identity_idx
  ON quiz_attempts (quiz_id, student_identity_key)
  WHERE student_identity_key IS NOT NULL;

COMMIT;
