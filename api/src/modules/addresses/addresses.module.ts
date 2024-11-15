import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './address.model';

@Module({
  imports: [SequelizeModule.forFeature([Address])],
  exports: [SequelizeModule],
})
export class AddressesModule {}
