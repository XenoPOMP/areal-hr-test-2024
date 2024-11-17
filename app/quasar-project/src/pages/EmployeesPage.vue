<template>
  <div>
    <!-- Компонент шапки для навигации -->
    <AppHeader />

    <h1>Сотрудники</h1>

    <!-- Форма для добавления нового сотрудника -->
    <form @submit.prevent="createEmployeeHandler" class="form-container">
      <!-- Здесь ваша форма для добавления сотрудника (она не менялась) -->
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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <!-- Отображение значения из поля с помощью getNestedField -->
            {{ getNestedField(props.row, col.field) }}
          </q-td>

          <!-- Кнопки для каждого сотрудника -->
          <q-td>
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
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Форма редактирования сотрудника -->
    <div v-if="editMode && editedEmployee" class="edit-form">
      <h2>Редактирование сотрудника</h2>
      <form @submit.prevent="updateEmployeeHandler">
        <!-- Основные данные сотрудника -->
        <div>
          <label for="name">Имя</label>
          <input type="text" v-model="editedEmployee.name" required />
        </div>
        <div>
          <label for="surname">Фамилия</label>
          <input type="text" v-model="editedEmployee.surname" required />
        </div>
        <div>
          <label for="second_name">Отчество</label>
          <input type="text" v-model="editedEmployee.second_name" />
        </div>
        <div>
          <label for="date_birth">Дата рождения</label>
          <input type="date" v-model="editedEmployee.date_birth" required />
        </div>

        <!-- Паспортные данные -->
        <div>
          <label for="passport_serial">Серия паспорта</label>
          <input type="text" v-model="editedEmployee.passport.serial" />
        </div>
        <div>
          <label for="passport_number">Номер паспорта</label>
          <input type="text" v-model="editedEmployee.passport.number" />
        </div>
        <div>
          <label for="passport_date_issue">Дата выдачи</label>
          <input type="date" v-model="editedEmployee.passport.date_issue" />
        </div>
        <div>
          <label for="passport_code">Код подразделения</label>
          <input type="text" v-model="editedEmployee.passport.code" />
        </div>
        <div>
          <label for="passport_issued_by">Кем выдан</label>
          <input type="text" v-model="editedEmployee.passport.issued_by" />
        </div>

        <!-- Адрес -->
        <div>
          <label for="address_region">Регион</label>
          <input type="text" v-model="editedEmployee.address.region" />
        </div>
        <div>
          <label for="address_settlement">Населенный пункт</label>
          <input type="text" v-model="editedEmployee.address.settlement" />
        </div>
        <div>
          <label for="address_street">Улица</label>
          <input type="text" v-model="editedEmployee.address.street" />
        </div>
        <div>
          <label for="address_house">Дом</label>
          <input type="text" v-model="editedEmployee.address.house" />
        </div>
        <div>
          <label for="address_housing">Корпус</label>
          <input type="text" v-model="editedEmployee.address.housing" />
        </div>
        <div>
          <label for="address_flat">Квартира</label>
          <input type="text" v-model="editedEmployee.address.flat" />
        </div>

        <!-- Кнопки для сохранения и отмены -->
        <div class="actions">
          <button type="submit">Сохранить</button>
          <button @click="cancelEdit" type="button">Отмена</button>
        </div>
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
  { name: 'actions', label: 'Действия', align: 'center', field: 'actions' },
];

const getNestedField = (
  row: Record<string, unknown>,
  field: string
): unknown => {
  return field
    .split('.')
    .reduce<Record<string, unknown> | undefined>((obj, key) => {
      return obj && typeof obj === 'object' && key in obj
        ? (obj[key] as Record<string, unknown> | undefined)
        : undefined;
    }, row);
};

const loadEmployees = async () => {
  try {
    employees.value = await getEmployees();
  } catch (error) {
    console.error('Ошибка загрузки сотрудников:', error);
  }
};

const createEmployeeHandler = async () => {
  try {
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
  } catch (error) {
    console.error('Ошибка создания сотрудника:', error);
  }
};

const startEditingEmployee = (employee: Employee) => {
  editedEmployee.value = { ...employee };
  editMode.value = true;
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

    // Плоская структура данных для отправки
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
      await updateEmployee(id, employeeData);
      await loadEmployees();
      cancelEdit();
    } catch (error) {
      console.error('Ошибка при обновлении сотрудника:', error);
    }
  }
};

const deleteEmployeeHandler = async (id: number) => {
  try {
    await deleteEmployee(id.toString()); // Преобразуем id в строку
    await loadEmployees();
  } catch (error) {
    console.error('Ошибка удаления сотрудника:', error);
  }
};

const cancelEdit = () => {
  editedEmployee.value = null;
  editMode.value = false;
};

onMounted(loadEmployees);
</script>

<style scoped>
.form-container,
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 500px;
}
.actions {
  display: flex;
  gap: 8px;
}
.table-container {
  margin-top: 20px;
}
</style>
