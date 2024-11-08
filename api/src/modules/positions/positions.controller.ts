import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { Position } from './position.entity';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  findAll(): Promise<Position[]> {
    return this.positionsService.findAll();
  }

  @Post()
  create(@Body() posData: Partial<Position>): Promise<Position> {
    console.log('Received data for creation:', posData);
    return this.positionsService.create(posData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() posData: Partial<Position>): Promise<Position> {
    return this.positionsService.update(id, posData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.positionsService.remove(id);
  }
}