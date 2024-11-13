<template>
  <div>
    <AppHeader />

    <h1>История изменений</h1>

    <!-- Форма для добавления новой записи в историю изменений -->
    <form @submit.prevent="createHistoryRecordHandler" class="form-container">
      <q-input v-model="newRecord.object" label="Объект" filled required />
      <q-input
        v-model="newField"
        label="Измененные поля (JSON)"
        filled
        required
      />
      <q-input
        v-model="newRecord.date"
        label="Дата"
        filled
        type="date"
        required
      />
      <q-btn type="submit" label="Добавить" color="primary" />
    </form>

    <q-table
      :rows="historyRecords"
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
          @click="startEditingRecord(props.row)"
          flat
          size="sm"
        />
        <q-btn
          color="negative"
          label="Удалить"
          @click="deleteRecordHandler(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>

    <div v-if="editMode && editedRecord" class="edit-form">
      <h3>Изменить запись истории изменений</h3>
      <form @submit.prevent="updateHistoryRecordHandler">
        <q-input v-model="editedRecord.object" label="Объект" filled required />
        <q-input
          v-model="editField"
          label="Измененные поля (JSON)"
          filled
          required
        />
        <q-input
          v-model="editedRecord.date"
          label="Дата"
          filled
          type="date"
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
import {
  getHistoryOfChanges,
  createHistoryOfChange,
  updateHistoryOfChange,
  deleteHistoryOfChange,
} from 'src/api';
import { QTableColumn } from 'quasar';

// Интерфейс для записи истории изменений
interface HistoryRecord {
  id: string;
  object: string;
  field: Record<string, unknown>; // JSON как объект
  date: string;
}

// Состояния для записи, новой записи и редактируемой записи
const historyRecords = ref<HistoryRecord[]>([]);
const newRecord = ref<HistoryRecord>({
  id: '',
  object: '',
  field: {},
  date: '',
});
const newField = ref(''); // строка для ввода JSON
const editMode = ref(false);
const editedRecord = ref<HistoryRecord | null>(null);
const editField = ref(''); // строка для редактирования JSON

const columns: QTableColumn[] = [
  {
    name: 'object',
    label: 'Объект',
    align: 'left',
    field: 'object',
    required: true,
  },
  {
    name: 'field',
    label: 'Измененные поля',
    align: 'left',
    field: 'field',
    required: true,
  },
  { name: 'date', label: 'Дата', align: 'left', field: 'date', required: true },
  { name: 'actions', label: 'Действия', align: 'center', field: 'actions' },
];

const loadHistoryRecords = async () => {
  try {
    historyRecords.value = await getHistoryOfChanges();
  } catch (error) {
    console.error('Ошибка загрузки истории изменений:', error);
  }
};

onMounted(() => {
  loadHistoryRecords();
});

const createHistoryRecordHandler = async () => {
  try {
    newRecord.value.field = JSON.parse(newField.value);
    await createHistoryOfChange({
      object: newRecord.value.object,
      field: newRecord.value.field,
      date: newRecord.value.date,
    });
    newRecord.value = { id: '', object: '', field: {}, date: '' };
    newField.value = '';
    loadHistoryRecords();
  } catch (error) {
    console.error('Ошибка добавления записи в историю изменений:', error);
  }
};

const updateHistoryRecordHandler = async () => {
  if (editedRecord.value) {
    try {
      editedRecord.value.field = JSON.parse(editField.value);
      await updateHistoryOfChange(editedRecord.value.id, {
        object: editedRecord.value.object,
        field: editedRecord.value.field,
        date: editedRecord.value.date,
      });
      await loadHistoryRecords();
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления записи истории изменений:', error);
    }
  }
};

const startEditingRecord = (record: HistoryRecord) => {
  editedRecord.value = { ...record };
  editField.value = JSON.stringify(record.field); // Показ JSON для редактирования
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
  editedRecord.value = null;
  editField.value = '';
};

const deleteRecordHandler = async (id: string) => {
  try {
    await deleteHistoryOfChange(id);
    loadHistoryRecords();
  } catch (error) {
    console.error('Ошибка удаления записи истории изменений:', error);
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
