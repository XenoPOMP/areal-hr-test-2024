import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HRActionsController } from './hr_actions.controller';
import { HRActionsService } from './hr_actions.service';
import { HRAction } from './hr_action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HRAction])],
  controllers: [HRActionsController],
  providers: [HRActionsService],
})
export class HRActionsModule {}
