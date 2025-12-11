import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UpdateTicketDto } from './dtos/update-ticket.dto';
import { timestamp } from 'rxjs';

//This code that publishes events to Kafka
//So, we added producer for Kafka in the TicketService
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
@Injectable()
export class TicketService {
    constructor(
        @Inject(KAFKA_PRODUCER)
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

}