import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TicketsService {

  constructor(
    private prismaService: PrismaService,
    private kafkaService: KafkaService
  ) {}

  async create(data: {eventId:number,price :number}) {
    const ticket = await this.prismaService.ticket.create({
      data: {
        eventId: data.eventId,
        price: data.price
      }
    });
    await this.kafkaService.produce('ticket.created', ticket);
    return ticket;
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return this.prismaService.ticket.findUnique({
      where: { id },
    });
  }

  async update(id: string,data:{price? :number,status?:string}) {
    const ticket = await this.prismaService.ticket.update({
      where: { id: Number(id) },
      data
    });

    if(data.price !== undefined){
      await this.kafkaService.produce('ticket.price.updated', ticket);
    }

    return ticket;
  }

  remove(id: number) {
    return this.prismaService.ticket.delete({
      where: { id },
    });
  }
}
