import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { KafkaService } from 'src/kafka/kafka.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService,PrismaService,KafkaService],
})
export class TicketsModule {}
