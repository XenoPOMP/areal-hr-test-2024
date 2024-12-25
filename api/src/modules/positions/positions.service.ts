import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Position } from '@models/position.model';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position)
    private readonly positionModel: typeof Position,
    private readonly historyService: HistoryOfChangesService,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll() {
    return this.positionModel.findAll({
      where: {
        deleted_at: null,
      },
    });
  }

  async create(
    createDto: CreatePositionDto,
    userId: number,
  ): Promise<Position> {
    const transaction = await this.sequelize.transaction();

    try {
      const { name } = createDto;
      const newPosition = await this.positionModel.create(
        { name },
        { transaction },
      );

      await this.historyService.logChange(
        'position',
        { id: newPosition.id, changes: { name } },
        userId,
        transaction,
      );

      await transaction.commit();

      return newPosition;
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating position:', error);
      throw new Error(`Error creating position: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Position | null> {
    return this.positionModel.findByPk(id);
  }

  async update(
    id: number,
    dto: UpdatePositionDto,
    userId: number,
  ): Promise<Position | null> {
    const transaction = await this.sequelize.transaction();

    try {
      const position = await this.positionModel.findByPk(id);
      if (position) {
        const changes: any = {};
        if (dto.name && dto.name !== position.name) {
          changes.name = dto.name;
        }

        const updatedPosition = await position.update(dto, { transaction });

        if (Object.keys(changes).length > 0) {
          await this.historyService.logChange(
            'position',
            { id, changes },
            userId,
            transaction,
          );
        }

        await transaction.commit();

        return updatedPosition;
      }

      return null;
    } catch (error) {
      await transaction.rollback();
      console.error('Error updating position:', error);
      throw new Error(`Error updating position: ${error.message}`);
    }
  }

  async softDeletePosition(id: number, userId: number): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      const position = await this.positionModel.findByPk(id);
      if (!position) {
        throw new Error('Position not found');
      }

      await position.destroy({ transaction });

      await this.historyService.logChange(
        'position',
        { id, changes: { deleted_at: position.deleted_at } },
        userId,
        transaction,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Error soft deleting position:', error);
      throw new Error(`Error soft deleting position: ${error.message}`);
    }
  }
}
