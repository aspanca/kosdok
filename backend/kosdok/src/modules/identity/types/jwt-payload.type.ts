import { PermissionKey, RoleKey } from "../../../common/constants/permission.constants";

export interface JwtPayload {
  sub: string;
  email: string;
  roles: RoleKey[];
  permissions: PermissionKey[];
  tokenType?: "access" | "refresh";
}
