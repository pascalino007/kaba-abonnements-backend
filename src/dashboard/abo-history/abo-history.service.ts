import { Injectable } from '@nestjs/common';
import { AboHistory } from './abo-history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AboHistoryService {

    constructor( @InjectRepository(AboHistory) private repo:Repository<AboHistory>) {}
}
