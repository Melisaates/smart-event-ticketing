import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [],
  controllers: [AppController, NotificationController],
  providers: [AppService],
})
export class AppModule {}
