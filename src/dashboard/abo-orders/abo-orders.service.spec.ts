import { Test, TestingModule } from '@nestjs/testing';
import { AboOrdersService } from './abo-orders.service';

describe('AboOrdersService', () => {
  let service: AboOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboOrdersService],
    }).compile();

    service = module.get<AboOrdersService>(AboOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
