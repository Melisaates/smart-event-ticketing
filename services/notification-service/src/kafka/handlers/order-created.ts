import { KafkaHandler } from "./kafka-handler.interface";



export class OrderCreatedHandler implements KafkaHandler {
    topic = 'order.created';

    async execute(message: any): Promise<void> {
        const order = JSON.parse(message);
        console.log(`📩 [${this.topic}] Order created with ID: ${order.id}, User ID: ${order.userId}, Total: ${order.total}`);
    }
}