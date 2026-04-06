import { PermissionKey, RoleKey } from "../../../common/constants/permission.constants";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  emailVerifiedAt: Date | null;
  roles: RoleKey[];
  permissions: PermissionKey[];
}
