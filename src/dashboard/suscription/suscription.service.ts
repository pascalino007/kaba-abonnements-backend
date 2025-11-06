import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Suscription } from "./suscription.entity";
import { suscriptionDto } from "../dtos/create-abo";

import * as crypto from 'crypto'
import { updateabodto } from "../dtos/update-abo.dto";
import { sharedAbo } from "../dtos/sharedAbo";
import { AboOrders } from "../abo-orders/abo-orders.entity";
import { AboOrdersService } from "../abo-orders/abo-orders.service";
import { UserSharedService } from "../user_shared/user_shared.service";
import { AboHistoryService } from "../abo-history/abo-history.service";
import { PackService } from "../pack/pack.service";
import { Cron, CronExpression } from '@nestjs/schedule';


// This is makes this calls Injectable 
@Injectable()
export class SuscriptionService {
  private readonly logger = new Logger(SuscriptionService.name);

   findOne(user_id: string) {
    return this.repo.findOneBy({ user_id });
   }

    OrderDiscount(sharedAbo: sharedAbo){
      // this function help in the Commande 
      // for example if I want to order ,  this function will provide my suscription Discount 
       
    }

    checkAboIsExpired(sharedAbo: sharedAbo){
      // this function help in the Commande 
      //  if Abonnement has Expired 
      //  * Date has Expired
      //  * Delivery Limit atteint 
      //  * 

    }

    checkifsharable(sharedAbo: sharedAbo){
      // get the Abonnent code and get the Suscription id and Count the one in SharedUser and compare both
      // if suscription.max_shared_users >= count(shared_user with Code) ? not sharable  : 
    }

    
    countLivraison(code:String){

    }
    

    // We are using Dependency Injection 
    constructor(
       @InjectRepository(Suscription) private repo:Repository<Suscription>,
       private readonly aboOrdersService: AboOrdersService ,
       private readonly UserSharedService: UserSharedService ,
       private readonly AboHistoryService: AboHistoryService,
       private readonly packService : PackService ,
      ) {}

  

async findAll() {
  console.log('Fetching all active subscriptions');

  // 1️⃣ Fetch all active subscriptions with their packs
  const subscriptions = await this.repo.find({
    
    relations: ['pack'],
  });

  // 2️⃣ If none found, return an empty array (frontend expects array)
  if (!subscriptions.length) return [];

  // 3️⃣ Build final data array
  const results = await Promise.all(
    subscriptions.map(async (subscription) => {
      const alreadyUsed = await this.aboOrdersService.countUserOrders(subscription.codeAbonnement);
      const usershared = await this.UserSharedService.countUserShared(subscription.codeAbonnement) ;
      return {
        user_id: subscription.user_id,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        payement_method: subscription.payement_method,
        transaction_id: subscription.transaction_id,
        codeAbonnement: subscription.codeAbonnement,
        status_abonnement: subscription.status_abonnement,
        pack: {
          id: subscription.pack.id,
          name: subscription.pack.name,
          price: subscription.pack.price,
          duration_days: subscription.pack.duration_days,
          color: subscription.pack.color,
          radius_km: subscription.pack.radius_km,
          deliverylimit: subscription.pack.deliverylimit,
          discount_on_order: subscription.pack.discount_on_order,
          max_shared_users: subscription.pack.max_shared_users,
          other_benefits: subscription.pack.other_benefits,
          is_active: subscription.pack.is_active,
          min_order_amount: subscription.pack.min_order_amount,
          is_shareable: subscription.pack.is_shareable,
        },
        alreadyUsed,
        usershared ,
      };
    })
  );

  // 4️⃣ Return directly the array (no wrapper)
  return results;
}



  

