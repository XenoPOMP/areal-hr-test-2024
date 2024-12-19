import { QTableColumn } from 'quasar';

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
