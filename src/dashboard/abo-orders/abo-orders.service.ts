import { Injectable, NotFoundException } from '@nestjs/common';
import { AboOrders } from './abo-orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDto } from '../dtos/create-order';
import { AboHistoryService } from "../abo-history/abo-history.service";
@Injectable()
export class AboOrdersService {
  

    constructor(
       @InjectRepository(AboOrders) private repo:Repository<AboOrders>,
       private readonly aboHistoryService: AboHistoryService,
  ) {}

    /**
   * Create a new order in the database
   * @param orderDto - DTO containing order data
   * @returns The saved order
   */
  async createOrder(orderDto: OrderDto): Promise<AboOrders> {
  // 1️⃣ Create new order entity
  
  const newOrder = this.repo.create({
    user_id: orderDto.user_id,
    command_id: orderDto.command_id,
    codeAbonnement: orderDto.codeAbo,
    prix_livraison: orderDto.codeAbo ?? '0',
  });

  // 2️⃣ Save the order
  const savedOrder = await this.repo.save(newOrder);

  // 3️⃣ Automatically update AboHistory for this user
  try {
    await this.aboHistoryService.updateOrderCount(orderDto.user_id, orderDto.codeAbo);
    console.log(`✅ AboHistory updated for user ${orderDto.user_id} and ${orderDto.codeAbo}`);
  } catch (error) {
    console.error(`❌ Failed to update AboHistory for user ${orderDto.user_id} and ${orderDto.codeAbo}:`, error);
  }

  // 4️⃣ Return the saved order
  return savedOrder;
}

async cancelOrder(command_id: string): Promise<AboOrders> {
    // 1️⃣ Find order by command_id
    const order = await this.repo.findOne({ where: { command_id } });

    if (!order) {
      throw new NotFoundException(`Order with command_id ${command_id} not found`);
    }

    // 2️⃣ Update the status to 0 (cancelled)
    order.status = 0;

    // 3️⃣ Save the change
    return await this.repo.save(order);
  }


async countUserOrders(codeAbonnement: string): Promise<number> {
  return this.repo.count({
    where: {
      codeAbonnement: codeAbonnement,
      status: 1, // ✅ Only count active orders
    },
  });
}



  

}
