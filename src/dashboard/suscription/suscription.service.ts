
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Suscription } from "./suscription.entity";
import { suscriptionDto } from "../dtos/create-abo";

import * as crypto from 'crypto'
import { updateabodto } from "../dtos/update-abo.dto";
import { sharedAbo } from "../dtos/sharedAbo";



// This is makes this calls Injectable 
@Injectable()
export class SuscriptionService {


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
    constructor( @InjectRepository(Suscription) private repo:Repository<Suscription>) {}

  

    async findAll() {
        return this.repo.find();
    }

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
    const existing = await this.repo.find({
      where: { user_id: aboData.user_id },
      order: { created_at: 'DESC' },
      take: 1,
    }).then(results => results[0]);

    if (existing) {
      // 🧾 If last subscription payment was not completed, delete it
      if (existing.status_payement === 0) {
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
      subscription_id: aboData.subscription_id,
      start_date: aboData.start_date,
      end_date: endDate,
      payement_method: aboData.payement_method,
      status_payement: 0,
      status_abonnement: 0,
      transaction_id: '',
      codeAbonnement: code,
    });

    // 💾 Save new record
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
    subscription_id: subscription.subscription_id,
    start_date: startDate,
    end_date: endDate,
    payement_method: subscription.payement_method ?? 'shared',
    status_payement: subscription.status_payement ?? 1,
    status_abonnement: subscription.status_abonnement ?? 1,
    transaction_id: '',
    codeAbonnement: subscription.codeAbonnement,
  });

  // 6️⃣ Save to database
  return await this.repo.save(newPack);
}








async updateabo(user_id: string, attrs: Partial<updateabodto>) {
  // 🔍 Find the subscription by user_id
  const abo = await this.repo.findOne({
    where: { user_id: user_id },
  });

  if (!abo) {
    throw new Error('Subscription not found');
  }

  // 🧾 Merge the new attributes
  Object.assign(abo, attrs);

  // 💾 Save to database
  return await this.repo.save(abo);
}




 /* async supendpack() {
        return this.repo.find();
 } */

 /*  async deletepack(id:number) {
     const pack = await this.findOne(id) ;
     if(!pack){
         throw new Error('Pack not found ') ;
       }
       // this is the else instrcuction 
       
      return this.repo.remove(pack) ;
 } */


}
