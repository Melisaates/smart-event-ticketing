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

  // 
  async create(createTicketDto: CreateTicketDto) {
    const ticket = await this.prismaService.ticket.create({
    data : createTicketDto
    });
    await this.kafkaService.produce('ticket.created', ticket);
    return ticket;
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: string) {
    return this.prismaService.ticket.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.prismaService.ticket.update({
      where: { id: id },
      data: {
        price: updateTicketDto.price,
        status: updateTicketDto.TicketStatus
      },
    });

    if(updateTicketDto.price !== undefined){
      await this.kafkaService.produce('ticket.price.updated', ticket);
    }

    return ticket;
  }

  remove(id: string) {
    return this.prismaService.ticket.delete({
      where: { id },
    });
  }
}
