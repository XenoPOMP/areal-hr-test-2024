import { QTableColumn } from 'quasar';

export const departmentColumns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Название',
    align: 'left',
    field: 'name',
    required: true,
  },
  { name: 'comment', label: 'Комментарий', align: 'left', field: 'comment' },
  {
    name: 'actions',
    label: 'Действия',
    align: 'center',
    field: (row) => row.id,
  },
];

export const employeeColumns = [
  { name: 'name', label: 'Имя', align: 'left' as const, field: 'name' },
  {
    name: 'surname',
    label: 'Фамилия',
    align: 'left' as const,
    field: 'surname',
  },
  {
    name: 'second_name',
    label: 'Отчество',
    align: 'left' as const,
    field: 'second_name',
  },
  {
    name: 'date_birth',
    label: 'Дата рождения',
    align: 'center' as const,
    field: 'date_birth',
  },
  {
    name: 'passport.serial',
    label: 'Серия паспорта',
    align: 'center' as const,
    field: 'passport.serial',
  },
  {
    name: 'passport.number',
    label: 'Номер паспорта',
    align: 'center' as const,
    field: 'passport.number',
  },
  {
    name: 'passport.date_issue',
    label: 'Дата выдачи',
    align: 'center' as const,
    field: 'passport.date_issue',
  },
  {
    name: 'passport.code',
    label: 'Код подразделения',
    align: 'center' as const,
    field: 'passport.code',
  },
  {
    name: 'passport.issued_by',
    label: 'Кем выдан',
    align: 'left' as const,
    field: 'passport.issued_by',
  },
  {
    name: 'address.region',
    label: 'Регион',
    align: 'left' as const,
    field: 'address.region',
  },
  {
    name: 'address.settlement',
    label: 'Город',
    align: 'left' as const,
    field: 'address.settlement',
  },
  {
    name: 'address.street',
    label: 'Улица',
    align: 'left' as const,
    field: 'address.street',
  },
  {
    name: 'address.house',
    label: 'Дом',
    align: 'center' as const,
    field: 'address.house',
  },
  {
    name: 'address.housing',
    label: 'Корпус',
    align: 'center' as const,
    field: 'address.housing',
  },
  {
    name: 'address.flat',
    label: 'Квартира',
    align: 'center' as const,
    field: 'address.flat',
  },
];

export const fileColumns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Название',
    align: 'left',
    field: 'name',
    required: true,
  },
  {
    name: 'link',
    label: 'Ссылка на файл',
    align: 'left',
    field: 'link',
    required: true,
  },
  { name: 'actions', label: 'Действия', align: 'center', field: 'actions' },
];

export const history_of_changesColumns: QTableColumn[] = [
  {
    name: 'object',
    label: 'Объект',
    align: 'left',
    field: 'object',
    required: true,
  },
  {
    name: 'login',
    label: 'Кто изменил',
    align: 'left',
    field: 'login',
    required: true,
  },
  {
    name: 'field',
    label: 'Изменённые поля',
    align: 'left',
    field: 'field',
    required: true,
  },
  { name: 'date', label: 'Дата', align: 'left', field: 'date', required: true },
  { name: 'actions', label: 'Действия', align: 'center', field: 'actions' },
];

export const HRactionsColumns: QTableColumn[] = [
  {
    name: 'action_type',
    label: 'Тип операции',
    align: 'left',
    field: 'action_type',
    required: true,
  },
  { name: 'date', label: 'Дата', align: 'left', field: 'date', required: true },
  {
    name: 'salary',
    label: 'Зарплата',
    align: 'right',
    field: 'salary',
    required: true,
  },
  { name: 'actions', label: 'Действия', align: 'center', field: 'actions' },
];

export const organizationsColumns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Название',
    align: 'left',
    field: 'name',
    required: true,
  },
  { name: 'comment', label: 'Комментарий', align: 'left', field: 'comment' },
  {
    name: 'actions',
    label: 'Действия',
    align: 'center',
    field: (row) => row.id,
  },
];

export const positionsColumns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Название',
    align: 'left',
    field: 'name',
    required: true,
  },
  {
    name: 'actions',
    label: 'Действия',
    align: 'center',
    field: (row) => row.id,
  },
];
