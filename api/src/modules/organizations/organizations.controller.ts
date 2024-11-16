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

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganisationsService) {}

  @Get()
  async findAll(): Promise<Organisation[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Organisation> {
    const organization = await this.organizationsService.findOne(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  @Post()
  async create(
    @Body() createDto: CreateOrganisationDto,
  ): Promise<Organisation> {
    return this.organizationsService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateOrganisationDto,
  ): Promise<Organisation> {
    const updatedOrganization = await this.organizationsService.update(
      id,
      updateDto,
    );
    if (!updatedOrganization) {
      throw new NotFoundException('Organization not found');
    }
    return updatedOrganization;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const organization = await this.organizationsService.findOne(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return this.organizationsService.remove(id);
  }
}
