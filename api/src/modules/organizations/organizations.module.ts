import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrganisationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organisation } from '@models/organization.model';
import { HistoryOfChanges } from 'src/models/history_of_change.model';
import { HistoryOfChangesService } from 'src/modules/history_of_changes/history_of_changes.service';

@Module({
  imports: [SequelizeModule.forFeature([Organisation, HistoryOfChanges])],
  providers: [OrganisationsService, HistoryOfChangesService],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
