import { Test, TestingModule } from '@nestjs/testing';
import { HrActionsService } from './hr_actions.service';

describe('HrActionsService', () => {
  let service: HrActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HrActionsService],
    }).compile();

    service = module.get<HrActionsService>(HrActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
