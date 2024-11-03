import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganisationsService {
    getAllOrganizations() {
        return [{ name: 'Example Organization' }];
    }
}