import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize'; // Импортируем SequelizeModule
import { OrganisationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organisation } from './organization.model'; // Импортируем модель

@Module({
  imports: [SequelizeModule.forFeature([Organisation])], // Используем SequelizeModule
  providers: [OrganisationsService],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
