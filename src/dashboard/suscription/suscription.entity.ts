import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { Pack } from '../pack/pack.entity';

@Entity('suscription')
export class Suscription {
  @PrimaryGeneratedColumn()
  id: number;
  
 @Column() 
  user_id: string;


   @ManyToOne(() => Pack, { eager: true }) // eager: automatically load the pack
  @JoinColumn({ name: 'subscription_id' })
  pack: Pack;

  @Column({ type: 'int' })
  subscription_id: number;

  @Column()
  start_date : string ;

  @Column()
  end_date : string ;

  @Column()
  payement_method : string ;

  @Column()
  status_payement : number ;
  
  @Column()
  transaction_id:string ;
 
  @Column()
  codeAbonnement:string ;

   @Column()
  status_abonnement : number ;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date; 
}
