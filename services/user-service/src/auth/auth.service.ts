import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
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

    // Generate a JWT token. why: because after login we need to give token to user for further request
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET ,
      { expiresIn: Number (env.JWT_EXPIRES_IN) }
    )
    return { accessToken };
  }
  
  async register(registerDto : RegisterDto){
    const {name, email , password} = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where :{ email } });
    if (existingUser) {
      throw new UnauthorizedException( 'User already exists' );
  }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })
  }

  generate_token(user,userId,expiresIn):
    accessToken 
    RefreshToken(
      user,
      userId
    )

  
}
