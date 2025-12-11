import { Module } from "@nestjs/common";
import e from "express";
import { TicketService } from "./ticket.service";



@Module(
     {
    imports: [ 
        ClientsModule.register([
            {
                name: 'KAFKA_PRODUCER',
                transport: Transport.kafka,
                options: {
                    client: {
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        allowAutoTopicCreation: false
                    },
                },
            },
        ])
    ],
    controllers: [TicketService],
    providers: [TicketService],
     }
) export class TicketModule {}
