<template>
  <div>
    <!-- Компонент шапки для навигации -->
    <AppHeader />

    <h1>Файлы</h1>

    <!-- Форма для добавления нового файла -->
    <form @submit.prevent="createFileHandler" class="form-container">
      <q-input v-model="newFile.name" label="Название" filled required />
      <q-input v-model="newFile.link" label="Ссылка на файл" filled required />
      <q-btn type="submit" label="Добавить" color="primary" />
    </form>

    <!-- Таблица файлов -->
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

    <!-- Форма редактирования сотрудника -->
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
import { getFiles, createFile, updateFile, deleteFile } from 'src/api';
import { QTableColumn } from 'quasar';

// Интерфейс для файла
interface File {
  id: string;
  name: string;
  link: string;
}

// Состояния для файла, нового файла и редактируемого файла
const files = ref<File[]>([]);
const newFile = ref<File>({ id: '', name: '', link: '' });
const editMode = ref(false);
const editedFile = ref<File | null>(null);

// Определение колонок для таблицы
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

// Загрузка списка сотрудников
const loadFiles = async () => {
  try {
    files.value = await getFiles();
  } catch (error) {
    console.error('Ошибка загрузки файлов:', error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadFiles();
});

const createFileHandler = async () => {
  try {
    await createFile({
      name: newFile.value.name.slice(0, 255),
      link: newFile.value.link.slice(0, 255),
    });
    newFile.value = { id: '', name: '', link: '' };
    await await loadFiles();
  } catch (error) {
    console.error('Ошибка добавления файла:', error);
  }
};

const updateFileHandler = async () => {
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

const deleteFileHandler = async (id: string) => {
  try {
    await deleteFile(id);
    await loadFiles();
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
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
