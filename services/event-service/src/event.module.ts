import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Partitioners } from "kafkajs";

@Module({

    imports: [
        ClientsModule.register([
            {
                name: 'KAFKA_PRODUCER',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        client_id: 'event-service',
                        brokers: ['localhost:9092'],
                        createPartitioner: Partitioners.LegacyPartitioner,
                    },
                    producer: {
                        producer_id: 'event-service-producer',
                        allowAutoTopicCreation: false
                    },
                },
            },
        ])
    ],
    controllers: [EventController],
    providers: [EventService],

})
export class EventModule {

}