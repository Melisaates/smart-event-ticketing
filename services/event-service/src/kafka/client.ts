import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka,Consumer,Producer, logLevel } from "kafkajs";
import { delay } from "rxjs/internal/operators/delay";
import { KAFKA_BROKERS } from "src/config";

@Injectable()
export class KafkaClient implements OnModuleInit {
  private producer: Producer;
  private consumer: Consumer;


async onModuleInit() {
  const kafka = new Kafka({
  clientId: 'event-service',
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 300,// Initial wait time before retrying
    retries: 5,        // Number of retry attempts
  }
  
  
});

    this.producer = kafka.producer();
  }

  private async retryOperation<T>(operation, retries: number, delay: number): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries === 0) throw error;
      console.error(`Operation failed. Retrying in ${delay}ms...(${retries} tries left)`, error);
      await new Promise(res => setTimeout(res, delay));
      return this.retryOperation(operation, retries - 1, delay * 2);
    }
}


async emit(topic: string, data: any): Promise<void> {
  return this.retryOperation(
    () => this.producer.send({ topic, messages:[{ value: JSON.stringify(data)}] }),
    5,    // Number of retries
    300   // Initial delay in ms
  );
      console.log('💬 Kafka message sent:', topic);}


}

// export async function createProducer(): Promise<Producer> {
//   const producer = kafka.producer({
//     allowAutoTopicCreation: false,
//   });
//   await producer.connect();
//   return producer;
// }


// export async function createConsumer(groupId: string): Promise<Consumer> {
//     const consumer = kafka.consumer({ groupId: 'event-service-group' });
//     await consumer.connect();
//     return consumer;

// }

