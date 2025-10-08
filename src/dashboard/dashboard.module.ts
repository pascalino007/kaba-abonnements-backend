import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
/* import { PackRepository } from './pack/pack.repository'; */
import { PackService } from './pack/pack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pack } from './pack/pack.entity';
import { Suscription } from './suscription/suscription.entity';
import { SuscriptionService } from './suscription/suscription.service';

@Module({
  imports:[TypeOrmModule.forRoot({
   type: 'mysql',
   host: 'localhost' ,
    port: 3306,
    database:'abonnements',
    username:'root',
    password: 'kabadelivery',
  autoLoadEntities: true,
  synchronize: true,
  entities:[Pack]

  }),
  TypeOrmModule.forFeature([Pack,Suscription])

],
  controllers: [DashboardController],
  providers:[PackService,SuscriptionService],
})
export class DashboardModule {}
