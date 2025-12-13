import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements onModuleInit, onModuleDestroy{

    constructor(){
        super({});
    }


    async onModuleInit(){
        await this.$connect();
    }

    async onModuleDestroy(){
        await this.$disconnect();
    }
}