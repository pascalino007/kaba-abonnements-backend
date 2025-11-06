import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Pack } from "./pack.entity";
import { createPackDto } from "../dtos/create-pack.dto";
import { updatePackDto } from "../dtos/update-pack.dto";
import * as crypto from 'crypto' ;
// This is makes this calls Injectable 
@Injectable()
export class PackService {
  



  
 


    

    // We are using Dependency Injection 
    constructor( @InjectRepository(Pack) private repo:Repository<Pack>) {}

  
   async  getPackById(subscription_id: number) {
    return this.repo.findOneBy({ id:subscription_id });
  }


   findOne(id: number) {
    return this.repo.findOneBy({ id });
   }

   async findAll() {
  return this.repo.find({
    where: {
      is_active: true,
      is_enterprise: false // or 1 if your column is tinyint
    },
  });
}

  async findAllAdmin(){
  return this.repo.find();

}

    async search(search:string) {
        return this.repo.find({
    where: {
      name : search   // 👈 condition
    },
  });
    }

async create(packData: createPackDto) {
  // 1. Generate a unique string based on name + price + timestamp
  const rawString = `${packData.name}-${packData.price}-${Date.now()}`;

  // 2. Create a short unique code
  const hash = crypto.createHash('sha256').update(rawString).digest('hex');
  const uniqueCode = hash.substring(0, 8).toUpperCase(); // e.g. "A1B2C3D4"

  // 3. Create the pack with the generated code
  const newPack = this.repo.create({
    name: packData.name,
    price: packData.price,
    color: packData.color,
    deliverylimit: packData.deliverylimit,
    radius_km: packData.radius_km,
    min_order_amount: packData.min_order_amount,
    duration_days: packData.duration_days,
    is_shareable: packData.is_shareable,
    max_shared_users: packData.max_shared_users,
    discount_on_order: packData.discount_on_order,
    other_benefits: packData.other_benefits,
    is_active: packData.is_active,
    is_enterprise: packData.is_enterprise,
    code: uniqueCode, // 👈 add the unique code here
    createdAt: packData.createdAt ?? new Date(),
  });

  return await this.repo.save(newPack);
}

 


 async updatepack(id:number , attrs:Partial<updatePackDto>) {
        const pack = await  this.repo.findOneBy({ id });
        
       if(!pack){
         throw new Error('User not found ') ;
       }
       // this is the else instrcuction 
      Object.assign(pack , attrs)
       return await this.repo.save(pack) ; 
    }


 async supendpack() {
        return this.repo.find();
 }

  async deletepack(id:number) {
     const pack = await this.findOne(id) ;
     if(!pack){
         throw new Error('Pack not found ') ;
       }
       // this is the else instrcuction 
       
       return this.repo.remove(pack) ;
 }


}