<template>
  <div>
    <AppHeader />

    <h1>Сотрудники</h1>

    <div class="add-form">
      <h3>Добавить нового сотрудника</h3>
      <form @submit.prevent="createEmployeeHandler">
        <!-- Основные данные сотрудника -->
        <q-input v-model="newEmployee.name" label="Имя" filled required />
        <q-input
          v-model="newEmployee.surname"
          label="Фамилия"
          filled
          required
        />
        <q-input v-model="newEmployee.second_name" label="Отчество" filled />
        <q-input
          v-model="newEmployee.date_birth"
          label="Дата рождения"
          type="date"
          filled
          required
        />
        <q-select
          v-model="newEmployee.position_id"
          :options="positions"
          option-value="id"
          option-label="name"
          label="Должность"
          filled
          required
        />

        <!-- Паспортные данные -->
        <h4>Паспортные данные</h4>
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
          v-model="newEmployee.passport.issued_by"
          label="Кем выдан"
          filled
        />
        <q-input
          v-model="newEmployee.passport.code"
          label="Код подразделения"
          filled
        />

        <!-- Адресные данные -->
        <h4>Адрес</h4>
        <q-input v-model="newEmployee.address.region" label="Регион" filled />
        <q-input v-model="newEmployee.address.city" label="Город" filled />
        <q-input v-model="newEmployee.address.street" label="Улица" filled />
        <q-input v-model="newEmployee.address.building" label="Дом" filled />
        <q-input
          v-model="newEmployee.address.apartment"
          label="Квартира"
          filled
        />

        <!-- Кнопка для добавления -->
        <q-btn type="submit" label="Добавить сотрудника" color="primary" />
      </form>
    </div>

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

    <!-- Форма редактирования данных сотрудника -->
    <div v-if="editMode && editedEmployee" class="edit-form">
      <h3>Изменить данные сотрудника</h3>
      <form @submit.prevent="updateEmployeeHandler">
        <!-- Основные данные сотрудника -->
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

        <!-- Паспортные данные -->
        <h4>Паспортные данные</h4>
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
          v-model="editedEmployee.passport.issued_by"
          label="Кем выдан"
          filled
        />
        <q-input
          v-model="editedEmployee.passport.code"
          label="Код подразделения"
          filled
        />

        <!-- Адресные данные -->
        <h4>Адрес</h4>
        <q-input
          v-model="editedEmployee.address.region"
          label="Регион"
          filled
        />
        <q-input v-model="editedEmployee.address.city" label="Город" filled />
        <q-input v-model="editedEmployee.address.street" label="Улица" filled />
        <q-input v-model="editedEmployee.address.building" label="Дом" filled />
        <q-input
          v-model="editedEmployee.address.apartment"
          label="Квартира"
          filled
        />

        <!-- Кнопки управления -->
        <q-btn type="submit" label="Сохранить изменения" color="primary" />
        <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import {
  EmployeeBaseData,
  PassportInfo,
  AddressInfo,
} from 'src/types/Employee';

const $q = useQuasar();

const newEmployee = ref<EmployeeBaseData>({
  id: 0,
  name: '',
  surname: '',
  second_name: '',
  date_birth: '',
  position_id: null,
  passport: {
    serial: '',
    number: '',
    date_issue: '',
    issued_by: '',
    code: '',
  },
  address: {
    region: '',
    city: '',
    street: '',
    building: '',
    apartment: '',
  },
});

const clearForm = () => {
  newEmployee.value = {
    id: 0,
    name: '',
    surname: '',
    second_name: '',
    date_birth: '',
    position_id: null,
    passport: {
      serial: '',
      number: '',
      date_issue: '',
      issued_by: '',
      code: '',
    },
    address: {
      region: '',
      city: '',
      street: '',
      building: '',
      apartment: '',
    },
  };
};

const employees = ref([]);

const getEmployees = async () => {
  try {
    const response = await axios.get('/employees');
    employees.value = response.data; // Обновляем массив сотрудников
  } catch (error) {
    console.error('Ошибка при загрузке сотрудников', error);
  }
};

getEmployees();

const employeeBaseData = ref<EmployeeBaseData>({
  id: 0,
  name: '',
  surname: '',
  second_name: '',
  date_birth: '',
  position_id: null,
  passport: {
    serial: '',
    number: '',
    date_issue: '',
    issued_by: '',
    code: '',
  },
  address: {
    region: '',
    city: '',
    street: '',
    building: '',
    apartment: '',
  },
});

