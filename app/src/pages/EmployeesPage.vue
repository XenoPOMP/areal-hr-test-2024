<template>
  <div>
    <AppHeader />

    <h1>Сотрудники</h1>

    <div class="add-form">
      <h4>Добавить нового сотрудника</h4>
      <form @submit.prevent="createEmployeeHandler">
        <!-- Основные данные сотрудника -->
        <q-input v-model="employeeBaseData.name" label="Имя" filled required />
        <q-input
          v-model="employeeBaseData.surname"
          label="Фамилия"
          filled
          required
        />
        <q-input
          v-model="employeeBaseData.second_name"
          label="Отчество"
          filled
        />
        <q-input
          v-model="employeeBaseData.date_birth"
          label="Дата рождения"
          type="date"
          filled
          required
        />
        <q-select
          v-model="employeeBaseData.position_id"
          :options="
            positions.map((p) => ({
              label: p.name,
              value: p.id,
            }))
          "
          option-label="label"
          option-value="value"
          emit-value
          label="Выберите должность"
        />

        <!-- Паспортные данные -->
        <h4>Паспортные данные</h4>
        <q-input
          v-model="passportInfo.serial"
          label="Серия паспорта"
          filled
          required
        />
        <q-input
          v-model="passportInfo.number"
          label="Номер паспорта"
          filled
          required
        />
        <q-input
          v-model="passportInfo.date_issue"
          label="Дата выдачи"
          type="date"
          filled
          required
        />
        <q-input v-model="passportInfo.code" label="Код подразделения" filled />
        <q-input v-model="passportInfo.issued_by" label="Кем выдан" filled />

        <!-- Адресные данные -->
        <h4>Адрес</h4>
        <q-input v-model="addressInfo.region" label="Регион" filled />
        <q-input v-model="addressInfo.settlement" label="Город" filled />
        <q-input v-model="addressInfo.street" label="Улица" filled />
        <q-input v-model="addressInfo.house" label="Дом" filled />
        <q-input v-model="addressInfo.housing" label="Корпус" filled />
        <q-input v-model="addressInfo.flat" label="Квартира" filled />

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
        <q-input
          v-model="editedEmployee.address.settlement"
          label="Город"
          filled
        />
        <q-input v-model="editedEmployee.address.street" label="Улица" filled />
        <q-input v-model="editedEmployee.address.house" label="Дом" filled />
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

        <!-- Кнопки управления -->
        <q-btn type="submit" label="Сохранить изменения" color="primary" />
        <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted, reactive } from 'vue';
import { useQuasar } from 'quasar';
import { employeeSchema } from 'components/Employee.shemas';
import axios from 'axios';
import {
  EmployeeBaseData,
  PassportInfo,
  AddressInfo,
} from 'src/types/Employee';

const $q = useQuasar();
reactive<EmployeeBaseData>({
  id: 0,
  name: '',
  surname: '',
  second_name: '',
  date_birth: '',
  position_id: null,
  passport: reactive({
    serial: '',
    number: '',
    date_issue: '',
    issued_by: '',
    code: '',
  }),
  address: reactive({
    region: '',
    settlement: '',
    street: '',
    house: '',
    housing: '',
    flat: '',
  }),
});

const clearForm = () => {
  employeeBaseData.value = {
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
      settlement: '',
      street: '',
      house: '',
      housing: '',
      flat: '',
    },
  };
};

const employees = ref([]);

const getEmployees = async () => {
  try {
    const response = await axios.get('http://localhost:3000/employees');
    employees.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке сотрудников', error);
  }
};

