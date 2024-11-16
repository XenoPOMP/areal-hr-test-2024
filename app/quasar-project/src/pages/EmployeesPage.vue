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
        v-model="newEmployee.serial"
        label="Серия паспорта"
        filled
        required
      />
      <q-input
        v-model="newEmployee.number"
        label="Номер паспорта"
        filled
        required
      />
      <q-input
        v-model="newEmployee.date_issue"
        label="Дата выдачи"
        type="date"
        filled
        required
      />
      <q-input
        v-model="newEmployee.code"
        label="Код подразделения"
        filled
        required
      />
      <q-input
        v-model="newEmployee.issued_by"
        label="Кем выдан"
        filled
        required
      />

      <!-- Форма для данных адреса -->
      <q-input v-model="newEmployee.region" label="Регион" filled required />
      <q-input
        v-model="newEmployee.settlement"
        label="Населенный пункт"
        filled
        required
      />
      <q-input v-model="newEmployee.street" label="Улица" filled required />
      <q-input v-model="newEmployee.house" label="Дом" filled required />
      <q-input v-model="newEmployee.housing" label="Корпус" filled />
      <q-input v-model="newEmployee.flat" label="Квартира" filled />

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
          v-model="editedEmployee.serial"
          label="Серия паспорта"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.number"
          label="Номер паспорта"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.date_issue"
          label="Дата выдачи"
          type="date"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.code"
          label="Код подразделения"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.issued_by"
          label="Кем выдан"
          filled
          required
        />

        <!-- Форма для данных адреса -->
        <q-input
          v-model="editedEmployee.region"
          label="Регион"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.settlement"
          label="Населенный пункт"
          filled
          required
        />
        <q-input
          v-model="editedEmployee.street"
          label="Улица"
          filled
          required
        />
        <q-input v-model="editedEmployee.house" label="Дом" filled required />
        <q-input v-model="editedEmployee.housing" label="Корпус" filled />
        <q-input v-model="editedEmployee.flat" label="Квартира" filled />

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
  id: string;
  name: string;
  surname: string;
  second_name?: string;
  date_birth: string;
  serial: string;
  number: string;
  date_issue: string;
  code: string;
  issued_by: string;
  region: string;
  settlement: string;
  street: string;
  house: string;
  housing?: string;
  flat?: string;
}

const employees = ref<Employee[]>([]);
const newEmployee = ref<Employee>({
  id: '',
  name: '',
  surname: '',
  second_name: '',
  date_birth: '',
  serial: '',
  number: '',
  date_issue: '',
  code: '',
  issued_by: '',
  region: '',
  settlement: '',
  street: '',
  house: '',
  housing: '',
  flat: '',
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
  {
    name: 'serial',
    label: 'Серия паспорта',
    align: 'left',
    field: 'serial',
    required: true,
  },
  {
    name: 'number',
    label: 'Номер паспорта',
    align: 'left',
    field: 'number',
    required: true,
  },
  {
    name: 'region',
    label: 'Регион',
    align: 'left',
    field: 'region',
    required: true,
  },
  {
    name: 'settlement',
    label: 'Населенный пункт',
    align: 'left',
    field: 'settlement',
    required: true,
  },
  {
    name: 'street',
    label: 'Улица',
    align: 'left',
    field: 'street',
    required: true,
  },
  {
    name: 'house',
    label: 'Дом',
    align: 'left',
    field: 'house',
    required: true,
  },
];

const loadEmployees = async () => {
  try {
    employees.value = await getEmployees();
  } catch (error) {
    console.error('Ошибка загрузки сотрудников:', error);
  }
};

onMounted(() => {
  loadEmployees();
});

const createEmployeeHandler = async () => {
  try {
    await createEmployee(newEmployee.value);
    await loadEmployees();
    newEmployee.value = {
      id: '',
      name: '',
      surname: '',
      second_name: '',
      date_birth: '',
      serial: '',
      number: '',
      date_issue: '',
      code: '',
      issued_by: '',
      region: '',
      settlement: '',
      street: '',
      house: '',
      housing: '',
      flat: '',
    };
  } catch (error) {
    console.error('Ошибка добавления сотрудника:', error);
  }
};

const updateEmployeeHandler = async () => {
  if (editedEmployee.value) {
    try {
      await updateEmployee(editedEmployee.value.id, editedEmployee.value);
      await loadEmployees();
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления сотрудника:', error);
    }
  }
};

const startEditingEmployee = (employee: Employee) => {
  editedEmployee.value = { ...employee };
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
  editedEmployee.value = null;
};

const deleteEmployeeHandler = async (id: string) => {
  try {
    await deleteEmployee(id);
    await loadEmployees();
  } catch (error) {
    console.error('Ошибка удаления сотрудника:', error);
  }
};
</script>

<style scoped>
.form-container,
.edit-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.table-container {
  margin-top: 1rem;
}
</style>
