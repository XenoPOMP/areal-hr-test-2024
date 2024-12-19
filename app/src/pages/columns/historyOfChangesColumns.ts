import { QTableColumn } from 'quasar';

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
