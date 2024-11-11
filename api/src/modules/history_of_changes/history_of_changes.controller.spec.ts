import { Test, TestingModule } from '@nestjs/testing';
import { HistoryOfChangesController } from './history_of_changes.controller';

describe('HistoryOfChangesController', () => {
  let controller: HistoryOfChangesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryOfChangesController],
    }).compile();

    controller = module.get<HistoryOfChangesController>(HistoryOfChangesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
