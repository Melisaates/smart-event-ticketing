

export interface KafkaHandler {
    topic: string;
    execute(message: any): Promise<void>;// execute method to process the message
}