import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';

@Injectable()
export class PositionsService {
  constructor(
      @InjectRepository(Position)
      private readonly positionRepository: Repository<Position>,
  ) {}

  // Получение всех организаций
  async findAll(): Promise<Position[]> {
    return this.positionRepository.find();
  }

  // Создание новой организации
  async create(posData: Partial<Position>): Promise<Position> {
    console.log('Creating new position with data:', posData);
    const position = this.positionRepository.create({
      name: posData.name
    });
    return this.positionRepository.save(position);
  }

  // Обновление организации по ID
  async update(id: number, posData: Partial<Position>): Promise<Position> {
    console.log(`Updating position with ID ${id}`, posData); // Лог перед обновлением
    await this.positionRepository.update(id, posData);
    const updatedPosition = await this.positionRepository.findOne({ where: { id } });
    if (!updatedPosition) {
      console.error(`Position with ID ${id} not found`);
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    console.log(`Position updated successfully`, updatedPosition); // Лог после обновления
    return updatedPosition;
  }

  // Удаление организации по ID
  async remove(id: number): Promise<void> {
    console.log(`Deleting position with ID ${id}`); // Лог перед удалением
    const deleteResult = await this.positionRepository.delete(id);
    if (!deleteResult.affected) {
      console.error(`Position with ID ${id} not found`);
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    console.log(`Position deleted successfully`); // Лог после успешного удаления
  }
}