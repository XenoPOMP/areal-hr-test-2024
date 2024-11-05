import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  private organizations = []; // Временное хранилище

  findAll() {
    return this.organizations;
  }

  findOne(id: string) {
    return this.organizations.find(org => org.id === id);
  }

  create(createOrganizationDto: CreateOrganizationDto) {
    const newOrg = { id: Date.now().toString(), ...createOrganizationDto };
    this.organizations.push(newOrg);
    return newOrg;
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const orgIndex = this.organizations.findIndex(org => org.id === id);
    if (orgIndex === -1) return null;
    this.organizations[orgIndex] = { ...this.organizations[orgIndex], ...updateOrganizationDto };
    return this.organizations[orgIndex];
  }

  remove(id: string) {
    const orgIndex = this.organizations.findIndex(org => org.id === id);
    if (orgIndex === -1) return null;
    const removedOrg = this.organizations.splice(orgIndex, 1);
    return removedOrg[0];
  }
}