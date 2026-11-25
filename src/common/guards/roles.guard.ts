import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";

import { ROLES_KEY } from "../decorators/roles.decorator.js";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // Si la ruta no especifica roles, permite el acceso.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: {
        rol?: string;
      };
    }>();

    const user = request.user;

    // Si no existe un usuario autenticado, rechaza el acceso.
    if (!user || !user.rol) {
      return false;
    }

    // Comprueba si el rol del usuario está autorizado.
    return requiredRoles.includes(user.rol);
  }
}