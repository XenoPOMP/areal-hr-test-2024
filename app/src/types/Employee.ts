export interface PassportInfo {
  serial: string;
  number: string;
  date_issue: string;
  issued_by: string;
  code: string;
}

export interface AddressInfo {
  region: string;
  city: string;
  street: string;
  building: string;
  apartment: string;
}

export interface EmployeeBaseData {
  id: number;
  name: string;
  surname: string;
  second_name: string;
  date_birth: string;
  position_id: number | null;
  passport: PassportInfo;
  address: AddressInfo;
}
