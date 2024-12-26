import { QTableColumn } from 'quasar';

export const usersColumns: QTableColumn[] = [
  {
    name: 'surname',
    required: true,
    label: 'Фамилия',
    align: 'left',
    field: 'surname',
  },
  {
    name: 'name',
    required: true,
    label: 'Имя',
    align: 'left',
    field: 'name',
  },
  {
    name: 'second_name',
    label: 'Отчество',
    align: 'left',
    field: 'second_name',
  },
  {
    name: 'login',
    required: true,
    label: 'Логин',
    align: 'left',
    field: 'login',
  },
  {
    name: 'role',
    label: 'Роль',
    align: 'left',
    field: 'role',
  },
  {
    name: 'actions',
    label: 'Действия',
    align: 'center',
    field: 'actions',
  },
];
