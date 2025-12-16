import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()// Invoke-RestMethod -Method Post -Uri http://localhost:3001/tickets -Headers @{"Content-Type"="application/json"} -Body '{"eventId":"Concert","price":50,"seatNumber":"A1"}'
  async create(@Body() body: CreateTicketDto) {
    return this.ticketsService.create(body);

  }

  @Get()// Invoke-RestMethod -Method Get -Uri http://localhost:3001/tickets
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id') // Invoke-RestMethod -Method Get -Uri http://localhost:3001/tickets/{id}
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id') // Invoke-RestMethod -Method Patch -Uri http://localhost:3001/tickets/{id} -Headers @{"Content-Type"="application/json"} -Body '{"price":60,"TicketStatus":"SOLD"}'
  update(@Param('id') id: string, @Body() body: UpdateTicketDto) {
    return this.ticketsService.update(id, body);
  }

  @Delete(':id') // Invoke-RestMethod -Method Delete -Uri http://localhost:3001/tickets/{id}
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
