import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [EventModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
