import { Injectable } from "@nestjs/common";


@Injectable ()
export class EventClient {
    private EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL;
    async validateEvent(eventId: string): Promise<boolean> {
        try {
            await fetch(`${this.EVENT_SERVICE_URL}/events/${eventId}`);
            return true;
        }   catch (error) {
            return false;
        }

    }
}