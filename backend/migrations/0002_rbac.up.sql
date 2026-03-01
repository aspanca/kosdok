CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL,
  role_id INTEGER NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INTEGER NOT NULL,
  permission_id INTEGER NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
);

INSERT INTO roles (name) VALUES ('patient') ON CONFLICT(name) DO NOTHING;
INSERT INTO roles (name) VALUES ('clinic_admin') ON CONFLICT(name) DO NOTHING;
INSERT INTO roles (name) VALUES ('admin') ON CONFLICT(name) DO NOTHING;

INSERT INTO permissions (key) VALUES ('auth:me:read') ON CONFLICT(key) DO NOTHING;
INSERT INTO permissions (key) VALUES ('patient:read') ON CONFLICT(key) DO NOTHING;
INSERT INTO permissions (key) VALUES ('patient:write') ON CONFLICT(key) DO NOTHING;
INSERT INTO permissions (key) VALUES ('user:role:assign') ON CONFLICT(key) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.key = 'auth:me:read'
WHERE r.name = 'patient'
ON CONFLICT(role_id, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.key IN ('auth:me:read', 'patient:read', 'patient:write')
WHERE r.name = 'clinic_admin'
ON CONFLICT(role_id, permission_id) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.key IN ('auth:me:read', 'patient:read', 'patient:write', 'user:role:assign')
WHERE r.name = 'admin'
ON CONFLICT(role_id, permission_id) DO NOTHING;
