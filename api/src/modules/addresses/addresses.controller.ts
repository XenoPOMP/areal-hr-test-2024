import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from '@models/address.model';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findAll(): Promise<Address[]> {
    return this.addressesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Address> {
    const address = await this.addressesService.findOne(id);
    if (!address) {
      throw new NotFoundException('Адрес не найден');
    }
    return address;
  }

  @Post()
  async create(@Body() createDto: CreateAddressDto): Promise<Address> {
    return this.addressesService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateAddressDto,
  ): Promise<Address> {
    const updatedAddress = await this.addressesService.update(id, updateDto);
    if (!updatedAddress) {
      throw new NotFoundException('Адрес не найден');
    }
    return updatedAddress;
  }

  @Delete(':id')
  async softDeleteAddress(@Param('id') id: number) {
    await this.addressesService.softDeleteAddress(id);
    return;
  }
}
