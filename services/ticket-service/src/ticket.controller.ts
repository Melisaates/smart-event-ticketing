import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('buy')
  async buyTicket(@Body() body: { ticketId: string; userId: string }) {
    return this.ticketService.publishTicketPurchasedEvent(body.ticketId, body.userId);

  }
   
  // @Post('update')
  // async updateTicket(@Body() body: { ticketId: string; oldPrice: number; newPrice: number }) {
    
  //   return this.ticketService.publishPriceUpdatedEvent(body.ticketId, body.oldPrice, body.newPrice);
  // }

}
