import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Suscription } from '../suscription/suscription.entity';

@Entity('packs')
export class Pack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

 @Column()
  color: string;


  @Column({ type: 'int', nullable: true })
  deliverylimit: number;

  @Column({ type: 'int' })
  radius_km: number;

  @Column('decimal', { precision: 10, scale: 2 })
  min_order_amount: number;

  @Column({ type: 'int' })
  duration_days: number;

  @Column({ default: false })
  is_shareable: boolean;

  @Column({ type: 'int', nullable: true })
  max_shared_users: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discount_on_order: number;

  @Column({ type: 'text', nullable: true })
  other_benefits: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_enterprise: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

   @OneToMany(() => Suscription, (suscription) => suscription.pack)
  suscriptions: Suscription[];
}
