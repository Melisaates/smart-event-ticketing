import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketModule } from './ticket.module';

@Module({
  //the reason why is
  imports: [TicketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
