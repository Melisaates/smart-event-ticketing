import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [OrderModule,KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
