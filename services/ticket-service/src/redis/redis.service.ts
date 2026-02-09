
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
    // Implementation for Redis interactions will go here
    constructor(
        private readonly redisClient: Redis
    ) {}

    async get(key: string): Promise<string | null> {
        return this.redisClient.get(key);
    }
    async set(key: string, value: string, ...args: any[]): Promise<"OK"> {
        return this.redisClient.set(key, value, ...args);
    }   
    async del(key: string): Promise<number> {
        return this.redisClient.del(key);
    }

}