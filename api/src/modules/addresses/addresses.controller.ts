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
import { Address } from './address.model';

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
      throw new NotFoundException('Address not found');
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
      throw new NotFoundException('Address not found');
    }
    return updatedAddress;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const address = await this.addressesService.findOne(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return this.addressesService.remove(id);
  }
}
