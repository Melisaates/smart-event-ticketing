import { Module } from "@nestjs/common";
import { KafkaService } from "./kafka.service";
import { EventCancelledConsumer } from "./consumers/event-cancelled.consumer";



@Module({
    providers: [KafkaService,
        EventCancelledConsumer
    ],
    exports: [KafkaService]
})
export class KafkaModule {
    
}