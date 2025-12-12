import { Injectable } from "@nestjs/common";
import { KafkaClient } from "./kafka/client";

@Injectable()
export class EventService {
  constructor(private readonly kafkaClient: KafkaClient) {}

  async updatePrice(eventId: string, newPrice: number) {
    await this.kafkaClient.emit('price-updated', {
      eventId,
      newPrice,
      timestamp: Date.now(),
    });

    return { status: 'ok' };
  }
}