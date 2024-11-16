import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let service: DepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        {
          provide: DepartmentsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'HR' }]),
            create: jest
              .fn()
              .mockImplementation((dto: CreateDepartmentDto) => ({
                id: Date.now(),
                ...dto,
              })),
            update: jest
              .fn()
              .mockImplementation((id: number, dto: UpdateDepartmentDto) => ({
                id,
                ...dto,
              })),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    service = module.get<DepartmentsService>(DepartmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      await expect(controller.findAll()).resolves.toEqual([
        { id: 1, name: 'HR' },
      ]);
    });
  });

  describe('create', () => {
    it('should create a department', async () => {
      const dto: CreateDepartmentDto = { name: 'Finance' };
      await expect(controller.create(dto)).resolves.toEqual({
        id: expect.any(Number),
        ...dto,
      });
    });
  });

  describe('update', () => {
    it('should update a department', async () => {
      const dto: UpdateDepartmentDto = { name: 'Updated Department' };
      await expect(controller.update(1, dto)).resolves.toEqual({
        id: 1,
        ...dto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a department', async () => {
      await expect(controller.remove(1)).resolves.toEqual({});
    });
  });
});