   async getUserSubscriptionWithPack(userId: string) {
    console.log(`Fetching subscription for user: ${userId}`);
    const subscription = await this.repo
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.pack', 'p')
      
      .where('s.user_id = :userId', { userId })
      // subscription has started
      .andWhere('s.status_abonnement = :active', { active: 1 }) // only active subscriptions
      .getOne();

    if (!subscription) {
      return {
        status: 'none',
        message: 'No active subscription found',
      };
    }
  
     const alreadyUsed = await this.aboOrdersService.countUserOrders(userId);


    return {
      status: 'success',
      
      user_id: subscription.user_id,
      start_date: subscription.start_date,
      end_date: subscription.end_date,
      payement_method: subscription.payement_method,
      transaction_id: subscription.transaction_id,
      codeAbonnement: subscription.codeAbonnement,
      pack: {
        id: subscription.pack.id,
        name: subscription.pack.name,
        price: subscription.pack.price,
        duration_days: subscription.pack.duration_days,
        color: subscription.pack.color,
        radius_km: subscription.pack.radius_km,
        deliverylimit: subscription.pack.deliverylimit,
        discount_on_order: subscription.pack.discount_on_order,
        max_shared_users: subscription.pack.max_shared_users,
        other_benefits: subscription.pack.other_benefits,
        is_active: subscription.pack.is_active,
        min_order_amount: subscription.pack.min_order_amount,
        is_shareable: subscription.pack.is_shareable,
      },
      alreadyUsed ,
    }
  };

    /*  async search(search:string) {
        return this.repo.find({
    where: {
         // 👈 condition
    },
  });
    }  */

   generateSubscriptionCode(user_id: string, subscription_id: string, start_date: string): string {
    // combine the inputs into one string
    const rawString = `${user_id}-${subscription_id}-${start_date}`;

    // create a hash (sha256) and turn it into a short alphanumeric code
    const hash = crypto.createHash('sha256').update(rawString).digest('hex');

    // return first 12 characters as code (customize length as needed)
    return hash.substring(0, 6).toUpperCase();
  }

 calculateEndDate(startDate: string | Date, days: number): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;

  const end = new Date(start);
  end.setDate(end.getDate() + days);

