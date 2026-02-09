import { Injectable, UseGuards } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'prisma/prisma.service';
import { KafkaClient } from 'src/kafka/client';
import { RedisService } from 'src/redis/redis.service';
// import { Roles } from '../../../shared/decorators/roles.decorator';
// import { RolesGuard } from '../../../shared/guards/roles.guard';

@Injectable()
export class EventsService {

  constructor(private prisma : PrismaService, private kafka: KafkaClient, private redisService: RedisService) {}

  async create(createEventDto: CreateEventDto) {
    const {title, date, location, description} = createEventDto;

    const existingEvent = await this.prisma.event.findFirst({
      // this means to check if event with same title, date and location already exists
      where: {
        title,
        date,
        location
      }
    });

    if (existingEvent) {
      throw new Error('Event with same title, date and location already exists');
    }
    //queue = db write , cache set, event emit
    const event = await this.prisma.event.create({data: createEventDto});
    this.redisService.set(`event:${event.id}`, JSON.stringify(event), 'EX', 3600);

    this.kafka.emit('event.created', event);
    return event;
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  async findOne(id: string) {
    const cacheKey = `event:${id}`;

    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const event = await this.prisma.event.findUnique({where: {id}});
    if(!event){
      throw new Error('Event not found');
    }
    await this.redisService.set(cacheKey, JSON.stringify(event));
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.update({where: {id}, data: updateEventDto})
    this.redisService.set(`event:${id}`, JSON.stringify(event), 'EX', 3600);
    return event;

  }

  remove(id: string) {
    this.redisService.del(`event:${id}`);
    return this.prisma.event.delete({where: {id}});
  }

  //MUST CHANGE DESCRIPTION TO STATUS
  async cancelEvent(id: string) {
    const event = await this.prisma.event.update({
      where: {id},
      data: {description: 'CANCELLED'},
    });
    this.redisService.del(`event:${id}`);
    await this.kafka.emit('event.cancelled', event);
    return event;
  }
}
