BEGIN;

CREATE TABLE IF NOT EXISTS admin_click_events (
  id UUID PRIMARY KEY,
  action TEXT NOT NULL CHECK (action IN ('MANUAL','AI','READY')),
  anonymous_key TEXT NOT NULL,
  teacher_id UUID,
  path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_click_action_created_idx
  ON admin_click_events (action, created_at DESC);

CREATE INDEX IF NOT EXISTS admin_click_visitor_created_idx
  ON admin_click_events (anonymous_key, created_at DESC);

COMMIT;
