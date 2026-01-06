import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { TicketService } from './ticket.service';
import { RouterModule } from '@nestjs/core';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('buy')
  async buyTicket(@Body() body: { ticketId: string; userId: string }) {
    return this.ticketService.publishTicketPurchasedEvent(body.ticketId, body.userId);

  }
   d
  @Post(':id/reserve')
  async reserveTicket(@Param('id') ticketId: string) {
    return this.ticketService.reserveTicket(ticketId);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('update')
  async updateTicket(@Body() body: { ticketId: string; oldPrice: number; newPrice: number }) {
    
    return this.ticketService.publishUpdatePrice({ticketId: body.ticketId, newPrice: body.newPrice});
  }

}


