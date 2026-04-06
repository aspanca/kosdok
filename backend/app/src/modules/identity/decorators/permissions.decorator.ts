import { SetMetadata } from "@nestjs/common";

import { PermissionKey } from "../../../common/constants/permission.constants";

export const PERMISSIONS_KEY = "permissions";
export const Permissions = (...permissions: PermissionKey[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
