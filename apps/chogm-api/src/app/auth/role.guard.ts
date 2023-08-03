import { EUserRole } from '@chogm2022/enums';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from '../utils/decorator/roles.decocorator';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<EUserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    const { user } = ctx.getContext().req;
    console.log('graphql guard user', user);
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
