import { Injectable } from '@nestjs/common';
import { AboOrders } from './abo-orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDto } from '../dtos/create-order';

@Injectable()
export class AboOrdersService {

    constructor( @InjectRepository(AboOrders) private repo:Repository<AboOrders>) {}

    /**
   * Create a new order in the database
   * @param orderDto - DTO containing order data
   * @returns The saved order
   */
  async createOrder(orderDto: OrderDto): Promise<AboOrders> {
    const newOrder = this.repo.create({
      user_id: orderDto.user_id,
      subscription_id: orderDto.subscription_id,
      command_id: orderDto.command_id,
      codeAbonnement: orderDto.codeAbo,
    });

    return this.repo.save(newOrder);
  } ;

   async countUserOrders(userId: string): Promise<number> {
    return this.repo.count({
      where: { user_id: userId },
    });
  }

}
