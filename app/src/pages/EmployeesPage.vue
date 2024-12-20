<template>
  <div>
    <AppHeader />
    <h1>Сотрудники</h1>
    <q-btn label="Добавить сотрудника" color="primary" @click="openAddModal" />

    <q-table
      :rows="employees"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="table-container"
    >
      <template v-slot:body-cell-passport_serial="props">
        <q-td :props="props">{{ props.row.passport?.serial }}</q-td>
      </template>

      <template v-slot:body-cell-passport_number="props">
        <q-td :props="props">{{ props.row.passport?.number }}</q-td>
      </template>

      <template v-slot:body-cell-passport_date_issue="props">
        <q-td :props="props">{{ props.row.passport?.date_issue }}</q-td>
      </template>

      <template v-slot:body-cell-passport_code="props">
        <q-td :props="props">{{ props.row.passport?.code }}</q-td>
      </template>

      <template v-slot:body-cell-passport_issued_by="props">
        <q-td :props="props">{{ props.row.passport?.issued_by }}</q-td>
      </template>

      <template v-slot:body-cell-address_region="props">
        <q-td :props="props">{{ props.row.address?.region }}</q-td>
      </template>

      <template v-slot:body-cell-address_settlement="props">
        <q-td :props="props">{{ props.row.address?.settlement }}</q-td>
      </template>

      <template v-slot:body-cell-address_street="props">
        <q-td :props="props">{{ props.row.address?.street }}</q-td>
      </template>

      <template v-slot:body-cell-address_house="props">
        <q-td :props="props">{{ props.row.address?.house }}</q-td>
      </template>

      <template v-slot:body-cell-address_housing="props">
        <q-td :props="props">{{ props.row.address?.housing }}</q-td>
      </template>

      <template v-slot:body-cell-address_flat="props">
        <q-td :props="props">{{ props.row.address?.flat }}</q-td>
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
          @click="deleteEmployee(props.row.id)"
          flat
          size="sm"
        />
        <q-btn
          flat
          icon="visibility"
          label="Сканы"
          color="primary"
          @click="showScansHandler(props.row.id)"
        />
      </template>
    </q-table>

    <!-- Модальное окно для добавления -->
    <q-dialog v-model="isAddModalOpen">
      <q-card>
        <q-card-section>
          <h3>Добавить сотрудника</h3>
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="addNewEmployee">
            <q-input v-model="newEmployee.name" label="Имя" filled required />
            <q-input
              v-model="newEmployee.surname"
              label="Фамилия"
              filled
              required
            />
            <q-input
              v-model="newEmployee.second_name"
              label="Отчество"
              filled
            />
            <q-input
              v-model="newEmployee.date_birth"
              type="date"
              label="Дата рождения"
              filled
              required
            />
            <q-input
              v-model="newEmployee.position_id"
              type="number"
              label="ID должности"
              filled
              required
            />
            <!-- Паспорт -->
            <q-input
              v-model="passport.serial"
              label="Серия паспорта"
              filled
              required
            />
            <q-input
              v-model="passport.number"
              label="Номер паспорта"
              filled
              required
            />
            <q-input
              v-model="passport.date_issue"
              type="date"
              label="Дата выдачи"
              filled
              required
            />
            <q-input
              v-model="passport.code"
              label="Код подразделения"
              filled
              required
            />
            <q-input
              v-model="passport.issued_by"
              label="Кем выдан"
              filled
              required
            />
            <!-- Адрес -->
            <q-input v-model="address.region" label="Регион" filled required />
            <q-input
              v-model="address.settlement"
              label="Населённый пункт"
              filled
              required
            />
            <q-input v-model="address.street" label="Улица" filled required />
            <q-input v-model="address.house" label="Дом" filled required />
            <q-input v-model="address.housing" label="Корпус" filled />
            <q-input v-model="address.flat" label="Квартира" filled />

            <q-btn type="submit" label="Добавить" color="primary" />
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

    <!-- Модальное окно для изменения -->
    <q-dialog v-model="isEditModalOpen">
      <q-card>
        <q-card-section>
          <h3>Изменить сотрудника</h3>
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="saveEditedEmployee">
            <!-- Поля для редактирования сотрудника -->
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
              type="date"
              label="Дата рождения"
              filled
              required
            />
            <q-input
              v-model="editedEmployee.position_id"
              type="number"
              label="ID должности"
              filled
              required
            />
            <q-btn type="submit" label="Сохранить" color="primary" />
            <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { date, QTableColumn } from 'quasar';
