INSERT INTO rooms (id, name)
VALUES ('room1', 'Demo Room')
ON CONFLICT (id) DO NOTHING;