import { Module } from "@nestjs/common";
import e from "express";
import { TicketService } from "./ticket.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TicketController } from "./ticket.controller";
import { Partitioners } from "kafkajs";
//import { TicketConsumer } from "./kafka/kafka.service";



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
                            createPartitioner: Partitioners.LegacyPartitioner,

                        },
                        producer: {
                            allowAutoTopicCreation: false
                        },
                    },
                },
            ])
        ],
        controllers: [TicketController],
        providers: [TicketService],
    }
) export class TicketModule { }
