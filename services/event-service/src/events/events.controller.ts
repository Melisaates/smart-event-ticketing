import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Invoke-RestMethod -Uri "http://localhost:3002/events" -Method POST -Headers @{"Content-Type"="application/json"} -Body (ConvertTo-Json @{title="Concert";description="Music concert";date="2024-12-01T20:00:00Z";location="Stadium";capacity=5000})
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()// Invoke-RestMethod -Uri "http://localhost:3002/events" -Method GET
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')// Invoke-RestMethod -Uri "http://localhost:3002/events/1" -Method GET
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')// Invoke-RestMethod -Uri "http://localhost:3002/events/1" -Method PATCH -Headers @{"Content-Type"="application/json"} -Body (ConvertTo-Json @{title="Updated Concert";capacity=6000})
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id') // Invoke-RestMethod -Uri "http://localhost:3002/events/1" -Method DELETE
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
