import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Kafka } from 'kafkajs';
import { PrismaService }  from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { KafkaService } from 'src/kafka/kafka.service';
import { TicketClient } from 'src/ticket/ticket.client';

@Injectable()
export class OrderService {
  constructor(
    private kafkaProducer: KafkaService,
    private prisma: PrismaService,
    private http: HttpService
    , private ticketClient: TicketClient

  ) {}
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    // Call Ticket Service to reserve the ticket
    const ticket =  await this.ticketClient.getTicket( createOrderDto.ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    const price = ticket.price;

    await this.ticketClient.reserveTicket( createOrderDto.ticketId);

    // Create order in the database
    const order = await this.prisma.order.create({
      data: {
        userId, 
        ticketId: createOrderDto.ticketId,
        price,
        status: 'CONFIRMED',
      },
    });

    await this.kafkaProducer.produce('order.created', {
      orderId: order.id,
      userId: order.userId,
      ticketId: createOrderDto.ticketId,
      price: order.price,
      status: order.status,
    });


    return order;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
