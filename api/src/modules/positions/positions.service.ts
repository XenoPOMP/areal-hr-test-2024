import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  private positions = []; // Временное хранилище для должностей

  findAll() {
    return this.positions;
  }

  findOne(id: string) {
    return this.positions.find(pos => pos.id === id);
  }

  create(createPositionDto: CreatePositionDto) {
    const newPos = { id: Date.now().toString(), ...createPositionDto };
    this.positions.push(newPos);
    return newPos;
  }

  update(id: string, updatePositionDto: UpdatePositionDto) {
    const posIndex = this.positions.findIndex(pos => pos.id === id);
    if (posIndex === -1) return null;
    this.positions[posIndex] = { ...this.positions[posIndex], ...updatePositionDto };
    return this.positions[posIndex];
  }

  remove(id: string) {
    const posIndex = this.positions.findIndex(pos => pos.id === id);
    if (posIndex === -1) return null;
    const removedPos = this.positions.splice(posIndex, 1);
    return removedPos[0];
  }
}