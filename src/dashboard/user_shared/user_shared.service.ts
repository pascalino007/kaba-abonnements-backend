import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserShared } from './user_shared.entity';

@Injectable()
export class UserSharedService {
  constructor(
    @InjectRepository(UserShared)
    private readonly userSharedRepository: Repository<UserShared>,
  ) {}
  
  async createUserShared(data: {
    user_id: string;
    subscription_id: string;
    codeAbonnement: string;
  }): Promise<UserShared> {
    const newUserShared = this.userSharedRepository.create({
      user_id: data.user_id,
      subscription_id: data.subscription_id,
      codeAbonnement: data.codeAbonnement,
    });

    return await this.userSharedRepository.save(newUserShared);
  }

  /**
   * (Optional) Retrieve all UserShared entries
   */
  async findAll(): Promise<UserShared[]> {
    return await this.userSharedRepository.find();
  }

  async countUserShared(codeAbonnement: string): Promise<number> {
    return this.userSharedRepository.count({
      where: { codeAbonnement: codeAbonnement },
    });
  }

  /**
   * (Optional) Find one by ID
   */
  async findOne(id: number): Promise<UserShared | null> {
    return await this.userSharedRepository.findOne({ where: { id } });
  }
}
