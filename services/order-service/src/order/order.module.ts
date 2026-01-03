import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Kafka } from 'kafkajs';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
