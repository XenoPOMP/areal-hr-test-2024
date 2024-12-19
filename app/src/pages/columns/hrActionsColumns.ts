import { QTableColumn } from 'quasar';

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
