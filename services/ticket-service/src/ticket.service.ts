import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices/client/client-kafka';
import { timestamp } from 'rxjs';

//This code that publishes events to Kafka
//So, we added producer for Kafka in the TicketService
@Injectable()
export class TicketService {
  
    constructor(
        @Inject('KAFKA_PRODUCER')
        private readonly kafka: ClientKafka
    ) {}

   async onModuleInit (){
        await this.kafka.connect();
   }

   async publishTicketPurchasedEvent(ticketId : string, userId: string) {
        const event = {
            type: 'TicketPurchased',
            ticketId,
            userId,
            timestamp: Date.now(),
    };
    // Publish the event to Kafka
    // After publishing, return the event object. 
    // This allows other parts of the application to use the event data if needed.
        await this.kafka.emit('ticket-events', event);
        return event;

    }

    publishPriceUpdatedEvent(data :{ticketId: string, oldPrice: number, newPrice: number}) {
        const event = {
            type: 'PriceUpdated',
            ticketId: data.ticketId,
            oldPrice: data.oldPrice,
            newPrice: data.newPrice,
            timestamp: Date.now(),
    };
        // Publish the event to Kafka
        this.kafka.emit('ticket-events', event);
        return event;

  }
    

}