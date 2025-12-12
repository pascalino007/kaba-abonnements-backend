import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
/* import { PackRepository } from './pack/pack.repository'; */
import { PackService } from './pack/pack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pack } from './pack/pack.entity';
import { Suscription } from './suscription/suscription.entity';
import { SuscriptionService } from './suscription/suscription.service';
import { AboOrdersService } from './abo-orders/abo-orders.service';
import { AboHistoryService } from './abo-history/abo-history.service';
import { AboOrders } from './abo-orders/abo-orders.entity';
import { AboHistory } from './abo-history/abo-history.entity';
import { UserSharedService } from './user_shared/user_shared.service';
import { UserShared } from './user_shared/user_shared.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
   type: 'mysql',
   host: 'localhost' ,
    port: 3306,
    database:'abonnements',
    username:'root',
    password: 'NewStrongPassword123!',
  autoLoadEntities: true,
  synchronize: true,
  entities:[Pack]

  }),
  TypeOrmModule.forFeature([Pack,Suscription, AboOrders, AboHistory,UserShared])

],
  controllers: [DashboardController],
  providers:[PackService,SuscriptionService, AboOrdersService, AboHistoryService,UserSharedService],
})
export class DashboardModule {}
