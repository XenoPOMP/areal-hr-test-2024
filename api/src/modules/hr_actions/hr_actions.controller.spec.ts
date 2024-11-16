import { Test, TestingModule } from '@nestjs/testing';
import { HrActionsController } from './hr_actions.controller';

describe('HrActionsController', () => {
  let controller: HrActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HrActionsController],
    }).compile();

    controller = module.get<HrActionsController>(HrActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
