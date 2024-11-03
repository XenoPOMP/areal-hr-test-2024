import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganisationsModule } from './organisations/organisations.module';

@Module({
  imports: [OrganisationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
