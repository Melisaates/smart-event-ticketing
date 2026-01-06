import { Injectable, UseGuards } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { KafkaClient } from 'src/kafka/client';
// import { Roles } from '../../../shared/decorators/roles.decorator';
// import { RolesGuard } from '../../../shared/guards/roles.guard';

@Injectable()
export class EventsService {

  constructor(private prisma : PrismaService, private kafka: KafkaClient) {}

  async create(createEventDto: CreateEventDto) {
    const {title, date, location, description} = createEventDto;
    const existingEvent = this.prisma.event.findFirst({
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
    const event = await this.prisma.event.create({data: createEventDto});
    this.kafka.emit('event.created', event);
    return event;
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  findOne(id: string) {
    return this.prisma.event.findUnique({where: {id}});
  }

  // @Roles('ADMIN')
  // @UseGuards(RolesGuard, )
  update(id: string, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({where: {id}, data: updateEventDto});
  }

  remove(id: string) {
    return this.prisma.event.delete({where: {id}});
  }

  //MUST CHANGE DESCRIPTION TO STATUS
  async cancelEvent(id: string) {
    const event = await this.prisma.event.update({
      where: {id},
      data: {description: 'CANCELLED'},
    });
    await this.kafka.emit('event.cancelled', event);
    return event;
  }
}
