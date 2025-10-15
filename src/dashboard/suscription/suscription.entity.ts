import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('suscription')
export class Suscription {
  @PrimaryGeneratedColumn()
  id: number;
  
 @Column() 
  user_id: string;

  @Column()
  subscription_id : string ; 

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