const employeeBaseData = ref<{
  id?: number;
  name: string;
  surname: string;
  second_name: string;
  date_birth: string;
  position_id: number | null;
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
    housing: string;
    flat: string;
  };
}>({
  name: '',
  surname: '',
  second_name: '',
  date_birth: '',
  position_id: null,
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

const passportInfo = ref<PassportInfo>({
  serial: '',
  number: '',
  date_issue: '',
  issued_by: '',
  code: '',
});

const addressInfo = ref<AddressInfo>({
  region: '',
  settlement: '',
  street: '',
  house: '',
  housing: '',
  flat: '',
});

const columns = ref([
  { name: 'name', label: 'Имя', align: 'left' as const, field: 'name' },
  {
    name: 'surname',
    label: 'Фамилия',
    align: 'left' as const,
    field: 'surname',
  },
  {
    name: 'second_name',
    label: 'Отчество',
    align: 'left' as const,
    field: 'second_name',
  },
  {
    name: 'date_birth',
    label: 'Дата рождения',
    align: 'center' as const,
    field: 'date_birth',
  },
  {
    name: 'passport.serial',
    label: 'Серия паспорта',
    align: 'center' as const,
    field: 'passport.serial',
  },
  {
    name: 'passport.number',
    label: 'Номер паспорта',
    align: 'center' as const,
    field: 'passport.number',
  },
  {
    name: 'passport.date_issue',
    label: 'Дата выдачи',
    align: 'center' as const,
    field: 'passport.date_issue',
  },
  {
    name: 'passport.code',
    label: 'Код подразделения',
    align: 'center' as const,
    field: 'passport.code',
  },
  {
    name: 'passport.issued_by',
    label: 'Кем выдан',
    align: 'left' as const,
    field: 'passport.issued_by',
  },
  {
    name: 'address.region',
    label: 'Регион',
    align: 'left' as const,
    field: 'address.region',
  },
  {
    name: 'address.settlement',
    label: 'Город',
    align: 'left' as const,
    field: 'address.settlement',
  },
  {
    name: 'address.street',
    label: 'Улица',
    align: 'left' as const,
    field: 'address.street',
  },
  {
    name: 'address.house',
    label: 'Дом',
    align: 'center' as const,
    field: 'address.house',
  },
  {
    name: 'address.housing',
    label: 'Корпус',
    align: 'center' as const,
    field: 'address.housing',
  },
  {
    name: 'address.flat',
    label: 'Квартира',
    align: 'center' as const,
    field: 'address.flat',
  },
]);

const validateEmployee = (employeeData: Record<string, unknown>): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, passport_id, address_id, deleted_at, ...validData } =
    employeeData;

  const { error } = employeeSchema.validate(validData, {
    abortEarly: false,
  });

  if (error) {
    error.details.forEach((err) =>
      $q.notify({
        type: 'negative',
        message: err.message,
      })
    );
    return false;
  }

  return true;
};

const createEmployeeHandler = async () => {
  const passportData = {
    serial: passportInfo.value.serial || '',
    number: passportInfo.value.number || '',
    date_issue: formatDate(passportInfo.value.date_issue) || '',
    issued_by: passportInfo.value.issued_by || '',
    code: passportInfo.value.code || '',
  };

  const addressData = {
    region: addressInfo.value.region || '',
    settlement: addressInfo.value.settlement || '',
    street: addressInfo.value.street || '',
    house: addressInfo.value.house || '',
    housing: addressInfo.value.housing || '',
    flat: addressInfo.value.flat || '',
  };

  const employeePayload = {
    name: employeeBaseData.value.name,
    surname: employeeBaseData.value.surname,
    second_name: employeeBaseData.value.second_name || '',
    date_birth: formatDate(employeeBaseData.value.date_birth),
    position_id: employeeBaseData.value.position_id,
    passport: passportData,
    address: addressData,
  };

  if (!validateEmployee(employeePayload)) return;

  $q.notify({
    type: 'info',
    message: 'Отправка данных...',
  });

  try {
    const response = await axios.post(
      'http://localhost:3000/employees',
      employeePayload
    );

    if (response.status === 200 || response.status === 201) {
      $q.notify({
        type: 'positive',
        message: 'Сотрудник успешно добавлен!',
      });
      clearForm();
    } else {
      console.error('Unexpected response:', response);
      throw new Error('Не удалось добавить сотрудника');
    }
  } catch (error) {
    console.error('Caught error:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка при добавлении сотрудника. Попробуйте еще раз.',
    });
  }
};

onMounted(() => {
  getEmployees();
  loadPositions();
});

function formatDate(date: string | Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(d.getDate()).padStart(2, '0')}`;
}

const positions = ref<{ id: number; name: string }[]>([]);
const positionOptions = ref<{ label: string; value: number }[]>([]);

const loadPositions = async () => {
  try {
    const response = await axios.get('http://localhost:3000/positions');
    positions.value = response.data;

    positionOptions.value = positions.value.map((pos) => ({
      label: pos.name,
      value: pos.id,
    }));
  } catch (error) {
    console.error('Ошибка при загрузке должностей:', error);
  }
};

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

  const payload = {
    ...editedEmployee.value,
    passport: editedEmployee.value.passport,
    address: editedEmployee.value.address,
  };

  // Валидация перед отправкой
  if (!validateEmployee(payload)) return;

  try {
    const response = await axios.put(
      `http://localhost:3000/employees/${editedEmployee.value.id}`,
      payload
    );

    if (response.status === 200) {
      $q.notify({
        type: 'positive',
        message: 'Данные сотрудника обновлены!',
      });
      await getEmployees();
      cancelEdit();
    }
  } catch (error) {
    console.error(error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка при обновлении сотрудника. Попробуйте еще раз.',
    });
  }
};

const cancelEdit = () => {
  editMode.value = false;
  editedEmployee.value = null;
};

const deleteEmployeeHandler = async (employeeId: number) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/employees/${employeeId}/soft-delete`
    );
    console.log('Response:', response.data);
    await getEmployees();
    $q.notify({ type: 'positive', message: 'Сотрудник удален' });
  } catch (error) {
    console.error('Error:', error);
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
