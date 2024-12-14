import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Position } from '@models/position.model';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position)
    private readonly positionModel: typeof Position,
    private readonly historyService: HistoryOfChangesService,
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
    const { name } = createDto;
    const newPosition = await this.positionModel.create({ name });

    await this.historyService.logChange(
      'position',
      { id: newPosition.id, changes: { name } },
      userId,
    );

    return newPosition;
  }

  async findOne(id: number): Promise<Position | null> {
    return this.positionModel.findByPk(id);
  }

  async update(
    id: number,
    dto: UpdatePositionDto,
    userId: number,
  ): Promise<Position | null> {
    const position = await this.positionModel.findByPk(id);
    if (position) {
      const changes: any = {};
      if (dto.name && dto.name !== position.name) {
        changes.name = dto.name;
      }

      const updatedPosition = await position.update(dto);

      if (Object.keys(changes).length > 0) {
        await this.historyService.logChange(
          'position',
          { id, changes },
          userId,
        );
      }

      return updatedPosition;
    }
    return null;
  }

  async softDeletePosition(id: number, userId: number): Promise<void> {
    const position = await this.positionModel.findByPk(id);

    if (!position) {
      throw new Error('Position not found');
    }

    position.deleted_at = new Date();
    await position.save();

    await this.historyService.logChange(
      'position',
      { id, changes: { deleted_at: position.deleted_at } },
      userId,
    );
  }
}
