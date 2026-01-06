import { Injectable } from "@nestjs/common";

@Injectable()
export class RedisService {
    private redis = require("redis").createClient({
        url: process.env.REDIS_URL,
    }); 
    constructor() {
        this.redis.connect();
        this.redis.on("error", (err) => console.log("Redis Client Error", err));
    }
    async get(key: string): Promise<string | null> {
        return await this.redis.get(key);
    }

    async set(key: string, value: string, ...args: any[]): Promise<void> {
        await this.redis.set(key, value, ...args);
    }
    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }
    async flushAll(): Promise<void> {
        await this.redis.flushAll();
    }
}