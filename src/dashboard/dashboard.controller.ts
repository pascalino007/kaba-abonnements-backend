import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { createPackDto } from './dtos/create-pack.dto';
import { suscriptionDto } from './dtos/create-abo';
import { updatePackDto } from './dtos/update-pack.dto';
import { PackService } from './pack/pack.service';
import { SuscriptionService } from './suscription/suscription.service';
import { updateabodto } from './dtos/update-abo.dto';
import { sharedAbo } from './dtos/sharedAbo';

@Controller('dashboard')
export class DashboardController {
  // Objet service  initialisé
  // Dependency Injection Used
  constructor(
    private packService: PackService,
    private suscripionService: SuscriptionService,
  ) {}

  // get all pack
  @Get('/abonnements')
  getabonnements() {
    return this.suscripionService.findAll();
  }

   @Get('/packs')
  getPacks() {
    return this.packService.findAll();
  }

  // make a search => /dashboard?search='your search in name'
  @Get()
  findallpacks(@Query('search') search: string) {
    return this.packService.search(search);
  }

  @Get('/:id_pack')
  async getPack(@Param('id_pack') id: string) {
    return this.packService.findOne(parseInt(id));
  }

    @Get('/subscribeduser/:user_id')
  getUserDetails(@Param('user_id') user_id: string) {
    return this.suscripionService.findOne(user_id);

  }


   @Get('subscription/:userId')
  checkSubscription(@Param('userId') userId: string) {
    console.log(`Checking subscription for user: ${userId}`);
    return {
      state: 1, // always active for testing
    };
  }


  @Post('/sharedCodeSuscriber')
  createBeneficiary(@Body() body:sharedAbo){
     return this.suscripionService.saveBeneficiary({
       user_id: body.user_id,
       Code: body.Code  
     });
  

  }

  @Post('/new_pack')
  createPack(@Body() body: createPackDto) {
    return this.packService.create({
      name: body.name,
      price: body.price,
      color:body.color ,
      deliverylimit: body.deliverylimit,
      radius_km: body.radius_km,
      min_order_amount: body.min_order_amount,
      duration_days: body.duration_days,
      is_shareable: body.is_shareable,
      max_shared_users: body.max_shared_users,
      discount_on_order: body.discount_on_order,
      other_benefits: body.other_benefits,
      is_active: body.is_active,
      is_enterprise: body.is_enterprise,
      createdAt: body.createdAt ?? new Date(),
    });
  }
  @Patch('/update/')
  updatePack(@Body() body: updatePackDto) {
    const id = body.id;
    console.log(id);
    console.log(body);
    return this.packService.updatepack(id, body);
  }

   @Post('/update_abo')
   updateabo(@Body() body: updateabodto) {
  const user_id = body.user_id;
  console.log('ID:', user_id);
  console.log('BODY:', body);

  return this.suscripionService.updateabo(user_id, body);
  }

  @Delete('/delete/:id')
  deletePack(@Param('id') id: string) {
    return this.packService.deletepack(parseInt(id));
  }

  @Post('/new_abonnement')
  createabonnement(@Body() body: suscriptionDto) {
    return this.suscripionService.create({
      user_id: body.user_id,
      subscription_id: body.subscription_id,
      start_date: body.start_date,
      payement_method: body.payement_method,
      transaction_id: body.transaction_id,
     
    });
  }

 


}
