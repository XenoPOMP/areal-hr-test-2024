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