const passportInfo = ref<PassportInfo>({
  serial: '',
  number: '',
  date_issue: '',
  issued_by: '',
  code: '',
});

const addressInfo = ref<AddressInfo>({
  region: '',
  city: '',
  street: '',
  building: '',
  apartment: '',
});

const columns = ref([
  { name: 'name', label: 'Имя', align: 'left', field: 'name' },
  { name: 'surname', label: 'Фамилия', align: 'left', field: 'surname' },
  {
    name: 'second_name',
    label: 'Отчество',
    align: 'left',
    field: 'second_name',
  },
  {
    name: 'date_birth',
    label: 'Дата рождения',
    align: 'center',
    field: 'date_birth',
  },
  {
    name: 'passport.serial',
    label: 'Серия паспорта',
    align: 'center',
    field: 'passport.serial',
  },
  {
    name: 'passport.number',
    label: 'Номер паспорта',
    align: 'center',
    field: 'passport.number',
  },
  {
    name: 'passport.date_issue',
    label: 'Дата выдачи',
    align: 'center',
    field: 'passport.date_issue',
  },
  {
    name: 'passport.code',
    label: 'Код подразделения',
    align: 'center',
    field: 'passport.code',
  },
  {
    name: 'passport.issued_by',
    label: 'Кем выдан',
    align: 'left',
    field: 'passport.issued_by',
  },
  {
    name: 'address.region',
    label: 'Регион',
    align: 'left',
    field: 'address.region',
  },
  {
    name: 'address.settlement',
    label: 'Город',
    align: 'left',
    field: 'address.settlement',
  },
  {
    name: 'address.street',
    label: 'Улица',
    align: 'left',
    field: 'address.street',
  },
  {
    name: 'address.house',
    label: 'Дом',
    align: 'center',
    field: 'address.house',
  },
  {
    name: 'address.housing',
    label: 'Квартира',
    align: 'center',
    field: 'address.housing',
  },
  {
    name: 'address.flat',
    label: 'Квартира',
    align: 'center',
    field: 'address.flat',
  },
]);

const createEmployeeHandler = async () => {
  const employeePayload = {
    ...employeeBaseData.value,
    passport: passportInfo.value,
    address: addressInfo.value,
  };

  try {
    await axios.post('/employees', employeePayload);
    $q.notify({ type: 'positive', message: 'Сотрудник успешно добавлен!' });
    clearForm();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при добавлении сотрудника',
    });
  }
};

const positions = ref<{ label: string; value: number }[]>([]);

const loadPositions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/positions');
    positions.value = response.data.map(
      (position: { id: number; name: string }) => ({
        label: position.name,
        value: position.id,
      })
    );
  } catch (error) {
    console.error('Ошибка при загрузке должностей:', error);
  }
};

onMounted(() => {
  getEmployees();
  loadPositions();
});

const getNestedField = (
  row: Record<string, unknown>,
  field: string
): unknown => {
  return field
    .split('.')
    .reduce<Record<string, unknown> | undefined>((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return acc[part] as Record<string, unknown>;
      }
      return undefined;
    }, row);
};

const editMode = ref(false);
const editedEmployee = ref<EmployeeBaseData | null>(null);

const startEditingEmployee = (employee: EmployeeBaseData) => {
  editedEmployee.value = { ...employee };
  editMode.value = true;
};

const updateEmployeeHandler = async () => {
  if (!editedEmployee.value) {
    $q.notify({
      type: 'negative',
      message: 'Нет данных для обновления сотрудника',
    });
    return;
  }

  try {
    const response = await axios.put(
      `/employees/${editedEmployee.value.id}`,
      editedEmployee.value
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // Убираем предупреждение, если `response` не нужен
    console.log(response);

    $q.notify({ type: 'positive', message: 'Данные сотрудника обновлены' });
    getEmployees();
    cancelEdit();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Ошибка при обновлении сотрудника',
    });
  }
};

const cancelEdit = () => {
  editMode.value = false;
  editedEmployee.value = null;
};

const deleteEmployeeHandler = async (employeeId: number) => {
  try {
    await axios.delete(`/employees/${employeeId}`);
    // После успешного удаления перезагружаем список сотрудников
    getEmployees();
    $q.notify({ type: 'positive', message: 'Сотрудник удален' });
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Ошибка при удалении сотрудника' });
  }
};
</script>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 500px;
}

.table-container {
  margin-top: 20px;
}
</style>
