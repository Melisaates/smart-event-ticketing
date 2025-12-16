import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  

  findAll() {
    return this.prisma.user.findMany({select : {id: true, name: true, email: true}});
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({where: {id}});
  }

 
}
