import { Module } from '@nestjs/common';
import { OrganizationsController } from './organisations.controller';
import { OrganizationsService } from './organisations.service';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
export class OrganizationsModule {}