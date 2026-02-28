-- name: GetUserByEmail :one
SELECT id, email
FROM users
WHERE email = ?
LIMIT 1;

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
