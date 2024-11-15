import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from './address.model';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address)
    private readonly addressModel: typeof Address,
  ) {}

  async findAll(): Promise<Address[]> {
    return this.addressModel.findAll();
  }

  // Создание адреса
  async create(createDto: CreateAddressDto): Promise<Address> {
    // Деструктурируем DTO для передачи всех данных
    const { region, settlement, street, house, housing, flat } = createDto;

    // Создаем адрес, передавая все данные как объект
    return this.addressModel.create({
      region,
      settlement,
      street,
      house,
      housing,
      flat,
    });
  }

  async findOne(id: number): Promise<Address | null> {
    return this.addressModel.findByPk(id);
  }

  async update(id: number, dto: UpdateAddressDto): Promise<Address | null> {
    const address = await this.addressModel.findByPk(id);
    if (address) {
      return address.update(dto);
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const address = await this.addressModel.findByPk(id);
    if (address) {
      await address.destroy();
    }
  }
}
