import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// bcrypt means for hashing passwords
import * as bcrypt from 'bcryptjs';
// jwt means for generating JSON Web Tokens for authentication
import * as jwt from 'jsonwebtoken';
import e from 'express';
import { env } from 'process';
import { RefreshToken } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor   (private prisma : PrismaService, private usersService: UsersService) {}

  async login(loginDto: LoginDto) {

    const { email, password } = loginDto;

    // Find the user by email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if(!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateTokens(user.id, user.email);
    return { accessToken };
  }
  
  async register(registerDto : RegisterDto) {
    const {email, password, name} = registerDto;

    // Create the user
    const user = await this.usersService.createUser(
      email,
      password,
      name
    
    );
    return this.generateTokens(user.id, user.email);
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = jwt.sign(
      { userId: userId, email: email },
      env.JWT_SECRET,
      { expiresIn: Number(env.JWT_EXPIRES_IN) }
    );
    const refreshToken= jwt.sign(
      { userId: userId},
      env.REFRESH_TOKEN_SECRET,
      { expiresIn: Number(env.REFRESH_TOKEN_EXPIRES_IN) }
    );

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt: new Date(Date.now() + Number(env.REFRESH_TOKEN_EXPIRES_IN) * 1000)
      }
    });

    return { accessToken, refreshToken  };
  }

  // Refresh token method
  // It verifies the provided refresh token, and if valid, generates a new access token
   async refresh(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    } 
    // Verify the refresh token
    // what payload is doing here is extracting the userId and email from the token
    // so that we can use it to generate a new access token
    const payload: any = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);
    
    return this.generateTokens(payload.userId, payload.email);


  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });
  }

  
}
