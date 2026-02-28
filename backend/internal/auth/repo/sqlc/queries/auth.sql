-- name: CreateUser :exec
INSERT INTO users (id, email, password_hash, created_at, updated_at)
VALUES (?, ?, ?, ?, ?);

-- name: GetUserByEmail :one
SELECT id, email
FROM users
WHERE email = ?
LIMIT 1;

-- name: GetUserCredentialsByEmail :one
SELECT id, email, password_hash
FROM users
WHERE email = ?
LIMIT 1;

-- name: GetRoleIDByName :one
SELECT id
FROM roles
WHERE name = ?
LIMIT 1;

-- name: AddUserRole :exec
INSERT INTO user_roles (user_id, role_id)
VALUES (?, ?);

-- name: CreateRefreshToken :exec
INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, revoked_at, created_at)
VALUES (?, ?, ?, ?, NULL, ?);

-- name: GetRolesByUserID :many
SELECT r.name
FROM roles r
INNER JOIN user_roles ur ON ur.role_id = r.id
WHERE ur.user_id = ?
ORDER BY r.name ASC;

-- name: GetPermissionsByUserID :many
SELECT DISTINCT p.key
FROM permissions p
INNER JOIN role_permissions rp ON rp.permission_id = p.id
INNER JOIN user_roles ur ON ur.role_id = rp.role_id
WHERE ur.user_id = ?
ORDER BY p.key ASC;
