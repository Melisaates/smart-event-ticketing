import { KafkaHandler } from "./kafka-handler.interface";


export class TicketCreatedHandler implements KafkaHandler {
    topic = 'ticket.created';

    async execute(message: any): Promise<void> {
        const ticket = JSON.parse(message);
        console.log(`📩 [${this.topic}] Ticket created with ID: ${ticket.id}, Event ID: ${ticket.eventId}, Price: ${ticket.price}`);
        // Here you can add logic to send notification about the ticket creation
    }
}