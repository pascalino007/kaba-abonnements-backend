import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Suscription } from '../suscription/suscription.entity';

@Entity('AboOrders')
export class AboOrders {
  @PrimaryGeneratedColumn()
  id: number;
  
 @Column()  
  user_id: string;

  @Column()
  command_id:string ;
 
  @Column()
  codeAbonnement:string ;

  @Column()
  prix_livraison:String ;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date; 

   // 👇 Relation back to Suscription
  @ManyToOne(() => Suscription, (subscription) => subscription.orders)
  @JoinColumn({ name: 'subscription_id' })
  subscription: Suscription;
}
