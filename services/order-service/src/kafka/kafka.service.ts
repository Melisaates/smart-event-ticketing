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

        console.log('KafkaService initialized');
    }
    async produce(topic: string, message: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }
    async onModuleDestroy() {
        await this.producer.disconnect();
        console.log('KafkaService destroyed');
    }
    
}
    