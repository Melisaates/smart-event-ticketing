import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create (email:string,password:string,name:string){
    const existingUser = this.prisma.user.findUnique({where:{email}})
    if (existingUser){
      throw new Error ('User with this email already exists'); 
    }

    const hashedPassword= await bcrypt.hash(password,10);
    
    return this.prisma.user.create({
      data:{
        email,
        password: hashedPassword,
        name
      }
    });
  }


  findByEmail(email:string){
    return this.prisma.user.findUnique({where:{email}});
  }

  findById(id:string){
    return this.prisma.user.findUnique({where:{id}});
  }
  

  findAll() {
    return this.prisma.user.findMany({select : {id: true, name: true, email: true}});
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({where: {id}});
  }

 
}
