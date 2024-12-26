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
              label="Добавить скан"
              color="primary"
              @click="openModal(props.row.id)"
              flat
              size="sm"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- Модальное окно для загрузки скана -->
    <q-dialog v-model="isModalOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Загрузить скан</div>
        </q-card-section>
        <q-card-section>
          <input type="file" accept="image/*" @change="handleFileSelection" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" @click="closeModal" />
          <q-btn flat label="Загрузить" color="primary" @click="uploadFile" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Модальное окно просмотра сканов -->
    <q-dialog v-model="isScanModalOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Сканы сотрудника</div>
        </q-card-section>
        <q-card-section>
          <div v-if="filteredFiles.length > 0" class="scans-container">
            <div v-for="file in filteredFiles" :key="file.id" class="scan-item">
              <div class="file-name">{{ file.name }}</div>
              <div class="buttons-container">
                <q-btn
                  label="Скачать"
                  color="primary"
                  flat
                  dense
                  @click="downloadScan(file.id)"
                  class="download-button"
                />
                <q-btn
                  label="Удалить"
                  color="negative"
                  flat
                  dense
                  @click="deleteScan(file.id)"
                  class="delete-button"
                />
              </div>
              <img
                :src="`http://localhost:3000${file.link}`"
                alt="Скан документа"
                class="scan-image"
              />
            </div>
          </div>
          <div v-else>
            <p>У сотрудника отсутствуют сканы.</p>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Закрыть"
            color="primary"
            @click="isScanModalOpen = false"
          />
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
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { EmployeeColumns } from 'src/pages/columns/employeesColumns';
import axios from 'axios';
import {
  EmployeeBaseData,
  PassportInfo,
  AddressInfo,
  File as EmployeeFile,
} from 'src/pages/types/Employee';
import useCreateEmployee from 'src/pages/composables/employees/useCreateEmployee';
import { useUpdateEmployee } from 'src/pages/composables/employees/useUpdateEmployee';
import { useDeleteEmployee } from 'src/pages/composables/employees/useDeleteEmployee';
import { api } from 'src/boot/axios';
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

const selectedEmployeeFiles = ref<EmployeeFile[]>([]);
const isScanModalOpen = ref(false);

const showScansHandler = async (employeeId: number) => {
  try {
    const { data: files } = await axios.get(
      `http://localhost:3000/employees/${employeeId}/files`
    );

    if (Array.isArray(files) && files.length > 0) {
      selectedEmployeeFiles.value = files;
      isScanModalOpen.value = true;
    } else {
      $q.notify({
        type: 'warning',
        message: 'У сотрудника нет прикрепленных сканов.',
      });
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка:', error.response?.data || error.message);
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Не удалось загрузить сканы.',
      });
    } else if (error instanceof Error) {
      console.error('Ошибка:', error.message);
      $q.notify({
        type: 'negative',
        message: `Ошибка: ${error.message}`,
      });
    } else {
      console.error('Непредвиденная ошибка:', error);
      $q.notify({
        type: 'negative',
        message:
          'Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.',
      });
    }
  }
};

const isModalOpen = ref(false);
const selectedEmployeeId = ref<number | null>(null);
const selectedFile = ref<File | null>(null);

const openModal = (employeeId: number) => {
  selectedEmployeeId.value = employeeId;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedEmployeeId.value = null;
  selectedFile.value = null;
};

const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};

const uploadFile = async () => {
  if (!selectedFile.value || !selectedEmployeeId.value) {
    $q.notify({
      type: 'negative',
      message: 'Выберите файл и сотрудника перед загрузкой!',
    });
    return;
  }

  console.log('selectedEmployeeId:', selectedEmployeeId.value);

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  const uploadUrl = `http://localhost:3000/employees/${selectedEmployeeId.value}/upload-scan`;

  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });

    console.log('Ответ сервера:', response.data);
    $q.notify({ type: 'positive', message: 'Файл успешно загружен!' });
    closeModal();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Ошибка загрузки файла:',
        error.response?.data || error.message
      );

      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Ошибка загрузки файла!',
      });
    } else if (error instanceof Error) {
      console.error('Произошла ошибка:', error.message);

      $q.notify({
        type: 'negative',
        message: `Ошибка: ${error.message}`,
      });
    } else {
      console.error('Непредвиденная ошибка:', error);

      $q.notify({
        type: 'negative',
        message: 'Произошла непредвиденная ошибка. Попробуйте снова.',
      });
    }
  }
};

const filteredFiles = computed(() => {
  return selectedEmployeeFiles.value.filter((file) => !file.deleted_at);
});

async function deleteScan(fileId: number) {
  try {
    const response = await api.patch(`/employees/files/${fileId}`, null, {
      withCredentials: true,
    });

    console.log(response.data.message);
    selectedEmployeeFiles.value = selectedEmployeeFiles.value.filter(
      (file) => file.id !== fileId
    );
    $q.notify({ type: 'positive', message: 'Файл успешно удалён!' });
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    $q.notify({ type: 'negative', message: 'Ошибка удаления файла' });
  }
}

const downloadScan = async (fileId: number) => {
  if (!fileId) {
    console.error('Не выбран файл для скачивания.');
    $q.notify({
      type: 'negative',
      message: 'Не выбран файл для скачивания.',
    });
    return;
  }

  try {
    console.log('Запрашиваем файл с ID:', fileId); // Логируем fileId
    const response = await axios.get(
      `http://localhost:3000/employees/files/${fileId}`,
      { responseType: 'blob', withCredentials: true }
    );

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;

    const filename = response.headers['content-disposition']
      ? response.headers['content-disposition'].match(/filename="(.+)"/)?.[1]
      : fileId;

    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка при скачивании файла. Попробуйте снова.',
    });
  }
};
</script>

<style scoped>
.scans-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
}

.scan-item {
  width: 300px;
  text-align: center;
}

.file-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.delete-button {
  margin-bottom: 8px;
}

.scan-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.buttons-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.download-button,
.delete-button {
  margin: 0;
}
</style>
