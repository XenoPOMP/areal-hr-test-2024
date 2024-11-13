import { Test, TestingModule } from '@nestjs/testing';
import { HRActionsController } from './hr_actions.controller';

describe('HrActionsController', () => {
  let controller: HRActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HRActionsController],
    }).compile();

    controller = module.get<HRActionsController>(HRActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
