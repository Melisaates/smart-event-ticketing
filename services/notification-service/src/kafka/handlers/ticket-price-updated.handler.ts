import { KafkaHandler } from "./kafka-handler.interface";



export class TicketPriceUpdatedHandler implements KafkaHandler {
    topic = 'ticket.price.updated';

    async execute(message: any): Promise<void> {    
        const ticket = JSON.parse(message);
        console.log(`📩 [${this.topic}] Ticket price updated for ID: ${ticket.id}, New Price: ${ticket.price}`);
        // Here you can add logic to send notification about the ticket price update
    }
}