import { EmployeeColumns } from 'src/pages/columns/employeesColumns';
import { useGetEmployee } from 'src/pages/composables/employees/useGetEmployee';
import { useCreateEmployee } from 'src/pages/composables/employees/useCreateEmployee';
import { useUpdateEmployee } from 'src/pages/composables/employees/useUpdateEmployee';
import { useDeleteEmployee } from 'src/pages/composables/employees/useDeleteEmployee';

const columns: QTableColumn[] = EmployeeColumns;
const { employees, loadEmployees } = useGetEmployee();
const cancelEdit = () => {
  isEditModalOpen.value = false;
};
const { createEmployeeHandler } = useCreateEmployee();
const { updateEmployee } = useUpdateEmployee(loadEmployees, cancelEdit);
const { deleteEmployee } = useDeleteEmployee(loadEmployees);

const newEmployee = ref({
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

const editedEmployee = ref({
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
  files: [],
});
const passport = ref({
  serial: '',
  number: '',
  date_issue: '',
  code: '',
  issued_by: '',
});
const address = ref({
  region: '',
  settlement: '',
  street: '',
  house: '',
  housing: '',
  flat: '',
});

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
  // Очищаем форму нового сотрудника.
  Object.assign(newEmployee.value, {
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
};

const startEditingEmployee = (employee: typeof editedEmployee.value) => {
  editedEmployee.value = JSON.parse(JSON.stringify(employee));
  isEditModalOpen.value = true;
};

const saveEditedEmployee = async () => {
  if (!editedEmployee.value) {
    $q.value.notify({
      type: 'negative',
      message: 'Нет данных для обновления сотрудника.',
    });
    return;
  }

  const payload = {
    ...editedEmployee.value,
    files: editedEmployee.value.files || [],
  };

  try {
    await updateEmployee(payload);

    $q.value.notify({
      type: 'positive',
      message: 'Данные сотрудника успешно обновлены.',
    });
  } catch (error) {
    console.error('Ошибка при сохранении сотрудника:', error);
    $q.value.notify({
      type: 'negative',
      message: 'Не удалось сохранить данные сотрудника.',
    });
  }
};

import { getSessionUserId } from 'src/useSession';
import formatDate = date.formatDate;

const addNewEmployee = async () => {
  const userId = await getSessionUserId();
  if (!userId) {
    $q.value.notify({
      type: 'negative',
      message: 'Не удалось определить текущего пользователя',
    });
    return;
  }

  const payload = {
    name: newEmployee.value.name,
    surname: newEmployee.value.surname,
    second_name: newEmployee.value.second_name || '',
    date_birth: formatDate(newEmployee.value.date_birth),
    position_id: newEmployee.value.position_id,
  };

  await createEmployeeHandler(payload); // Передаем данные без userId, он добавится в createEmployeeHandler
  closeAddModal();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeEmployee = async (id: number) => {
  await deleteEmployee(id);
};

onMounted(() => {
  loadEmployees();
});

// Список файлов сотрудника
const selectedEmployeeFiles = ref([]);
const isModalOpen = ref(false);
const currentEmployeeId = ref<number | null>(null);
const $q = ref();

// Открыть модальное окно для просмотра файлов
const showScansHandler = async (employee_id: number) => {
  currentEmployeeId.value = employee_id;
  try {
    const response = await fetch(
      `http://localhost:3000/employees/${employee_id}/files`
    );
    const files = await response.json();

    if (files && files.length > 0) {
      selectedEmployeeFiles.value = files; // Сохраняем файлы
      isModalOpen.value = true; // Открываем модальное окно
    } else {
      $q.value.notify({
        type: 'warning',
        message: 'У сотрудника нет прикрепленных сканов.',
      });
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных сотрудника:', error);
    $q.value.notify({
      type: 'negative',
      message: 'Не удалось загрузить сканы.',
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const uploadFilesHandler = async (event: Event) => {
  if (!currentEmployeeId.value) return;

  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('files[]', file));

  try {
    const response = await fetch(
      `http://localhost:3000/employees/${currentEmployeeId.value}/files`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (response.ok) {
      $q.value.notify({
        type: 'positive',
        message: 'Файлы успешно загружены.',
      });
      showScansHandler(currentEmployeeId.value); // Перезагрузить список файлов
    } else {
      throw new Error('Ошибка при загрузке файлов');
    }
  } catch (error) {
    console.error('Ошибка при загрузке файлов:', error);
    $q.value.notify({
      type: 'negative',
      message: 'Не удалось загрузить файлы.',
    });
  }
};
</script>

<style scoped>
.table-container {
  margin-top: 1rem;
}
</style>
