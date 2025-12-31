import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Kafka } from 'kafkajs';

@Injectable()
export class OrderService {
  constructor(
    private kafkaProducer: KafkaProducer,
    private prisma: PrismaService,
    private http: HttpService,

  ) {}
  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const ticketResponse = await this.http.get(`http://ticket-service/tickets/${createOrderDto.ticketId}`).toPromise();
    const {price} = ticketResponse.data;

    await this.http.post(`http://ticket-service/tickets/${createOrderDto.ticketId}/reserve`).toPromise();

    const order = await this.prisma.order.create({
      data: {
        userId, 
        ticketId: createOrderDto.ticketId,
        price,
        status: 'CONFIRMED',
      },
    });

    await this.kafkaProducer.sendMessage('order.created', {
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
