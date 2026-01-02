import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { env } from 'process';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TicketsService {

  constructor(
    private prismaService: PrismaService,
    private kafkaService: KafkaService,
    private redisService: RedisService
  ) {}

  // 
  async create(createTicketDto: CreateTicketDto) {

    const {eventId, price, seatNumber} = createTicketDto;

    const existingTicket = await this.prismaService.ticket.findFirst({
      where: {
        eventId,
        seatNumber
      }
    });
    if (existingTicket) {
      throw new Error('Ticket for this seat already exists for the event');
    }

    const ticket = await this.prismaService.ticket.create({
    data : createTicketDto
    });

    await this.redisService.set(`ticket:${ticket.id}`, JSON.stringify(ticket), 'EX', env.REDIS_TTL || 3600);


  
    await this.kafkaService.produce('ticket.created', ticket);
    return ticket;
  }

  findAll() {
    return this.prismaService.ticket.findMany();
  }

  async findOne(id: string) {
    const cacheKey = `ticket:${id}`;
    const ticketInCache = await this.redisService.get(cacheKey);
    if(ticketInCache){
      return JSON.parse(ticketInCache);
    }
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id },
    });
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    await this.redisService.set(cacheKey, JSON.stringify(ticket), 'EX', env.REDIS_TTL || 3600);
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {

    const ticket = await this.prismaService.ticket.update({
      where: { id: id },
      data: {
        price: updateTicketDto.price,
        status: updateTicketDto.TicketStatus
      },
    });
    await this.redisService.set(`ticket:${id}`, JSON.stringify(ticket), 'EX', env.REDIS_TTL || 3600);


    if(updateTicketDto.price !== undefined){
      await this.kafkaService.produce('ticket.price.updated', ticket);
    }

    return ticket;
  }

  async remove(id: string) {
    await this.redisService.del(`ticket:${id}`);
    return this.prismaService.ticket.delete({
      where: { id },
    });
  }
}
