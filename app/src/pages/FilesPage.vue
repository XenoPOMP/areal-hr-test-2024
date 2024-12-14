<template>
  <div>
    <AppHeader />

    <h1>Файлы</h1>

    <form @submit.prevent="createFileHandler" class="form-container">
      <q-input v-model="newFile.name" label="Название" filled required />
      <q-input v-model="newFile.link" label="Ссылка на файл" filled required />
      <q-select
        v-model="newFile.employee_id"
        :options="employees"
        option-label="label"
        option-value="value"
        label="Выберите сотрудника"
        filled
        class="custom-select"
      />

      <q-btn type="submit" label="Добавить" color="primary" />
    </form>

    <q-table
      :rows="files"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="table-container"
    >
      <template v-slot:body-cell-actions="props">
        <q-tr :props="props">
          <q-td :props="props">
            <q-btn
              color="primary"
              label="Изменить"
              @click="startEditingFile(props.row)"
              flat
              size="sm"
            />
            <q-btn
              color="negative"
              label="Удалить"
              @click="deleteFileHandler(props.row.id)"
              flat
              size="sm"
            />
            <q-btn
              color="primary"
              label="Добавить скан"
              @click="openModal(props.row.employee_id)"
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
          <div class="text-h6">Добавить скан паспорта</div>
        </q-card-section>
        <q-card-section>
          <input type="file" accept="image/*" @change="handleFileUpload" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Закрыть" color="negative" @click="closeModal" />
          <q-btn flat label="Загрузить" color="primary" @click="uploadImage" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div v-if="editMode && editedFile" class="edit-form">
      <h3>Изменить данные файла</h3>
      <form @submit.prevent="updateFileHandler">
        <q-input v-model="editedFile.name" label="Название" filled required />
        <q-input
          v-model="editedFile.link"
          label="Ссылка на файл"
          filled
          required
        />
        <q-select
          v-model="editedFile.employee_id"
          :options="employees"
          option-label="label"
          option-value="value"
          label="Выберите сотрудника"
          filled
          required
          class="select-wide"
        />
        <q-btn type="submit" label="Изменить" color="primary" />
        <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { onMounted, ref } from 'vue';
import { createFile, getFiles, updateFile } from 'src/api';
import { useQuasar } from 'quasar';
import { fileColumns } from './columns';
import { useFileUpload } from 'src/components/useFileUpload';
import Joi from 'joi';
import axios from 'axios';

const $q = useQuasar();

type SelectableValue = number | { label: string; value: number } | null;

interface AppFile {
  id: string;
  name: string;
  link: string;
  employee_id: SelectableValue;
}

const files = ref<AppFile[]>([]);
const newFile = ref<AppFile>({
  id: '',
  name: '',
  link: '',
  employee_id: null,
});
const editMode = ref(false);
const editedFile = ref<AppFile | null>(null);

interface Employee {
  id: number;
  name: string;
  surname: string;
}

const employees = ref<Employee[]>([]);

const loadSelectData = async () => {
  try {
    const employeesResponse = await axios.get(
      'http://localhost:3000/employees'
    );
    employees.value = employeesResponse.data.map((emp: Employee) => ({
      label: `${emp.name} ${emp.surname}`,
      value: emp.id,
    }));
  } catch (error) {
    console.error('Ошибка загрузки данных для сотрудников:', error);
  }
};

const columns = ref(fileColumns);

const loadFiles = async () => {
  try {
    files.value = await getFiles();
  } catch (error) {
    console.error('Ошибка загрузки файлов:', error);
  }
};