  // Convert to YYYY-MM-DD format
  const year = end.getFullYear();
  const month = String(end.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(end.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async create(aboData: suscriptionDto) {
  try {
    // 🔍 Get the last subscription for this user
    const existing = await this.repo.findOne({
      where: { user_id: aboData.user_id },
      order: { start_date: 'DESC' },
    });

    if (existing) {
      // 🧾 If last subscription payment was not completed, delete it
      if (existing.status_payement == 0) {
        console.log('🗑️ Previous unpaid subscription found, deleting it...');
        await this.repo.remove(existing);
      }

      // 🚫 If last subscription is active (paid), block new one
      else if (existing.status_abonnement === 1 && existing.status_payement === 1) {
        throw new ConflictException("L'utilisateur a déjà un abonnement actif.");
      }
    }

    // 🧩 Generate subscription details
    const code = this.generateSubscriptionCode(
      aboData.user_id,
      aboData.subscription_id,
      aboData.start_date,
    );

    const endDate = this.calculateEndDate(aboData.start_date, 30);

    // 🆕 Create new subscription entry
    const newPack = this.repo.create({
      user_id: aboData.user_id,
      subscription_id: typeof aboData.subscription_id === 'string' ? parseInt(aboData.subscription_id, 10) : aboData.subscription_id,
      start_date: aboData.start_date,
      end_date: endDate,
      payement_method: aboData.payement_method,
      status_payement: 0,
      status_abonnement: 0,
      transaction_id: '',
      codeAbonnement: code,
    });

     await this.UserSharedService.createUserShared({
  user_id: aboData.user_id,
  subscription_id: aboData.subscription_id,
   codeAbonnement: code,
});
 const  getAboprice = await this.packService.getPackById(parseInt(aboData.subscription_id))
    // before saving in create()
    try {
      await this.AboHistoryService.create({
        user_id: aboData.user_id,
        subscription_id: aboData.subscription_id,
        transaction_id: 'N/A',
        codeAbonnement: code,
        PrixAbo: getAboprice!.price.toString(),
        Nom_users: '1',
        Num_commande_used: 'N/A',
      });
    } catch (err) {
      if (err?.status === 409 || err?.code === 'ER_DUP_ENTRY' || (err?.message && err.message.includes('already'))) {
        this.logger.warn(`AboHistory already exists for user ${aboData.user_id} - continuing`);
      } else {
        throw err;
      }
    }

    // 💾 Save to database
    return await this.repo.save(newPack);



  } catch (error) {
    console.error('❌ Subscription creation error:', error);

    if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
      throw new ConflictException('Cet utilisateur a déjà un abonnement en base.');
    }

    throw new InternalServerErrorException("Impossible de créer l'abonnement.");
  }
}

async saveBeneficiary(sharedAbo: sharedAbo) {
  // 1️⃣ Find subscription by code
  const subscription = await this.repo.findOne({
    where: { codeAbonnement: sharedAbo.Code },
  });

  // 2️⃣ Check if the user already has a subscription
  const existingClient = await this.repo.findOneBy({
    user_id: sharedAbo.user_id,
  });

  // 3️⃣ If subscription not found, return error
  if (!subscription) {
    throw new NotFoundException(
      `Subscription with code ${sharedAbo.Code} not found`
    );
  }

  // 4️⃣ Handle existing subscription
  if (existingClient) {
    if (existingClient.status_abonnement === 1) {
      // Active subscription → block
      throw new ConflictException(
        `User ${sharedAbo.user_id} already has an active subscription`
      );
    } else if (existingClient.status_abonnement === 0) {
      // Pending subscription → delete it
      await this.repo.delete({ user_id : existingClient.user_id });
    }
  }

  // 5️⃣ Create new subscription entry for beneficiary
  const startDate = subscription.start_date ?? new Date();
  const endDate = subscription.end_date ?? this.calculateEndDate(new Date(), 25);

  const newPack = this.repo.create({
    user_id: sharedAbo.user_id,
    subscription_id: typeof subscription.subscription_id === 'string' ? parseInt(subscription.subscription_id, 10) : subscription.subscription_id,
    start_date: startDate,
    end_date: endDate,
    payement_method: subscription.payement_method ?? 'shared',
    status_payement: subscription.status_payement ?? 1,
    status_abonnement: subscription.status_abonnement ?? 1,
    transaction_id: '',
    codeAbonnement: subscription.codeAbonnement,
  });
  

  await this.AboHistoryService.create({
    user_id: sharedAbo.user_id,
    subscription_id: subscription.subscription_id.toString(),
    transaction_id: 'N/A',
    codeAbonnement: subscription.codeAbonnement,
    PrixAbo: '',
    Nom_users: '1',
    Num_commande_used: 'N/A',
  }).catch(err => {
    if (err?.status === 409 || err?.code === 'ER_DUP_ENTRY' || (err?.message && err.message.includes('already'))) {
      this.logger.warn(`AboHistory already exists for beneficiary ${sharedAbo.user_id} - continuing`);
    } else {
      throw err;
    }
  });

     await this.UserSharedService.createUserShared({
  user_id: sharedAbo.user_id,
  subscription_id: subscription.subscription_id.toString(),
   codeAbonnement: subscription.codeAbonnement,})
  // 6️⃣ Save to database
  return await this.repo.save(newPack);
}








async updateabo(user_id: string, attrs: Partial<updateabodto>) {
  // 🔍 Find the subscription by user_id
  const abo = await this.repo.findOne({
    where: { user_id: user_id },
  });

  if (!abo) {
    // return a proper Nest exception (makes debugging easier)
    throw new NotFoundException('Subscription not found');
  }

  // 🧾 Merge the new attributes
  Object.assign(abo, attrs);

 await this.UserSharedService.createUserShared({
  user_id: abo.user_id,
  subscription_id: abo.subscription_id.toString(),
   codeAbonnement: abo.codeAbonnement,
  });
 const  getAboprice = await this.packService.getPackById(parseInt(abo.subscription_id.toString()))
    try {
      await this.AboHistoryService.create({
        user_id: abo.user_id,
        subscription_id: abo.subscription_id.toString(),
        transaction_id: 'N/A',
        codeAbonnement: abo.codeAbonnement,
        PrixAbo: getAboprice!.price.toString(),
        Nom_users: '1',
        Num_commande_used: 'N/A',
      });
    } catch (err) {
      if (err?.status === 409 || err?.code === 'ER_DUP_ENTRY' || (err?.message && err.message.includes('already'))) {
        this.logger.warn(`AboHistory already exists for user ${abo.user_id} - continuing`);
      } else {
        throw err;
      }
    }

  // 💾 Save to database
  //555
  return await this.repo.save(abo);
}


async findByUserAndCode(user_id: string, codeAbonnement: string): Promise<Suscription> {
    const subscription = await this.repo.findOne({
      where: { user_id, codeAbonnement },
    });

    if (!subscription) {
      throw new NotFoundException(
        `Subscription not found for user ${user_id} with code ${codeAbonnement}`,
      );
    }

    return subscription;
  }

  async checkSubscriptionValidity(subscription: Suscription): Promise<boolean> {
  if (!subscription) return false;

  // Check if subscription is active and paid
  if (subscription.status_abonnement !== 1 || subscription.status_payement !== 1) {
    return false;
  }

  // Check end date
  const currentDate = new Date();
  const endDate = new Date(subscription.end_date);
  if (currentDate > endDate) {
    await this.deactivateExpiredSubscription(subscription);
    return false;
  }

  // Check delivery limits if they exist
  const usedDeliveries = await this.aboOrdersService.countUserOrders(subscription.codeAbonnement);
  const pack = await this.packService.getPackById(subscription.subscription_id);
  
  if (pack && usedDeliveries >= pack.deliverylimit) {
    await this.deactivateExpiredSubscription(subscription);
    return false;
  }

  return true;
}

private async deactivateExpiredSubscription(subscription: Suscription): Promise<void> {
  try {
    // Update subscription status
    subscription.status_abonnement = 0;
    
    // Save the deactivated subscription
    await this.repo.save(subscription);

    // Create history entry for deactivation
    /* await this.AboHistoryService.create({
      user_id: subscription.user_id,
      subscription_id: subscription.subscription_id.toString(),
      transaction_id: 'EXPIRED',
      codeAbonnement: subscription.codeAbonnement,
      PrixAbo: '0',
      Nom_users: '0',
      Num_commande_used: 'DEACTIVATED',
    }); */

  } catch (error) {
    console.error('Failed to deactivate subscription:', error);
    throw new InternalServerErrorException('Failed to deactivate subscription');
  }
}

@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async cleanupExpiredSubscriptions() {
    this.logger.log('Starting daily subscription cleanup...');
    try {
      const activeSubscriptions = await this.repo.find({
        where: { 
          status_abonnement: 1,
          status_payement: 1
        }
      });

      this.logger.log(`Found ${activeSubscriptions.length} active subscriptions to check`);

      for (const subscription of activeSubscriptions) {
        const isValid = await this.checkSubscriptionValidity(subscription);
        if (!isValid) {
          this.logger.warn(`Deactivated expired subscription for user: ${subscription.user_id}`);
        }
      }

      this.logger.log('Completed daily subscription cleanup');
    } catch (error) {
      this.logger.error('Failed to cleanup expired subscriptions:', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
async cleanupUnpaidSubscriptions() {
  this.logger.log('Starting hourly cleanup for unpaid/pending subscriptions (with grace period)...');
  try {
    // keep pending subscriptions for at least 2 hours to allow updates/checkout
    const graceMs = 1000 * 60 * 60 * 2; // 2 hours
    const cutoff = new Date(Date.now() - graceMs);

    const qb = this.repo.createQueryBuilder()
      .delete()
      .where('status_payement = :sp', { sp: 0 })
      .andWhere('status_abonnement = :sa', { sa: 0 })
      .andWhere('created_at < :cutoff', { cutoff: cutoff.toISOString() });

    const result = await qb.execute();

    const affected = (result.affected as number) || 0;
    this.logger.log(`Deleted ${affected} unpaid pending subscriptions older than ${cutoff.toISOString()}`);
  } catch (error) {
    this.logger.error('Failed to cleanup unpaid subscriptions:', error);
  }
}
}
