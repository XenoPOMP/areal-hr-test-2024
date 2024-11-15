import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { OrganisationsService } from './organizations.service';
import { CreateOrganisationDto } from './dto/create-organization.dto';
import { UpdateOrganisationDto } from './dto/update-organization.dto';
import { Organisation } from './organization.model';

@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Get()
  async findAll(): Promise<Organisation[]> {
    return this.organisationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Organisation> {
    const organisation = await this.organisationsService.findOne(id);
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }
    return organisation;
  }

  @Post()
  async create(
    @Body() createDto: CreateOrganisationDto,
  ): Promise<Organisation> {
    return this.organisationsService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateOrganisationDto,
  ): Promise<Organisation> {
    const updatedOrganisation = await this.organisationsService.update(
      id,
      updateDto,
    );
    if (!updatedOrganisation) {
      throw new NotFoundException('Organisation not found');
    }
    return updatedOrganisation;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const organisation = await this.organisationsService.findOne(id);
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }
    return this.organisationsService.remove(id);
  }
}
