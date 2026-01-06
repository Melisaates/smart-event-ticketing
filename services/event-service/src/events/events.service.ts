import { Injectable, UseGuards } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Roles } from '../../../shared/decorators/roles.decorator';
// import { RolesGuard } from '../../../shared/guards/roles.guard';

@Injectable()
export class EventsService {

  constructor(private prisma : PrismaService) {}

  create(createEventDto: CreateEventDto) {
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
    return this.prisma.event.create({data: createEventDto});
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
}
