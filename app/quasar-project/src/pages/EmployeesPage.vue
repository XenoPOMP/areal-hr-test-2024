<template>
  <div>
    <!-- Компонент шапки для навигации -->
    <AppHeader />

    <h1>Сотрудники</h1>

    <!-- Форма для добавления нового сотрудника -->
    <form @submit.prevent="createEmployeeHandler" class="form-container">
      <q-input v-model="newEmployee.name" label="Имя" filled required />
      <q-input v-model="newEmployee.surname" label="Фамилия" filled required />
      <q-input v-model="newEmployee.second_name" label="Отчество" filled />
      <q-input
        v-model="newEmployee.date_birth"
        label="Дата рождения"
        type="date"
        filled
        required
      />

      <!-- Форма для данных паспорта -->
      <q-input
        v-model="newEmployee.passport.serial"
        label="Серия паспорта"
        filled
        required
      />
      <q-input
        v-model="newEmployee.passport.number"
        label="Номер паспорта"
        filled
        required
      />
      <q-input
        v-model="newEmployee.passport.date_issue"
        label="Дата выдачи"
        type="date"
        filled
        required
      />
      <q-input
        v-model="newEmployee.passport.code"
        label="Код подразделения"
        filled
        required
      />
      <q-input
        v-model="newEmployee.passport.issued_by"
        label="Кем выдан"
        filled
        required
      />

      <!-- Форма для данных адреса -->
      <q-input
        v-model="newEmployee.address.region"
        label="Регион"
        filled
        required
      />
      <q-input
        v-model="newEmployee.address.settlement"
        label="Населенный пункт"
        filled
        required
      />
      <q-input
        v-model="newEmployee.address.street"
        label="Улица"
        filled
        required
      />
      <q-input
        v-model="newEmployee.address.house"
        label="Дом"
        filled
        required
      />
      <q-input v-model="newEmployee.address.housing" label="Корпус" filled />
      <q-input v-model="newEmployee.address.flat" label="Квартира" filled />

      <q-btn type="submit" label="Добавить" color="primary" />
    </form>

    <!-- Таблица сотрудников -->
    <q-table
      :rows="employees"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="table-container"
    >
      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ getNestedField(props.row, props.col.field) }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-btn
          color="primary"
          label="Изменить"
          @click="startEditingEmployee(props.row)"
          flat
          size="sm"
        />
        <q-btn
          color="negative"
          label="Удалить"
          @click="deleteEmployeeHandler(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>

    <!-- Форма редактирования сотрудника -->
    <div v-if="editMode && editedEmployee" class="edit-form">
      <h3>Изменить данные сотрудника</h3>
      <form @submit.prevent="updateEmployeeHandler">
        <q-input v-model="editedEmployee.name" label="Имя" filled required />
        <q-input
          v-model="editedEmployee.surname"
          label="Фамилия"
          filled
          required
        />
        <q-input v-model="editedEmployee.second_name" label="Отчество" filled />
        <q-input
          v-model="editedEmployee.date_birth"
          label="Дата рождения"
          type="date"
          filled
          required
        />

        <!-- Форма для данных паспорта -->
        <q-input
          v-model="editedEmployee.passport.serial"
          label="Серия паспорта"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.passport.number"
          label="Номер паспорта"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.passport.date_issue"
          label="Дата выдачи"
          type="date"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.passport.code"
          label="Код подразделения"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.passport.issued_by"
          label="Кем выдан"
          filled
          required
        />

        <!-- Форма для данных адреса -->
        <q-input
          v-model="editedEmployee.address.region"
          label="Регион"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.address.settlement"
          label="Населенный пункт"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.address.street"
          label="Улица"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.address.house"
          label="Дом"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.address.housing"
          label="Корпус"
          filled
        />
        <q-input
          v-model="editedEmployee.address.flat"
          label="Квартира"
          filled
        />

        <q-btn type="submit" label="Изменить" color="primary" />
        <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from 'src/api';
import { QTableColumn } from 'quasar';

interface Employee {
  id: number;
  name: string;
  surname: string;
  second_name?: string;
  date_birth: string;
  passport: {
    serial: string;
    number: string;
    date_issue: string;
    code: string;
    issued_by: string;
  };
  address: {
    region: string;
    settlement: string;
    street: string;
    house: string;
    housing?: string;
    flat?: string;
  };
}

