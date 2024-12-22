import { QTableColumn } from 'quasar';

export const HRActionsColumns: QTableColumn[] = [
  {
    name: 'employee_name',
    label: 'Сотрудник',
    align: 'left',
    field: 'employee_name',
    required: true,
  },
  {
    name: 'department_name',
    label: 'Отдел',
    align: 'left',
    field: 'department_name',
    required: true,
  },
  {
    name: 'position_name',
    label: 'Должность',
    align: 'left',
    field: 'position_name',
    required: true,
  },
  {
    name: 'action_type',
    label: 'Тип операции',
    align: 'left',
    field: 'action_type',
    required: true,
  },
  {
    name: 'date',
    label: 'Дата',
    align: 'left',
    field: 'date',
    required: true,
  },
  {
    name: 'salary',
    label: 'Зарплата',
    align: 'right',
    field: 'salary',
    required: true,
  },
  {
    name: 'actions',
    label: 'Действия',
    align: 'center',
    field: 'actions',
    required: false,
    sortable: false,
  },
];
