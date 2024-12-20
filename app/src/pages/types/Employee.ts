export interface PassportInfo {
  serial: string;
  number: string;
  date_issue: string;
  issued_by: string;
  code: string;
}

export interface AddressInfo {
  region: string;
  settlement: string;
  street: string;
  house: string;
  housing: string;
  flat: string;
}

export interface EmployeeBaseData {
  id: number;
  name: string;
  surname: string;
  second_name: string;
  date_birth: string;
  position_id: number | null;
  passport_id?: number;
  address_id?: number;
  passport: PassportInfo;
  address: AddressInfo;
  files: File[];
  userId?: number;
}

export interface File {
  id: number;
  name: string;
  link: string;
}

export interface EmployeeInput {
  id?: number;
  deleted_at?: Date | null;
  name: string;
  surname: string;
  second_name?: string | null;
  date_birth: string;
  position_id: number | null;
  passport: {
    serial: string;
    number: string;
    date_issue: string;
    issued_by: string;
    code?: string | null;
  };
  address: {
    region: string;
    settlement: string;
    street: string;
    house?: string | null;
    housing?: string | null;
    flat?: string | null;
  };
}
