<template>
  <div>
    <AppHeader />

    <h1>Сотрудники</h1>

    <!-- Кнопка для открытия модального окна добавления сотрудника -->
    <q-btn
      label="Добавить нового сотрудника"
      color="primary"
      @click="openAddModal"
    />

    <!-- Модальное окно для добавления сотрудника -->
    <q-dialog v-model="isAddModalOpen">
      <q-card>
        <q-card-section>
          <h4>Добавить нового сотрудника</h4>
          <form @submit.prevent="createEmployeeHandler">
            <!-- Основные данные сотрудника -->
            <q-input
              v-model="employeeBaseData.name"
              label="Имя"
              filled
              required
            />
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
              :options="positions.map((p) => ({ label: p.name, value: p.id }))"
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
            <q-input
              v-model="passportInfo.code"
              label="Код подразделения"
              filled
            />
            <q-input
              v-model="passportInfo.issued_by"
              label="Кем выдан"
              filled
            />

            <!-- Адресные данные -->
            <h4>Адрес</h4>
            <q-input v-model="addressInfo.region" label="Регион" filled />
            <q-input v-model="addressInfo.settlement" label="Город" filled />
            <q-input v-model="addressInfo.street" label="Улица" filled />
            <q-input v-model="addressInfo.house" label="Дом" filled />
            <q-input v-model="addressInfo.housing" label="Корпус" filled />
            <q-input v-model="addressInfo.flat" label="Квартира" filled />

            <!-- Кнопки для добавления -->
            <q-btn type="submit" label="Добавить сотрудника" color="primary" />
            <q-btn
              label="Отмена"
              color="secondary"
              flat
              @click="closeAddModal"
            />
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>

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
            <q-btn
              color="primary"
              label="Показать сканы"
              @click="showScansHandler(props.row.id)"
              flat
              size="sm"
            />
            <q-btn
              color="primary"
              label="Добавить скан"
              @click="openFileUploadModal(props.row.id)"
              flat
              size="sm"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="isFileUploadModalOpen">
      <q-card>
        <q-card-section>
          <h4>Загрузить скан документа</h4>
          <q-uploader
            :model-value="uploadedFiles"
            @update:model-value="uploadedFiles = $event"
            label="Перетащите файл или выберите его"
            accept=".jpg,.jpeg,.png,.pdf"
            max-files="1"
            flat
            :url="'http://localhost:3000/files/upload'"
            name="file"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Загрузить" color="primary" @click="uploadFileHandler" />
          <q-btn label="Отмена" flat @click="closeFileUploadModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Модальное окно для редактирования сотрудника -->
    <q-dialog v-model="isEditModalOpen">
      <q-card>
        <q-card-section>
          <h4>Редактировать данные сотрудника</h4>
          <form @submit.prevent="updateEmployeeHandler">
            <!-- Основные данные сотрудника -->
            <q-input
              v-model="editedEmployee.name"
              label="Имя"
              filled
              required
            />
            <q-input
              v-model="editedEmployee.surname"
              label="Фамилия"
              filled
              required
            />
            <q-input
              v-model="editedEmployee.second_name"
              label="Отчество"
              filled
            />
            <q-input
              v-model="editedEmployee.date_birth"
              label="Дата рождения"
              type="date"
              filled
              required
            />
            <q-select
              v-model="editedEmployee.position_id"
              :options="positions.map((p) => ({ label: p.name, value: p.id }))"
              option-label="label"
              option-value="value"
              emit-value
              label="Выберите должность"
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
            <q-input
              v-model="editedEmployee.address.street"
              label="Улица"
              filled
            />
            <q-input
              v-model="editedEmployee.address.house"
              label="Дом"
              filled
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

            <!-- Кнопки управления -->
            <q-btn type="submit" label="Сохранить изменения" color="primary" />
            <q-btn
              label="Отмена"
              color="secondary"
              flat
              @click="closeEditModal"
            />
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { EmployeeColumns } from 'src/pages/columns/employeesColumns';
import axios from 'axios';
import {
  EmployeeBaseData,
  PassportInfo,
  AddressInfo,
  File as EmployeeFile,
} from './types/Employee';
import useFileUpload from 'src/pages/composables/employees/useFileUpload';
import useCreateEmployee from 'src/pages/composables/employees/useCreateEmployee';
import { useUpdateEmployee } from 'src/pages/composables/employees/useUpdateEmployee';
import { useDeleteEmployee } from 'src/pages/composables/employees/useDeleteEmployee';
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);

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
    settlement: '',
    street: '',
    house: '',
    housing: '',
    flat: '',
  },
  files: [],
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
    files: [],
  };
};

const employees = ref<EmployeeBaseData[]>([]);

const getEmployees = async () => {
  try {
    const response = await axios.get('http://localhost:3000/employees');
    employees.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке сотрудников', error);
  }
};

const columns = ref(EmployeeColumns);

const { createEmployee } = useCreateEmployee();
const $q = useQuasar();

const createEmployeeHandler = async () => {
  const success = await createEmployee(
    employeeBaseData.value,
    passportInfo.value,
    addressInfo.value,
    $q
  );

  if (success) clearForm();
};

onMounted(() => {
  getEmployees();
  loadPositions();
});

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

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const editedEmployee = ref<EmployeeBaseData>({ ...employeeBaseData.value });

const startEditingEmployee = (employee: EmployeeBaseData) => {
  editedEmployee.value = { ...employee }; // Копируем данные сотрудника
  isEditModalOpen.value = true;
};

const cancelEdit = () => {
  if (editedEmployee.value) {
    editedEmployee.value = { ...employeeBaseData.value }; // Восстанавливаем начальные данные
  }
};

const { updateEmployee } = useUpdateEmployee(getEmployees);

const updateEmployeeHandler = async () => {
  if (!editedEmployee.value) return;

  await updateEmployee(editedEmployee.value);

  cancelEdit();
};

const { deleteEmployee } = useDeleteEmployee(getEmployees);

const deleteEmployeeHandler = async (employeeId: number) => {
  await deleteEmployee(employeeId);
};

const isModalOpen = ref(false);
const selectedEmployeeFiles = ref<EmployeeFile[]>([]);

const showScansHandler = async (employee_id: number) => {
  try {
    console.log('Идентификатор сотрудника:', employee_id);

    // Попробуем получить файлы с сервера
    const response = await fetch(
      `http://localhost:3000/employees/${employee_id}/files`
    );
    const files = await response.json();

    console.log('Полученные файлы:', files);

    if (files && files.length > 0) {
      selectedEmployeeFiles.value = files; // Сохраняем файлы
      isModalOpen.value = true; // Открываем модальное окно
    } else {
      $q.notify({
        type: 'warning',
        message: 'У сотрудника нет прикрепленных сканов.',
      });
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных сотрудника:', error);
    $q.notify({
      type: 'negative',
      message: 'Не удалось загрузить сканы.',
    });
  }
};

const {
  isFileUploadModalOpen,
  uploadedFiles,
  openFileUploadModal,
  closeFileUploadModal,
  uploadFileHandler,
} = useFileUpload(getEmployees);
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

q-img {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}
</style>
