import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Pack } from "./pack.entity";
import { createPackDto } from "../dtos/create-pack.dto";
import { updatePackDto } from "../dtos/update-pack.dto";

// This is makes this calls Injectable 
@Injectable()
export class PackService {
    

    // We are using Dependency Injection 
    constructor( @InjectRepository(Pack) private repo:Repository<Pack>) {}

   findOne(id: number) {
    return this.repo.findOneBy({ id });
   }

    async findAll() {
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
  const newPack = this.repo.create({
    name: packData.name,
    price: packData.price,
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