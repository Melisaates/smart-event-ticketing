import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import Redis from "ioredis";

@Module({
    providers: [{
        provide: Redis,
        useFactory: () => {
            const Redis = require("ioredis");
            return new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT) || 6379,
            });
        }
    }],
    exports: [RedisService],
})
export class RedisModule {
}