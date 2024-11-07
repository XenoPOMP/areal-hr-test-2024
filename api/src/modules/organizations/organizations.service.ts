import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
      @InjectRepository(Organization)
      private readonly organizationRepository: Repository<Organization>,
  ) {}

  // Получение всех организаций
  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  // Создание новой организации
  async create(orgData: Partial<Organization>): Promise<Organization> {
    console.log('Creating new organization with data:', orgData);
    const organization = this.organizationRepository.create({
      org_name: orgData.org_name,
      org_comment: orgData.org_comment
    });
    return this.organizationRepository.save(organization);
  }

  // Обновление организации по ID
  async update(id: number, orgData: Partial<Organization>): Promise<Organization> {
    console.log(`Updating organization with ID ${id}`, orgData); // Лог перед обновлением
    await this.organizationRepository.update(id, orgData);
    const updatedOrganization = await this.organizationRepository.findOne({ where: { id } });
    if (!updatedOrganization) {
      console.error(`Organization with ID ${id} not found`);
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    console.log(`Organization updated successfully`, updatedOrganization); // Лог после обновления
    return updatedOrganization;
  }

  // Удаление организации по ID
  async remove(id: number): Promise<void> {
    console.log(`Deleting organization with ID ${id}`); // Лог перед удалением
    const deleteResult = await this.organizationRepository.delete(id);
    if (!deleteResult.affected) {
      console.error(`Organization with ID ${id} not found`);
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    console.log(`Organization deleted successfully`); // Лог после успешного удаления
  }
}