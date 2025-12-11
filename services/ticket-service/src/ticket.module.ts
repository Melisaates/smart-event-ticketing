import { Module } from "@nestjs/common";
import e from "express";
import { TicketService } from "./ticket.service";
import { ClientsModule, Transport } from "@nestjs/microservices";



@Module(
    {
        imports: [
            ClientsModule.register([
                {
                    name: 'KAFKA_PRODUCER',
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            brokers: ['localhost:9092'],
                        },
                        producer: {
                            allowAutoTopicCreation: false
                        },
                    },
                },
            ])
        ],
        controllers: [TicketService],
        providers: [TicketService],
    }
) export class TicketModule { }
