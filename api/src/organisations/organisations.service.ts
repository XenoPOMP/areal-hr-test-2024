import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationsService {
  getAllOrganizations() {
    return [{ id: 1, name: 'Example Organization' }];
  }
}