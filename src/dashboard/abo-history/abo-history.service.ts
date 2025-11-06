
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { AboHistory } from './abo-history.entity';
import { CreateAboHistoryDto } from '../dtos/create-abohistory.dto';


@Injectable()
export class AboHistoryService {
  constructor(
    @InjectRepository(AboHistory)
    private readonly repo: Repository<AboHistory>,
  ) {}

  // 🆕 Create a new AboHistory record
async create(hisData: CreateAboHistoryDto): Promise<AboHistory> {
  try {
    // 🔍 Check if any record exists with this codeAbonnement
    const existingRecord = await this.repo.findOne({
      where: { codeAbonnement: hisData.codeAbonnement },
    });

    if (existingRecord) {
      // Case 1: same user already exists → throw error
      if (existingRecord.user_id === hisData.user_id) {
        throw new Error('User already there');
      }

      // Case 2: different user → increment Nom_users
      const currentCount = Number(existingRecord.Nom_users) || 1;
      existingRecord.Nom_users = String(currentCount + 1);

      // Save the updated record
      return await this.repo.save(existingRecord); // ✅ single entity
    }

    // Case 3: no record exists → create new with Nom_users = 1
    const abo = this.repo.create(hisData); // ✅ hisData is one object
    return await this.repo.save(abo);      // ✅ returns AboHistory

  } catch (error) {
    console.error('❌ Error creating AboHistory:', error);

    if (error.message === 'User already there') {
      throw new ConflictException('User already there');
    }

    throw new InternalServerErrorException('Erreur lors de la création de l’historique.');
  }
}




  // 📜 Get all records
  async findAll(): Promise<AboHistory[]> {
    return await this.repo.find({
      order: { created_at: 'DESC' },
    });
  }

  // 🔍 Get one by ID
  async findOne(id: number): Promise<AboHistory> {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`AboHistory avec l'ID ${id} introuvable.`);
    }
    return record;
  }

  // ✏️ Update record by ID
  async update(id: number, data: Partial<AboHistory>): Promise<AboHistory> {
    const record = await this.findOne(id);
    Object.assign(record, data);
    return await this.repo.save(record);
  }

  // 🗑️ Delete record by ID
  async remove(id: number): Promise<{ message: string }> {
    const record = await this.findOne(id);
    await this.repo.remove(record);
    return { message: 'Historique supprimé avec succès.' };
  }

  // 🔍 Optional: Get all records by user_id
  async findByUser(user_id: string): Promise<AboHistory[]> {
    return await this.repo.find({
      where: { user_id },
      order: { created_at: 'DESC' },
    });
  }

  async updateOrderCount(user_id: string, codeAbonnement: string): Promise<AboHistory> {
  const record = await this.repo.findOne({ where: { user_id, codeAbonnement } });

  if (!record) {
    throw new NotFoundException('AboHistory not found for this user and code');
  }

  const currentCount = Number(record.Num_commande_used) || 0;
  record.Num_commande_used = String(currentCount + 1);

  return await this.repo.save(record);
 }

  // 🔍 Optional: Get all records by subscription_id
  async findBySubscription(subscription_id: string): Promise<AboHistory[]> {
    return await this.repo.find({
      where: { subscription_id },
      order: { created_at: 'DESC' },
    });
  }

    async findBetweenDates(startDate: Date, endDate: Date): Promise<AboHistory[]> {
    return this.repo.find({
      where: {
        created_at: Between(startDate, endDate),
      },
      order: {
        created_at: 'ASC', // optional: to sort results chronologically
      },
    });

    }
}
