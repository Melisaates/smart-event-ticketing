import { Injectable } from "@nestjs/common";

@Injectable()
export class TicketClient {
    private TICKET_SERVICE_URL = process.env.TICKET_SERVICE_URL;
    async getTicket(ticketId: string): Promise<any> {
        try {
            const response = await fetch(`${this.TICKET_SERVICE_URL}/tickets/${ticketId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch ticket');
            }
            return await response.json();
        } catch (error) {
            throw new Error('Ticket service is unavailable');
        }
    }
}