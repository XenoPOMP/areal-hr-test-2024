import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Req,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Request } from 'express';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll() {
    return this.positionsService.findAll();
  }

  @Post()
  async create(@Body() createDto: CreatePositionDto, @Req() req: Request) {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.positionsService.create(createDto, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.positionsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdatePositionDto,
    @Req() req: Request,
  ) {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.positionsService.update(id, updateDto, userId);
  }

  @Patch(':id/soft-delete')
  async softDeletePosition(@Param('id') id: number, @Req() req: Request) {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    await this.positionsService.softDeletePosition(id, userId);
    return;
  }
}
