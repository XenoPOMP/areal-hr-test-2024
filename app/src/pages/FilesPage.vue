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
            <!-- Кнопка для выбора изображения -->
            <q-btn
              color="primary"
              label="Добавить скан"
              icon="attach_file"
              flat
              size="sm"
              @click="selectImage(props.row.employee_id)"
            />
            <input
              type="file"
              :ref="`fileImage_${props.row.employee_id}`"
              :data-employee-id="props.row.employee_id"
              accept="image/*"
              @change="handleImageChange(props.row.employee_id)"
              style="display: none"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

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
        />
        <q-btn type="submit" label="Изменить" color="primary" />
        <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import { createFile, getFiles, updateFile } from 'src/api';
import { useQuasar } from 'quasar';
import { fileColumns } from './columns';
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
      `http://localhost:3000/files/${fileId}/soft-delete`
    );
    console.log('Response:', response.data);
    await loadFiles();
    $q.notify({ type: 'positive', message: 'Файл успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при удалении файла' });
  }
};

const selectedFile = ref<File | null>(null);
const loading = ref(false);
const message = ref('');
const notifyColor = ref('positive');

const fileImageInputs = ref<Record<string, HTMLInputElement | null>>({});
console.log(fileImageInputs.value);
console.log(JSON.stringify(fileImageInputs.value));

const selectImage = (employee_id: number) => {
  const fileInput = fileImageInputs.value[`fileImage_${employee_id}`];
  console.log(`fileInput for employee ${employee_id}:`, fileInput);
  if (fileInput && fileInput instanceof HTMLInputElement) {
    fileInput.click();
  } else {
    console.error(`Не удалось найти input для сотрудника с id: ${employee_id}`);
  }
};

const handleImageChange = (employee_id: number) => {
  const fileInput = fileImageInputs.value[`fileImage_${employee_id}`];
  console.log(`File input change for employee ${employee_id}:`, fileInput);
  if (fileInput && fileInput.files && fileInput.files.length > 0) {
    selectedFile.value = fileInput.files[0]; // Тип файла уже указан, этого будет достаточно
    uploadImage(employee_id);
  } else {
    console.error('Файл не выбран');
    $q.notify({
      type: 'negative',
      message: 'Пожалуйста, выберите изображение.',
    });
  }
};

watch(
  () => files,
  async () => {
    await nextTick();
    const inputs = document.querySelectorAll('input[type="file"]');
    inputs.forEach((input: Element) => {
      const employee_id = (input as HTMLInputElement).getAttribute(
        'data-employee-id'
      );
      console.log(`Input for employee_id: ${employee_id}`);
      if (employee_id) {
        fileImageInputs.value[`fileImage_${employee_id}`] =
          input as HTMLInputElement;
      }
    });
  },
  { immediate: true }
);

const uploadImage = async (employee_id: number) => {
  if (!selectedFile.value) {
    $q.notify({
      type: 'negative',
      message: 'Пожалуйста, выберите изображение.',
    });
    return;
  }

  loading.value = true;
  message.value = '';
  notifyColor.value = 'positive';

  const formData = new FormData();
  formData.append('image', selectedFile.value);
  formData.append('employee_id', String(employee_id));

  try {
    const response = await axios.post('/uploads/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    message.value = response.data.filePath;
    notifyColor.value = 'positive';
  } catch (error) {
    console.error(error);
    message.value = 'Ошибка при загрузке изображения';
    notifyColor.value = 'negative';
  } finally {
    loading.value = false;
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
