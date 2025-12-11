import { Controller } from "@nestjs/common";
import { Ctx, MessagePattern, Payload } from "@nestjs/microservices";


@Controller()
export class NotificationController {
    // Here, you would typically inject a service to handle the notification logic
    @MessagePattern('ticket-events')
    async handleTicketEvents(@Payload() message: any, @Ctx() context: any) {
         try {
            // KafkaContext ile orijinal message alınır
            const message = context.getMessage();
            const event = message.value

            console.log('📩 Event received:', event);
            

        } catch (err) {
            console.error('⚠️ Error processing message:', err);
        }
        // Process the incoming event data
    }
}
