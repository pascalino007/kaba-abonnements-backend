import { Test, TestingModule } from '@nestjs/testing';
import { UserSharedService } from './user_shared.service';

describe('UserSharedService', () => {
  let service: UserSharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSharedService],
    }).compile();

    service = module.get<UserSharedService>(UserSharedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
