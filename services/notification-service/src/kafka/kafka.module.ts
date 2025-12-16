import { Module } from '@nestjs/common';
import { KafkaConsumer } from './kafka.consumer';
import { RetryService } from './retry.service';
import { TicketPriceUpdatedHandler } from './handlers/ticket-price-updated.handler';
import { TicketCreatedHandler } from './handlers/ticket-created.handler';
import { KAFKA_HANDLERS } from './kafka.contants';

@Module({
  providers: [
    KafkaConsumer,
    RetryService,
    TicketCreatedHandler,
    TicketPriceUpdatedHandler,

    {
        // This factory will gather all handlers into an array
        
      provide: KAFKA_HANDLERS,
      useFactory: (
        ticketCreated: TicketCreatedHandler,
        ticketPriceUpdated: TicketPriceUpdatedHandler,
      ) => [
        ticketCreated,
        ticketPriceUpdated,
      ],
      inject: [
        TicketCreatedHandler,
        TicketPriceUpdatedHandler,
      ],
    },
  ],exports: [KafkaConsumer]
})
export class KafkaModule {}
