import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HRAction } from './hr_action.entity';

@Injectable()
export class HRActionsService {
  constructor(
    @InjectRepository(HRAction)
    private readonly hrActionsRepository: Repository<HRAction>,
  ) {}

  // Получение всех HR действий
  async findAll(): Promise<HRAction[]> {
    return this.hrActionsRepository.find();
  }

  // Получение HR действия по ID
  async findOne(id: number): Promise<HRAction> {
    const hrAction = await this.hrActionsRepository.findOne({ where: { id } });
    if (!hrAction) {
      throw new NotFoundException(`HR Action with ID ${id} not found`);
    }
    return hrAction;
  }

  // Создание нового HR действия
  async create(actionData: Partial<HRAction>): Promise<HRAction> {
    const hrAction = this.hrActionsRepository.create(actionData);
    return this.hrActionsRepository.save(hrAction);
  }

  // Обновление HR действия по ID
  async update(id: number, actionData: Partial<HRAction>): Promise<HRAction> {
    await this.hrActionsRepository.update(id, actionData);
    const updatedHRAction = await this.findOne(id); // Проверяем наличие обновленного действия
    return updatedHRAction;
  }

  // Удаление HR действия по ID
  async remove(id: number): Promise<void> {
    const deleteResult = await this.hrActionsRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`HR Action with ID ${id} not found`);
    }
  }
}
