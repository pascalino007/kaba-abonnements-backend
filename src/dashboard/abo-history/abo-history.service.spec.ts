import { Test, TestingModule } from '@nestjs/testing';
import { AboHistoryService } from './abo-history.service';

describe('AboHistoryService', () => {
  let service: AboHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboHistoryService],
    }).compile();

    service = module.get<AboHistoryService>(AboHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
