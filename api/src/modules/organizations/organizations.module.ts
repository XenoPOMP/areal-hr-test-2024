import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize'; // Импортируем SequelizeModule
import { OrganisationsService } from './organizations.service';
import { OrganisationsController } from './organizations.controller';
import { Organisation } from './organization.model'; // Импортируем модель

@Module({
  imports: [SequelizeModule.forFeature([Organisation])], // Используем SequelizeModule
  providers: [OrganisationsService],
  controllers: [OrganisationsController],
})
export class OrganizationsModule {}
