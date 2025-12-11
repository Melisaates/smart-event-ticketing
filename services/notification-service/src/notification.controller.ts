import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";


@Controller()
export class NotificationController {
    // Here, you would typically inject a service to handle the notification logic
    @MessagePattern('ticket-events')
    async handleTicketEvents(@Payload() message: any) {
        // Process the incoming event data
    console.log('📩 Event received:', message.value);
    }
}
