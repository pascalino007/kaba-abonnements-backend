import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('shared_user')
export class Shared_User {
  @PrimaryGeneratedColumn()
  id: number;
  
 @Column({ unique: true }) 
  user_id: string;

  @Column()
  code_suscription : string ; 


  @Column()
  suscription_id : string ;
  
 

 
}
