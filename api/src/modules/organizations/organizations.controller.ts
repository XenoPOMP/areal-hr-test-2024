import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Organization } from './organization.entity';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll(): Promise<Organization[]> {
    return this.organizationsService.findAll();
  }

  @Post()
  create(@Body() orgData: Partial<Organization>): Promise<Organization> {
    console.log('Received data for creation:', orgData);
    return this.organizationsService.create(orgData);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() orgData: Partial<Organization>,
  ): Promise<Organization> {
    return this.organizationsService.update(id, orgData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.organizationsService.remove(id);
  }
}
