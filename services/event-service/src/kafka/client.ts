// kafka/client.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, logLevel } from 'kafkajs';
import { KAFKA_BROKERS, PRICE_DLQ } from 'src/config';

@Injectable()
export class KafkaClient implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'event-service',
      brokers: KAFKA_BROKERS,
      logLevel: logLevel.ERROR,
      retry: {
        retries: 5,
        initialRetryTime: 300,
      }
    });

    this.producer = kafka.producer({
      allowAutoTopicCreation: false,
    });

    await this.producer.connect();
    console.log('🚀 Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  private async retryOperation<T>(operation, retries = 5, wait = 300): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries === 0) {
        console.error('❌ Producer failed completely → sending to DLQ');

        await this.producer.send({
          topic: PRICE_DLQ,
          messages: [{ value: JSON.stringify({ error: error.message }) }],
        });

        throw error;
      }

      console.warn(`⚠️ Retry... Left: ${retries} (wait ${wait}ms)`);
      await new Promise((res) => setTimeout(res, wait));

      return this.retryOperation(operation, retries - 1, wait * 2);
    }
  }

  async emit(topic: string, data: any) {
    return this.retryOperation(async () => {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(data) }],
      });

      console.log(`📤 Event sent → ${topic}`);
    });
  }
}
