import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { OrganisationsService } from './organizations.service';
import { CreateOrganisationDto } from './dto/create-organization.dto';
import { UpdateOrganisationDto } from './dto/update-organization.dto';
import { Organisation } from '@models/organization.model';
import { Request } from 'express';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganisationsService,
    private readonly historyOfChangesService: HistoryOfChangesService, // Внедряем сервис логирования
  ) {}

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
    @Req() req: Request, // Для логирования
  ): Promise<Organisation> {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const newOrganisation = await this.organizationsService.create(createDto);

    await this.historyOfChangesService.logChange(
      'organisation',
      newOrganisation,
      userId,
    );

    return newOrganisation;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateOrganisationDto,
    @Req() req: Request,
  ): Promise<Organisation> {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const updatedOrganisation = await this.organizationsService.update(
      id,
      updateDto,
      userId,
    );

    if (!updatedOrganisation) {
      throw new NotFoundException('Organization not found');
    }

    return updatedOrganisation;
  }

  @Patch(':id/soft-delete')
  async softDeleteOrganization(@Param('id') id: number, @Req() req: Request) {
    const userId = req.session?.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    await this.organizationsService.softDeleteOrganization(id);

    await this.historyOfChangesService.logChange(
      'organisation',
      { id, deleted_at: new Date() },
      userId,
    );
  }
}