const employees = ref<Employee[]>([]);
const newEmployee = ref<Employee>({
  id: 0,
  name: '',
  surname: '',
  second_name: '',
  date_birth: '',
  passport: {
    serial: '',
    number: '',
    date_issue: '',
    code: '',
    issued_by: '',
  },
  address: {
    region: '',
    settlement: '',
    street: '',
    house: '',
    housing: '',
    flat: '',
  },
});
const editMode = ref(false);
const editedEmployee = ref<Employee | null>(null);

const columns: QTableColumn[] = [
  { name: 'name', label: 'Имя', align: 'left', field: 'name', required: true },
  {
    name: 'surname',
    label: 'Фамилия',
    align: 'left',
    field: 'surname',
    required: true,
  },
  {
    name: 'second_name',
    label: 'Отчество',
    align: 'left',
    field: 'second_name',
  },
  {
    name: 'date_birth',
    label: 'Дата рождения',
    align: 'left',
    field: 'date_birth',
    required: true,
  },

  // Паспортные данные
  {
    name: 'serial',
    label: 'Серия паспорта',
    align: 'left',
    field: 'passport.serial',
  },
  {
    name: 'number',
    label: 'Номер паспорта',
    align: 'left',
    field: 'passport.number',
  },
  {
    name: 'date_issue',
    label: 'Дата выдачи',
    align: 'left',
    field: 'passport.date_issue',
  },
  {
    name: 'code',
    label: 'Код подразделения',
    align: 'left',
    field: 'passport.code',
  },
  {
    name: 'issued_by',
    label: 'Кем выдан',
    align: 'left',
    field: 'passport.issued_by',
  },

  // Адрес
  { name: 'region', label: 'Регион', align: 'left', field: 'address.region' },
  {
    name: 'settlement',
    label: 'Населенный пункт',
    align: 'left',
    field: 'address.settlement',
  },
  { name: 'street', label: 'Улица', align: 'left', field: 'address.street' },
  { name: 'house', label: 'Дом', align: 'left', field: 'address.house' },
  { name: 'housing', label: 'Корпус', align: 'left', field: 'address.housing' },
  { name: 'flat', label: 'Квартира', align: 'left', field: 'address.flat' },
];

const getNestedField = (row: Record<string, unknown>, field: string) => {
  return field
    .split('.')
    .reduce<Record<string, unknown> | undefined>((obj, key) => {
      if (obj && typeof obj === 'object' && key in obj) {
        return (obj as Record<string, unknown>)[key] as
          | Record<string, unknown>
          | undefined;
      }
      return undefined; // Возвращаем undefined, если объект не найден или свойство отсутствует
    }, row); // Указываем начальное значение как row
};

const loadEmployees = async () => {
  employees.value = await getEmployees();
};

const createEmployeeHandler = async () => {
  await createEmployee(newEmployee.value);
  await loadEmployees();
  newEmployee.value = {
    id: 0,
    name: '',
    surname: '',
    second_name: '',
    date_birth: '',
    passport: {
      serial: '',
      number: '',
      date_issue: '',
      code: '',
      issued_by: '',
    },
    address: {
      region: '',
      settlement: '',
      street: '',
      house: '',
      housing: '',
      flat: '',
    },
  };
};

const deleteEmployeeHandler = async (id: number) => {
  await deleteEmployee(String(id));
  await loadEmployees();
};

const startEditingEmployee = (employee: Employee) => {
  editMode.value = true;
  editedEmployee.value = { ...employee };
};

const updateEmployeeHandler = async () => {
  if (editedEmployee.value) {
    const {
      id,
      name,
      surname,
      second_name = '',
      date_birth,
      passport,
      address,
    } = editedEmployee.value;

    // Формируем объект в нужном формате
    const employeeData = {
      id,
      name,
      surname,
      second_name,
      date_birth,
      serial: passport.serial,
      number: passport.number,
      date_issue: passport.date_issue,
      code: passport.code,
      issued_by: passport.issued_by,
      region: address.region,
      settlement: address.settlement,
      street: address.street,
      house: address.house,
      housing: address.housing || '',
      flat: address.flat || '',
    };

    try {
      await updateEmployee(employeeData.id, employeeData);
      await loadEmployees();
      editMode.value = false;
      editedEmployee.value = null;
    } catch (error) {
      console.error('Ошибка при обновлении сотрудника:', error);
    }
  }
};

const cancelEdit = () => {
  editMode.value = false;
  editedEmployee.value = null;
};

onMounted(loadEmployees);
</script>

<style scoped>
.table-container {
  margin-top: 20px;
}
.form-container {
  margin-top: 20px;
  max-width: 600px;
}
.edit-form {
  margin-top: 20px;
}
.edit-form form {
  display: flex;
  flex-direction: column;
}
</style>
