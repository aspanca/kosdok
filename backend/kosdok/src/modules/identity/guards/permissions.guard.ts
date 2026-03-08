import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { PermissionKey } from "../../../common/constants/permission.constants";
import { AuthUser } from "../../../common/types/auth-user.type";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionKey[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException("Authentication required");
    }

    const permissionSet = new Set(user.permissions);
    const hasAllPermissions = requiredPermissions.every((permission) =>
      permissionSet.has(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException("Missing required permissions");
    }

    return true;
  }
}
