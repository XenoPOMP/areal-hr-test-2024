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

  async findOne(id: number): Promise<Address | null> {
    // Используем id как ключ для поиска связанного адреса
    return this.addressModel.findOne({ where: { id } });
  }

  async create(dto: CreateAddressDto): Promise<Address> {
    return this.addressModel.create({ ...dto });
  }

  async update(id: number, dto: UpdateAddressDto): Promise<Address | null> {
    const address = await this.findOne(id);
    if (address) {
      return address.update({ ...dto });
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    if (address) {
      await address.destroy();
    }
  }
}
