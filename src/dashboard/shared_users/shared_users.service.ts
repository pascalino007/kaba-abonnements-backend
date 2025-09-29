import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Shared_User, } from "./shared_users.entity";
import { suscriptionDto } from "../dtos/create-abo";

import * as crypto from 'crypto'
import { updateabodto } from "../dtos/update-abo.dto";
import { sharedAbo } from "../dtos/sharedAbo";



// This is makes this calls Injectable 
@Injectable()
export class shared_userService {


    // We are using Dependency Injection 
    constructor( @InjectRepository(Shared_User) private repo:Repository<Shared_User>) {}

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
/* 
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
} */

/* 
async create(aboData: suscriptionDto) {
  try {
    // 1️⃣ Check if an active subscription exists
    const existing = await this.repo.findOneBy({
      user_id: aboData.user_id,
      status_abonnement: 1, // active subscription
    });

    if (existing) {
      // User already has an active subscription
      throw new ConflictException("L'utilisateur a déjà un abonnement actif.");    
    }

    // 2️⃣ Generate code and end date
    const code = this.generateSubscriptionCode(
      aboData.user_id,
      aboData.subscription_id,
      aboData.start_date,
    );
    const endDate = this.calculateEndDate(aboData.start_date, 30);

    // 3️⃣ Create new subscription
    const newPack = this.repo.create({
      user_id: aboData.user_id,
      subscription_id: aboData.subscription_id,
      start_date: aboData.start_date,
      end_date: endDate,
      payement_method: aboData.payement_method,
      status_payement: 0,
      status_abonnement: 0,
      transaction_id: ' ',
      codeAbonnement: code,
    });

    // 4️⃣ Save to database
    return await this.repo.save(newPack);
  } catch (error) {
    console.error(error);

    // Handle duplicate entry error (DB constraint)
    if (error.code === '23505') {
      throw new ConflictException('Cet utilisateur a déjà un abonnement en base.');
    }

    // Rethrow as proper HTTP error
    throw new InternalServerErrorException("Impossible de créer l'abonnement");
  }
} */


/* 
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
  /* if (Suscription != null && existingclient == null) {
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
  } */

  // 3️⃣ Return all subscription data
  //return subscription;
 /* }  */




 


/*  async updateabo(id:number , attrs:Partial<updateabodto>) {
       const pack = await this.repo.findOne({
          where: { id: id }
       });
        
       if(!pack){
         throw new Error('Suscription not found ') ;
       }
       // this is the else instrcuction 
      Object.assign(pack , attrs)
       return await this.repo.save(pack) ; 
    }  */


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