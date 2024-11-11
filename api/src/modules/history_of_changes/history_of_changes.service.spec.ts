import { Test, TestingModule } from '@nestjs/testing';
import { HistoryOfChangesService } from './history_of_changes.service';

describe('HistoryOfChangesService', () => {
  let service: HistoryOfChangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryOfChangesService],
    }).compile();

    service = module.get<HistoryOfChangesService>(HistoryOfChangesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
