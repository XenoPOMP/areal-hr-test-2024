export interface Employee {
  id: number;
  name: string;
  surname: string;
  second_name?: string;
  date_birth: string;
  position_id: number | null;
  passport: Passport;
  address: Address;
}

export interface Passport {
  serial: string;
  number: string;
  date_issue: string;
  code: string;
  issued_by: string;
}

export interface Address {
  region: string;
  settlement: string;
  street: string;
  house: string;
  housing: string;
  flat: string;
}