onMounted(() => {
  loadFiles();
  loadSelectData();
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateFile = (file: AppFile) => {
  const namePattern = /^[a-zA-Z0-9а-яА-ЯёЁ\s]+$/;
  const urlPattern = /^(https?|ftp):\/\/[^\s\/$.?#].\S*$/i;

  if (!file.name || !namePattern.test(file.name)) {
    $q.notify({ type: 'negative', message: 'Некорректное имя файла' });
    return false;
  }

  if (!file.link || !urlPattern.test(file.link)) {
    $q.notify({ type: 'negative', message: 'Некорректная ссылка на файл' });
    return false;
  }

  return true;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fileSchema = Joi.object({
  name: Joi.string().max(255).required().messages({
    'string.empty': 'Название файла обязательно',
    'string.max': 'Название файла не должно превышать 255 символов',
  }),
  link: Joi.string().uri().required().messages({
    'string.empty': 'Ссылка на файл обязательна',
    'string.uri': 'Ссылка на файл должна быть валидным URL',
  }),
  employee_id: Joi.number().integer().allow(null).messages({
    'number.base': 'Необходимо выбрать сотрудника',
  }),
}).unknown(false);

const createFileHandler = async () => {
  let employeeId = newFile.value.employee_id;

  if (typeof employeeId === 'object' && employeeId !== null) {
    employeeId = employeeId.value;
  }

  if (!employeeId) {
    $q.notify({
      type: 'negative',
      message: 'Необходимо выбрать сотрудника',
    });
    return;
  }

  const { error } = fileSchema.validate({
    name: newFile.value.name,
    link: newFile.value.link,
    employee_id: employeeId,
  });

  if (error) {
    $q.notify({
      type: 'negative',
      message: error.details[0].message,
    });
    return;
  }

  const fileData = {
    name: newFile.value.name.slice(0, 255),
    link: newFile.value.link.slice(0, 255),
    employee_id: employeeId,
  };

  try {
    // Создание файла
    await createFile(fileData);

    newFile.value = { id: '', name: '', link: '', employee_id: null };

    $q.notify({
      type: 'positive',
      message: 'Файл успешно добавлен',
    });
  } catch (error) {
    console.error('Ошибка добавления файла:', error);

    $q.notify({
      type: 'negative',
      message: 'Не удалось добавить файл',
    });
  }
};

const updateFileHandler = async () => {
  if (editedFile.value) {
    const employeeId =
      typeof editedFile.value.employee_id === 'object' &&
      editedFile.value.employee_id !== null
        ? editedFile.value.employee_id.value
        : editedFile.value.employee_id;

    if (employeeId === null || employeeId === 0) {
      $q.notify({
        type: 'negative',
        message: 'Необходимо выбрать сотрудника',
      });
      return;
    }

    const { error } = fileSchema.validate({
      name: editedFile.value.name,
      link: editedFile.value.link,
      employee_id: employeeId,
    });

    if (error) {
      $q.notify({
        type: 'negative',
        message: error.details[0].message,
      });
      return;
    }

    try {
      await updateFile(editedFile.value.id, {
        name: editedFile.value.name,
        link: editedFile.value.link,
        employee_id: employeeId,
      });

      await loadFiles();
      cancelEdit();

      $q.notify({
        type: 'positive',
        message: 'Файл успешно обновлён',
      });
    } catch (error) {
      console.error('Ошибка обновления файла:', error);

      $q.notify({
        type: 'negative',
        message: 'Не удалось обновить файл',
      });
    }
  }
};

const startEditingFile = (file: AppFile) => {
  editedFile.value = { ...file };
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
  editedFile.value = null;
};

const deleteFileHandler = async (fileId: number) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/files/${fileId}/soft-delete`,
      {},
      { withCredentials: true } // Убедитесь, что сессия отправляется с запросом
    );

    console.log('Response:', response.data);
    await loadFiles();
    $q.notify({ type: 'positive', message: 'Файл успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при удалении файла' });
  }
};

const {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedEmployeeId,
  isModalOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedFile,
  openModal,
  closeModal,
  handleFileUpload,
  uploadImage,
} = useFileUpload();
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

.custom-select {
  width: 230px !important;
}
</style>
