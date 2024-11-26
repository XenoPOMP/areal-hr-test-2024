import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from '@models/address.model';
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

  async softDeleteAddress(id: number): Promise<void> {
    const address = await Address.findByPk(id);

    if (!address) {
      throw new Error('Address not found');
    }

    address.deleted_at = new Date();
    await address.save();
  }
}
