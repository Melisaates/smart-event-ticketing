import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationController } from './notification.controller';
import { KafkaConsumer } from './kafka/kafka.consumer';
import { Kafka } from 'kafkajs';
import { ConfigModule } from '@nestjs/config';
import { RetryService } from './kafka/retry.service';
import { KAFKA_HANDLERS } from './kafka/kafka.contants';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    }),
    KafkaModule
    
  ],
  controllers: [AppController ],
  providers: [AppService ],
})
export class AppModule {}
