import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class EventService implements OnModuleInit {
    constructor(
        private readonly kafkaClient: ClientKafka
    ) {}

    async onModuleInit() {
        await this.kafkaClient.connect();
        this.producer = await this.kafkaClient.createProducer();
    }

    async updatePrice(eventId: string, oldPrice: number, newPrice: number) {
        const eventPayload = {
            eventId,
            oldPrice,
            newPrice,
            timestamp: Date.now(),
        };
        await this.kafkaClient.send(
            
            {
            topic: 'event.price.updated',
            messages: [{
                key : eventId,
                //JSON stringify the event object to convert it into a string format suitable for transmission
                value: JSON.stringify(eventPayload) }],
        });
        return {"message": "Price updated and event published", eventPayload};
    }       
}