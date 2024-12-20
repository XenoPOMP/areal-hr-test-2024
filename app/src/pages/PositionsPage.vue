<template>
  <div>
    <AppHeader />

    <h1>Должности</h1>

    <!-- Форма для добавления новой должности -->
    <form @submit.prevent="createPositionHandler" class="form-container">
      <q-input
        v-model="newPosition.name"
        label="Название должности"
        filled
        required
      />
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
        <q-input
          v-model="editedPosition.name"
          label="Название должности"
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
import {
  getPositions,
  createPosition,
  updatePosition,
} from 'src/api/positions';
import { useQuasar } from 'quasar';
import { positionsColumns } from 'src/pages/columns/positionsColumns';
import axios from 'axios';
import { positionSchema } from 'src/pages/shemas/Position.shemas';

const $q = useQuasar();

interface Position {
  id: string;
  name: string;
}

const positions = ref<Position[]>([]);
const newPosition = ref<Position>({ id: '', name: '' });
const editMode = ref(false);
const editedPosition = ref<Position | null>(null);

const columns = ref(positionsColumns);

const loadPositions = async () => {
  try {
    positions.value = await getPositions();
  } catch (error) {
    console.error('Ошибка загрузки должностей:', error);
  }
};

onMounted(() => {
  loadPositions();
});

const createPositionHandler = async () => {
  const positionData = {
    name: newPosition.value.name.slice(0, 255),
  };

  const { error } = positionSchema.validate(positionData, {
    abortEarly: false,
  });

  if (error) {
    error.details.forEach((err) =>
      $q.notify({ type: 'negative', message: err.message })
    );
    return;
  }

  try {
    await createPosition(positionData);

    newPosition.value = { id: '', name: '' };

    await loadPositions();

    $q.notify({ type: 'positive', message: 'Должность успешно добавлена' });
  } catch (error) {
    console.error('Ошибка добавления должности:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка при добавлении должности',
    });
  }
};

const updatePositionHandler = async () => {
  if (!editedPosition.value) return;

  const positionData = {
    name: editedPosition.value.name,
  };

  const { error } = positionSchema.validate(positionData, {
    abortEarly: false,
  });

  if (error) {
    error.details.forEach((err) =>
      $q.notify({ type: 'negative', message: err.message })
    );
    return;
  }

  try {
    await updatePosition(editedPosition.value.id, positionData);

    await loadPositions();

    cancelEdit();

    $q.notify({ type: 'positive', message: 'Должность успешно обновлена' });
  } catch (error) {
    console.error('Ошибка обновления должности:', error);
    $q.notify({
      type: 'negative',
      message: 'Ошибка при обновлении должности',
    });
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

const deletePositionHandler = async (posId: number) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/positions/${posId}/soft-delete`,
      {},
      { withCredentials: true }
    );

    console.log('Response:', response.data);

    await loadPositions();

    $q.notify({ type: 'positive', message: 'Должность успешно удалена' });
  } catch (error) {
    console.error('Ошибка удаления должности:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при удалении должности' });
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
