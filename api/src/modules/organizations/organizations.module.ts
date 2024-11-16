import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrganisationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organisation } from '@models/organization.model';

@Module({
  imports: [SequelizeModule.forFeature([Organisation])],
  providers: [OrganisationsService],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
