import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userServicese: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    interface CusRequest extends Request {
      user?: any;
    }

    const request: CusRequest = context.switchToHttp().getRequest();

    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>('permissions', [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (requiredPermissions.length === 0) {
      return true;
    }

    // const [, token] = request.headers.authorization?.split(' ') ?? [];
    const permissionNames = await this.userServicese.findPermissionNames(request.user);

    const isContainedPermission = requiredPermissions.every((item) =>
      permissionNames.includes(item)
    );
    if (!isContainedPermission) {
      throw new ApiException('权限不足', ApiErrorCode.Forbidden);
    }

    return true;
  }
}
