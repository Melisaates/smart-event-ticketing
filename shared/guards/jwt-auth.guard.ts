import * as jwt from 'jsonwebtoken';
import {CanActivate,ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  // This method checks if the incoming request has a valid JWT token
  canActivate(context: ExecutionContext): boolean {
    // Extract the JWT token from the Authorization header
    const request = context.switchToHttp().getRequest();
    // The Authorization header should be in the format "Bearer <token>"
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }           
    try {
      const payload: any = jwt.verify(token, env.JWT_SECRET);
      request.user = payload;
        return true;
    } catch (err) {
        throw new UnauthorizedException('Invalid or expired token');
    }
    }
}

