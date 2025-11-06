import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('AboHistory')
export class AboHistory {
  @PrimaryGeneratedColumn()
  id: number;
  
 @Column() 
  user_id: string;

  @Column()
  subscription_id : string ; 

  @Column()
  transaction_id:string ;
 
  @Column()
  codeAbonnement:string ;
  
  @Column()
  PrixAbo:String ;

  @Column()
  Nom_users:String ;

  @Column()
  Num_commande_used:string ;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

}
