import { PermissionKey, RoleKey } from "../constants/permission.constants";

export interface AuthUser {
  id: string;
  email: string;
  roles: RoleKey[];
  permissions: PermissionKey[];
}
