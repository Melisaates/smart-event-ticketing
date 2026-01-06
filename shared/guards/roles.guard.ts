import { CanActivate, ExecutionContext, UnauthorizedException, Injectable, ForbiddenException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
// Reflector is used to access metadata set by decorators
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { env } from "process";

@Injectable()
// RolesGuard checks if the user has the required roles to access a route
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        // Get the required roles from the metadata set by the Roles decorator
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            // If no roles are required, allow access
            return true;
        }
        // Get the user from the request object
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new UnauthorizedException('User not found in request');
        }
        const userRole = user.role;
        // Check if the user's role is included in the required roles
        if (requiredRoles.includes(userRole)) {
            return true;
        } else {
            throw new ForbiddenException('You do not have permission to access this resource');
        } 
          
    }
}

    