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
    return hash.substring(0, 12).toUpperCase();
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

  const existingclient = await this.repo.findOneBy({
      user_id: sharedAbo.user_id,
      status_abonnement: 1, // active subscription
    });

  /* // find if shared_user does not have this user 
      const shareduser = await this.repo.findOne({
    where: { codeAbonnement: sharedAbo.Code },
  });  */
  //

  // 2️⃣ If subscription not found
  if (Suscription != null && existingclient == null) {
     const newPack = this.repo.create({
      user_id: sharedAbo.user_id,
      subscription_id: subscription?.subscription_id || "",
      start_date: subscription?.start_date,
      end_date:  subscription?.end_date,
      payement_method: subscription?.payement_method,
      status_payement: subscription?.status_payement ,
      status_abonnement:subscription?.status_abonnement ,
      transaction_id: ' ',
      codeAbonnement: subscription?.codeAbonnement ,
    });

    // 4️⃣ Save to database
    return await this.repo.save(newPack);
  }

  // 3️⃣ Return all subscription data
  //return subscription;
}




 


 async updateabo(id:number , attrs:Partial<updateabodto>) {
       const pack = await this.repo.findOne({
          where: { id: id }
       });
        
       if(!pack){
         throw new Error('Suscription not found ') ;
       }
       // this is the else instrcuction 
      Object.assign(pack , attrs)
       return await this.repo.save(pack) ; 
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

