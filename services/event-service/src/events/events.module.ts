import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { VaultService } from '../../../../shared/src/vault/vault.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService, VaultService],
})
export class EventsModule {}
