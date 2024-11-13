import { Test, TestingModule } from '@nestjs/testing';
import { HRActionsService } from './hr_actions.service';

describe('HrActionsService', () => {
  let service: HRActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HRActionsService],
    }).compile();

    service = module.get<HRActionsService>(HRActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
