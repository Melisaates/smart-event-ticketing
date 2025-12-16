import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { RetryService } from './retry.service';
import { KafkaHandler } from './handlers/kafka-handler.interface';
import { KAFKA_HANDLERS } from './kafka.contants';

//the reason why we use Injectable is to be able to inject this class as a provider in app.module.ts
@Injectable()
export class KafkaConsumer implements OnModuleInit, OnModuleDestroy {

    private kafka = new Kafka({
        clientId: 'notification-service',
        brokers: [process.env.KAFKA_BROKER!],
    })
    private kafkaConsumer = this.kafka.consumer({ groupId: 'notification-group' });

    constructor(
        private readonly retryService: RetryService,
        @Inject(KAFKA_HANDLERS)
        private readonly kafkaHandlers: KafkaHandler[]
    ) { }

    async onModuleInit() {
        await this.kafkaConsumer.connect();
        console.log('🔥 KafkaConsumer onModuleInit ÇALIŞTI');


        for (const handler of this.kafkaHandlers) {

            //fromBeginning: false to start consuming only new messages
            //fromBeginning: true to consume all messages from the beginning
            await this.kafkaConsumer.subscribe({ topic: handler.topic, fromBeginning: false });
        }



        // Consuming messages with manual offset management
        await this.kafkaConsumer.run({
            autoCommit: false, // disable auto commit to manage offsets manually
            eachMessage: async ({ topic, partition, message }) => {
                const handler = this.kafkaHandlers.find(h => h.topic === topic);
                if (!handler) return;

                // Using retry service to handle transient failures
                await this.retryService.execute(
                    () =>  handler.execute(message.value?.toString()),
                        3, // maxRetries
                        1000 // delay in ms

                );

                await this.kafkaConsumer.commitOffsets(
                    [{
                        topic,
                        partition,
                        offset: (Number(message.offset) + 1).toString()
                    }]
                );
            }
        });


    }


    async onModuleDestroy() {
        await this.kafkaConsumer.disconnect();
    }

}