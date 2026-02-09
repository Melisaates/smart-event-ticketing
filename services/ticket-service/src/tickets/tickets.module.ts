import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { KafkaService } from 'src/kafka/kafka.service';
import { VaultService } from '../../../../shared/src/vault/vault.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService,PrismaService,KafkaService, VaultService],
})
export class TicketsModule {}
