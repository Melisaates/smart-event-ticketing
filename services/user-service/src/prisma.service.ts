import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Prisma from "@prisma/client";

@Injectable()
export class PrismaService extends Prisma implements OnModuleInit, OnModuleDestroy {

  constructor() {
    super({
      datasourceUrl: process.env.DATABASE_URL, // Prisma 7 gereği
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
