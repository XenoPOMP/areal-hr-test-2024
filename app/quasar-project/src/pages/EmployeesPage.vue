<template>
  <div>
    <!-- Компонент шапки для навигации -->
    <AppHeader />

    <h1>Сотрудники</h1>

    <!-- Форма для добавления нового сотрудника -->
    <form @submit.prevent="createEmployeeHandler" class="form-container">
      <!-- Сотрудник -->
      <q-input v-model="newEmployee.name" label="Имя" filled required />
      <q-input v-model="newEmployee.surname" label="Фамилия" filled required />
      <q-input v-model="newEmployee.second_name" label="Отчество" />
      <q-input
        v-model="newEmployee.date_birth"
        label="Дата рождения"
        type="date"
        filled
        required
      />
      <q-select
        v-model="newEmployee.position_id"
        :options="employees"
        option-label="label"
        option-value="value"
        label="Выберите должность"
        filled
      />

      <!-- Паспорт -->
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
      <q-input v-model="newEmployee.passport.code" label="Код подразделения" />
      <q-input v-model="newEmployee.passport.issued_by" label="Кем выдан" />

      <!-- Адрес -->
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
      <q-input v-model="newEmployee.address.housing" label="Корпус" />
      <q-input v-model="newEmployee.address.flat" label="Квартира" />

      <q-btn type="submit" label="Добавить сотрудника" color="primary" />
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
import axios from 'axios';

type SelectableValue = number | { label: string; value: number } | null;

interface Employee {
  id: string;
  name: string;
  surname: string;
  second_name?: string;
  date_birth: string | null;
  position_id: SelectableValue;
  passport: {
    serial: string;
    number: string;
    date_issue: string | null;
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
  id: '',
  name: '',
  surname: '',
  second_name: '',
  date_birth: new Date().toLocaleDateString('en-CA'),
  position_id: null,
  passport: {
    serial: '',
    number: '',
    date_issue: new Date().toLocaleDateString('en-CA'),
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

interface Position {
  id: number;
  name: string;
}

const positions = ref<Position[]>([]);

const loadEmployees = async () => {
  try {
    employees.value = await getEmployees();
  } catch (error) {
    console.error('Ошибка загрузки сотрудников:', error);
  }
};

const loadSelectData = async () => {
  try {
    const positionsResponse = await axios.get(
      'http://localhost:3000/positions'
    );
    positions.value = positionsResponse.data.map((pos: Position) => ({
      label: pos.name,
      value: pos.id,
    }));
  } catch (error) {
    console.error('Ошибка загрузки данных для выпадающих списков:', error);
  }
};

onMounted(() => {
  loadEmployees();
  loadSelectData();
});

const createEmployeeHandler = async () => {
  if (newEmployee.value.position_id == null) {
    console.error('Поле выбора должности должно быть заполнено.');
    return;
  }

  try {
    const formatDate = (date: string) => {
      const [year, month, day] = date.split('-');
      return `${year}.${month}.${day}`;
    };

    const employeeData = {
      name: newEmployee.value.name.slice(0, 100),
      surname: newEmployee.value.surname.slice(0, 100),
      second_name: newEmployee.value.second_name?.slice(0, 100),
      date_birth: newEmployee.value.date_birth
        ? formatDate(newEmployee.value.date_birth)
        : new Date().toISOString().split('T')[0],
      position_id:
        typeof newEmployee.value.position_id === 'object'
          ? newEmployee.value.position_id.value
          : newEmployee.value.position_id,
      passport: {
        serial: newEmployee.value.passport.serial,
        number: newEmployee.value.passport.number,
        date_issue: newEmployee.value.passport.date_issue
          ? formatDate(newEmployee.value.passport.date_issue)
          : new Date().toISOString().split('T')[0],
        code: newEmployee.value.passport.code,
        issued_by: newEmployee.value.passport.issued_by,
      },
      address: {
        region: newEmployee.value.address.region,
        settlement: newEmployee.value.address.settlement,
        street: newEmployee.value.address.street,
        house: newEmployee.value.address.house,
        housing: newEmployee.value.address.housing,
        flat: newEmployee.value.address.flat,
      },
    };

    await createEmployee(employeeData);

    newEmployee.value = {
      id: '',
      name: '',
      surname: '',
      second_name: '',
      date_birth: new Date().toLocaleDateString('en-CA'),
      position_id: null,
      passport: {
        serial: '',
        number: '',
        date_issue: new Date().toLocaleDateString('en-CA'),
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

    await loadEmployees();
  } catch (error) {
    console.error('Ошибка создания сотрудника:', error);
  }
};

const startEditingEmployee = (employee: Employee) => {
  editedEmployee.value = { ...employee };
  editMode.value = true;
};

const updateEmployeeHandler = async () => {
  const { value } = editedEmployee;

  // Проверка, что editedEmployee.value существует
  if (!value) return;

  // Проверка обязательного поля должности
  if (value.position_id == null) {
    console.error('Поле выбора должности должно быть заполнено.');
    return;
  }

  // Создаем объект с правильной структурой данных
  const employeeData: Employee = {
    id: value.id,
    name: value.name,
    surname: value.surname,
    second_name: value.second_name || '', // Если second_name нет, передаем пустую строку
    date_birth: value.date_birth || new Date().toISOString().split('T')[0], // Если date_birth нет, передаем текущую дату
    position_id:
      typeof value.position_id === 'object'
        ? value.position_id.value
        : value.position_id,
    passport: value.passport
      ? {
          serial: value.passport.serial,
          number: value.passport.number,
          date_issue:
            value.passport.date_issue || new Date().toISOString().split('T')[0], // Если date_issue нет, передаем текущую дату
          code: value.passport.code,
          issued_by: value.passport.issued_by,
        }
      : null, // Если passport нет, передаем null
    address: value.address
      ? {
          region: value.address.region,
          settlement: value.address.settlement,
          street: value.address.street,
          house: value.address.house,
          housing: value.address.housing || '', // Если housing нет, передаем пустую строку
          flat: value.address.flat || '', // Если flat нет, передаем пустую строку
        }
      : null, // Если address нет, передаем null
  };

  try {
    // Отправка данных для обновления
    await updateEmployee(value.id, employeeData);

    // Перезагрузка списка сотрудников и отмена редактирования
    await loadEmployees();
    cancelEdit();
  } catch (error) {
    console.error('Ошибка обновления сотрудника:', error);
  }
};

const deleteEmployeeHandler = async (id: number) => {
  try {
    await deleteEmployee(id.toString());
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
