import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketModule } from './ticket.module';
import { TicketsModule } from './tickets/tickets.module';
import { KafkaModule } from './kafka/kafka.module';
import Redis from 'ioredis';
import { RedisModule } from './redis/redis.module';

@Module({
  //the reason why is
  imports: [KafkaModule, TicketModule,RedisModule,TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}