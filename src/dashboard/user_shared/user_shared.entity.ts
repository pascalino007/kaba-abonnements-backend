import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, OneToOne } from 'typeorm';
import { Suscription } from '../suscription/suscription.entity';

@Entity('UserShared')
export class UserShared {
  @PrimaryGeneratedColumn()
  id: number;
  
 @Column()  
  user_id: string;


  @Column()
  subscription_id : string ; 

 
  @Column()
  codeAbonnement:string ;


  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date; 
}
