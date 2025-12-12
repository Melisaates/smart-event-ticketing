import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Consumer, Kafka, logLevel } from "kafkajs";
import { retry } from "rxjs/internal/operators/retry";


@Injectable()
export class TicketConsumer implements OnModuleInit, OnModuleDestroy {
    private consumer: Consumer;
    async onModuleInit() {

        const kafka = new Kafka({
            clientId: 'ticket-service',
            brokers: ['localhost:9092'],
            logLevel: logLevel.ERROR,
        });

        this.consumer = kafka.consumer({
            groupId: 'ticket-service-group',
            retry: {
                retries: 5
            }
        });

        await this.consumer.connect();
        console.log('🚀 Kafka consumer connected');

        await this.consumer.subscribe({ topic: 'price-updated', fromBeginning: false });

        await this.runConsumer();
    }


    private async runConsumer() {
        await this.consumer.run({
            autoCommit: true,
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const value = message.value.toString();
                    const event = JSON.parse(value);
                    console.log(
                        `📥 [TicketService Received] ${topic} →`,
                        event
                    ); this.processPriceUpdate(event);

                } catch (error) {
                    console.error('❌ Error processing message:', error);

                }
            }
        });
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
    }

    async processPriceUpdate(event: any) {
        const { eventId, newPrice } = event;
        console.log(`Processing price update for event ${eventId} with new price ${newPrice}`);
    }
}
   

