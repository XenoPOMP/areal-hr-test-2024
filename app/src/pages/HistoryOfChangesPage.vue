<template>
  <div>
    <AppHeader />

    <h1>История изменений</h1>

    <q-table
      :rows="historyRecords"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="table-container"
    >
      <template v-slot:body-cell-field="props">
        <span>{{ formatField(props.row.field) }}</span>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-btn
          color="negative"
          label="Удалить"
          @click="deleteRecordHandler(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { getHistoryOfChanges } from 'src/api';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { history_of_changesColumns } from 'pages/columns';

const $q = useQuasar();

interface HistoryRecord {
  id: number;
  object: string;
  field: Record<string, unknown>; // JSON как объект
  date: string;
}

const historyRecords = ref<HistoryRecord[]>([]);

const columns = ref(history_of_changesColumns);

const loadHistoryRecords = async () => {
  try {
    const records = await getHistoryOfChanges();
    historyRecords.value = records.map((record: HistoryRecord) => ({
      ...record,
      date: new Date(record.date).toLocaleString(), // Форматируем дату
    }));
  } catch (error) {
    console.error('Ошибка загрузки истории изменений:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при загрузке данных' });
  }
};

const formatField = (field: Record<string, unknown>): string => {
  // Форматируем JSON-поле для отображения
  return Object.entries(field)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
};

const deleteRecordHandler = async (historyId: number) => {
  try {
    await axios.patch(
      `http://localhost:3000/history-of-changes/${historyId}/soft-delete`
    );
    await loadHistoryRecords();
    $q.notify({ type: 'positive', message: 'Запись успешно удалена' });
  } catch (error) {
    console.error('Ошибка удаления записи:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при удалении записи' });
  }
};

onMounted(() => {
  loadHistoryRecords();
});
</script>

<style scoped>
.table-container {
  margin-top: 1rem;
}
</style>
