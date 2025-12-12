import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Kafka, Partitioners } from "kafkajs";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { KafkaClient } from "./kafka/client";

@Module({

    imports: [
        
        // ClientsModule.register([
        //     {
        //         name: 'KAFKA_PRODUCER',
        //         transport: Transport.KAFKA,
        //         options: {
        //             client: {
        //                 client_id: 'event-service',
        //                 brokers: ['localhost:9092'],
        //                 createPartitioner: Partitioners.LegacyPartitioner,
        //             },
        //             producer: {
        //                 producer_id: 'event-service-producer',
        //                 allowAutoTopicCreation: false
        //             },
        //         },
        //     },
        // ])
    ],
    controllers: [EventController],
    providers: [EventService, KafkaClient],

})
export class EventModule {

}