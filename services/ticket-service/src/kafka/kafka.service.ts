import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";



@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka= new Kafka({
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    private producer:Producer;
    async onModuleInit() {
        this.producer = this.kafka.producer();
        await this.producer.connect();
        // Initialize Kafka producer/consumer here
        console.log('KafkaService initialized');
    }

    async produce(topic: string, message: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }

    async consume(topic: string, groupId: string, handleMessage: (message: any) => Promise<void>) {
        const consumer = this.kafka.consumer({ groupId });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ message }) => {
                if (message.value) {
                    const parsedMessage = JSON.parse(message.value.toString());
                    await handleMessage(parsedMessage);
                }
            },
        });
    }
    

    async onModuleDestroy() {
        await this.producer.disconnect();
        // Clean up Kafka producer/consumer here
        console.log('KafkaService destroyed');
    }

}




















// import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
// import { Consumer, Kafka, logLevel } from "kafkajs";
// import { retry } from "rxjs/internal/operators/retry";


// @Injectable()
// export class TicketConsumer implements OnModuleInit, OnModuleDestroy {
//     private consumer: Consumer;
//     async onModuleInit() {

//         const kafka = new Kafka({
//             clientId: 'ticket-service',
//             brokers: ['localhost:9092'],
//             logLevel: logLevel.ERROR,
//         });

//         this.consumer = kafka.consumer({
//             groupId: 'ticket-service-group',
//             retry: {
//                 retries: 5
//             }
//         });

//         await this.consumer.connect();
//         console.log('🚀 Kafka consumer connected');

//         await this.consumer.subscribe({ topic: 'price-updated', fromBeginning: false });

//         await this.runConsumer();
//     }


//     private async runConsumer() {
//         await this.consumer.run({
//             autoCommit: true,
//             eachMessage: async ({ topic, partition, message }) => {
//                 try {
//                     const value = message.value.toString();
//                     const event = JSON.parse(value);
//                     console.log(
//                         `📥 [TicketService Received] ${topic} →`,
//                         event
//                     ); this.processPriceUpdate(event);

//                 } catch (error) {
//                     console.error('❌ Error processing message:', error);

//                 }
//             }
//         });
//     }

//     async onModuleDestroy() {
//         await this.consumer.disconnect();
//     }

//     async processPriceUpdate(event: any) {
//         const { eventId, newPrice } = event;
//         console.log(`Processing price update for event ${eventId} with new price ${newPrice}`);
//     }
// }
   

