<template>
  <div>
    <AppHeader />

    <h1>Файлы</h1>

    <form @submit.prevent="createFileHandler" class="form-container">
      <q-input v-model="newFile.name" label="Название" filled required />
      <q-input v-model="newFile.link" label="Ссылка на файл" filled required />
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
        <q-btn type="submit" label="Изменить" color="primary" />
        <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { getFiles, createFile, updateFile } from 'src/api';
import { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import Joi from 'joi';
import axios from 'axios';
const $q = useQuasar();

interface File {
  id: string;
  name: string;
  link: string;
}

const files = ref<File[]>([]);
const newFile = ref<File>({ id: '', name: '', link: '' });
const editMode = ref(false);
const editedFile = ref<File | null>(null);

const columns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Название',
    align: 'left',
    field: 'name',
    required: true,
  },
  {
    name: 'link',
    label: 'Ссылка на файл',
    align: 'left',
    field: 'link',
    required: true,
  },
  { name: 'actions', label: 'Действия', align: 'center', field: 'actions' },
];

const loadFiles = async () => {
  try {
    files.value = await getFiles();
  } catch (error) {
    console.error('Ошибка загрузки файлов:', error);
  }
};

onMounted(() => {
  loadFiles();
});

const validateFile = (file: File) => {
  const namePattern = /^[a-zA-Z0-9а-яА-ЯёЁ\s]+$/;
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

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
}).unknown(false);

const createFileHandler = async () => {
  if (!validateFile(newFile.value)) return;

  try {
    // Передаем только необходимые данные, без id
    const { name, link } = newFile.value;
    await createFile({ name: name.slice(0, 255), link: link.slice(0, 255) });
    newFile.value = { id: '', name: '', link: '' };
    await loadFiles();
  } catch (error) {
    console.error('Ошибка добавления файла:', error);
    $q.notify({
      type: 'negative',
      message: 'Не удалось добавить файл',
    });
  }
};

const updateFileHandler = async () => {
  if (editedFile.value && !validateFile(editedFile.value)) return;

  if (editedFile.value) {
    try {
      await updateFile(editedFile.value.id, {
        name: editedFile.value.name,
        link: editedFile.value.link,
      });
      await loadFiles();
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления файла:', error);
    }
  }
};

const startEditingFile = (file: File) => {
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
