export class CreateAddressDto {
  region: string;
  settlement: string;
  street: string;
  house: string;
  housing?: string;
  flat?: string;
}
