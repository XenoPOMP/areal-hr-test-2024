import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationsService } from './organizations.service';

describe('OrganizationsService', () => {
  let service: OrganisationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganisationsService],
    }).compile();

    service = module.get<OrganisationsService>(OrganisationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
