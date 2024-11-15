import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { getModelToken } from '@nestjs/sequelize';
import { Department } from './department.model';

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getModelToken(Department),
          useValue: {
            findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'HR' }]),
            create: jest
              .fn()
              .mockImplementation((dto) => ({ id: Date.now(), ...dto })),
            findByPk: jest.fn().mockResolvedValue({ id: 1, name: 'HR' }),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
