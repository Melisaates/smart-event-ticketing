
import { KafkaService } from "../kafka.service";
import { PrismaService } from "prisma/prisma.service";
import { TicketStatus } from "@prisma/client";

export class EventCancelledConsumer {
    constructor(
        private kafkaService: KafkaService,
        private prismaService: PrismaService
    ) {
    }
    async onModuleInit() {
        await this.kafkaService.consume('event.cancelled', 'ticket-service-group',this.handleEventCancelled.bind(this));
    }
    private async handleEventCancelled(message: any) {
        const eventId = message.id;
        await this.prismaService.ticket.updateMany({
            where: { eventId },
            data: { status: TicketStatus.DISABLED },
        });
        console.log(`All tickets for event ${eventId} have been disabled.`);
    }
  
}