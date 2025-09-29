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
  host: '127.0.0.1',          // nom du service MySQL dans docker-compose
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'yourdb',
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
