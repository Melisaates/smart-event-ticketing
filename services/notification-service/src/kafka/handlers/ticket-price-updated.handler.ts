import { KafkaHandler } from "./kafka-handler.interface";



export class TicketPriceUpdatedHandler implements KafkaHandler {
    topic = 'ticket.price.updated';
    //private failNext = false; // Test amaçlı hata oluşturmak için

    async execute(message: any): Promise<void> {    
        const ticket = JSON.parse(message);

        console.log(`📩 [${this.topic}] Ticket price updated for ID: ${ticket.id}, New Price: ${ticket.price}`);
        // Here you can add logic to send notification about the ticket price update
    }
    
        //for test purposes failing

    //        if (this.failNext) {
    //   this.failNext = false; // bir sonraki denemede geçecek
    //   throw new Error('Random failure occurred while processing ticket price update');
    // }



  

    // console.log(`✅ [${this.topic}] Successfully processed ticket price update for ID: ${ticket.id}`);
}