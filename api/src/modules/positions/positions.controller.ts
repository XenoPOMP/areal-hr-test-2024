import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id);
  }

  @Post()
  async create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionsService.update(id, updatePositionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.positionsService.remove(id);
  }
}