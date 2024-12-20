import { QTableColumn } from 'quasar';

export const EmployeeColumns: QTableColumn[] = [
  { name: 'name', label: 'Имя', align: 'left', field: 'name' },
  { name: 'surname', label: 'Фамилия', align: 'left', field: 'surname' },
  {
    name: 'second_name',
    label: 'Отчество',
    align: 'left',
    field: 'second_name',
  },
  {
    name: 'date_birth',
    label: 'Дата рождения',
    align: 'center',
    field: 'date_birth',
  },

  {
    name: 'passport_serial',
    label: 'Серия паспорта',
    align: 'center',
    field: 'passport.serial',
  },
  {
    name: 'passport_number',
    label: 'Номер паспорта',
    align: 'center',
    field: 'passport.number',
  },
  {
    name: 'passport_date_issue',
    label: 'Дата выдачи',
    align: 'center',
    field: 'passport.date_issue',
  },
  {
    name: 'passport_code',
    label: 'Код подразделения',
    align: 'center',
    field: 'passport.code',
  },
  {
    name: 'passport_issued_by',
    label: 'Кем выдан',
    align: 'left',
    field: 'passport.issued_by',
  },

  {
    name: 'address_region',
    label: 'Регион',
    align: 'left',
    field: 'address.region',
  },
  {
    name: 'address_settlement',
    label: 'Город',
    align: 'left',
    field: 'address.settlement',
  },
  {
    name: 'address_street',
    label: 'Улица',
    align: 'left',
    field: 'address.street',
  },
  {
    name: 'address_house',
    label: 'Дом',
    align: 'center',
    field: 'address.house',
  },
  {
    name: 'address_housing',
    label: 'Корпус',
    align: 'center',
    field: 'address.housing',
  },
  {
    name: 'address_flat',
    label: 'Квартира',
    align: 'center',
    field: 'address.flat',
  },
];
