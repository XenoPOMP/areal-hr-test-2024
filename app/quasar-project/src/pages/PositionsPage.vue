<template>
  <div>
    <!-- Компонент шапки для навигации -->
    <AppHeader />

    <h1>Должности</h1>

    <!-- Форма для добавления новой должности -->
    <form @submit.prevent="createPositionHandler" class="form-container">
      <q-input v-model="newPosition.name" label="Название должности" filled required />
      <q-btn type="submit" label="Добавить" color="primary" />
    </form>

    <!-- Таблица должностей -->
    <q-table
      :rows="positions"
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
          @click="startEditingPosition(props.row)"
          flat
          size="sm"
        />
        <q-btn
          color="negative"
          label="Удалить"
          @click="deletePositionHandler(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>

    <!-- Форма редактирования должности -->
    <div v-if="editMode && editedPosition" class="edit-form">
      <h3>Изменить должность</h3>
      <form @submit.prevent="updatePositionHandler">
        <q-input v-model="editedPosition.name" label="Название должности" filled required />
        <q-btn type="submit" label="Изменить" color="primary" />
        <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { getPositions, createPosition, updatePosition, deletePosition } from 'src/api';
import { QTableColumn } from 'quasar';

// Интерфейс для должности
interface Position {
  id: string;
  name: string;
}

// Состояния для должностей, новой должности и редактируемой должности
const positions = ref<Position[]>([]);
const newPosition = ref<Position>({ id: '', name: '' });
const editMode = ref(false);
const editedPosition = ref<Position | null>(null);

// Определение колонок для таблицы
const columns: QTableColumn[] = [
  { name: 'name', label: 'Название', align: 'left', field: 'name', required: true },
  { name: 'actions', label: 'Действия', align: 'center', field: row => row.id }
];

// Загрузка списка должностей
const loadPositions = async () => {
  try {
    positions.value = await getPositions();
  } catch (error) {
    console.error('Ошибка загрузки должностей:', error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadPositions();
});

const createPositionHandler = async () => {
  try {
    await createPosition({
      name: newPosition.value.name.slice(0, 255),
    });
    newPosition.value = { id: '', name: '' };
    loadPositions();
  } catch (error) {
    console.error('Ошибка добавления должности:', error);
  }
};

const updatePositionHandler = async () => {
  if (editedPosition.value) {
    try {
      await updatePosition(editedPosition.value.id, {
        name: editedPosition.value.name,
      });
      await loadPositions();
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления должности:', error);
    }
  }
};

const startEditingPosition = (position: Position) => {
  editedPosition.value = { ...position };
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
  editedPosition.value = null;
};

const deletePositionHandler = async (id: string) => {
  try {
    await deletePosition(id);
    loadPositions();
  } catch (error) {
    console.error('Ошибка удаления должности:', error);
  }
};
</script>

<style scoped>
.form-container, .edit-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.table-container {
  margin-top: 1rem;
}
</style>
