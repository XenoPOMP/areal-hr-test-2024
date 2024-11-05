import { Controller, Get } from '@nestjs/common';
import { OrganizationsService  } from './organisations.service';

@Controller('organisations')
export class OrganizationsController {
    constructor(private readonly organisationsService: OrganizationsService) {}

    @Get()
    getAllOrganizations() {
        return this.organisationsService.getAllOrganizations();
    }
}