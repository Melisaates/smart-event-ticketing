import { Body, Controller, Put, Post } from "@nestjs/common";
import { EventService } from "./event.service";

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Put('price')
    async updatePrice(@Body() body: { eventId: string; newPrice: number }) {
        return this.eventService.updatePrice(body.eventId, body.newPrice);
    }
}
