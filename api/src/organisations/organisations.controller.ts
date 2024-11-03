import { Controller, Get } from '@nestjs/common';
import { OrganisationsService  } from './organisations.service';

@Controller('organisations')
export class OrganisationsController {
    constructor(private readonly organisationsService: OrganisationsService) {}

    @Get()
    getAllOrganisations() {
        return this.organisationsService.getAllOrganizations();
    }
}