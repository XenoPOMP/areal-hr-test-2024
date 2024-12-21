<template>
  <div>
    <AppHeader />

    <h1>Должности</h1>

    <!-- Кнопка открытия модального окна добавления -->
    <q-btn
      label="Добавить должность"
      color="primary"
      @click="showAddModal = true"
    />

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
          @click="startEditingWithModal(props.row)"
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

    <!-- Модальное окно для добавления должности -->
    <q-dialog v-model="showAddModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавить должность</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newPosition.name"
            label="Название должности"
            filled
            required
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Отмена"
            color="negative"
            @click="showAddModal = false"
          />
          <q-btn flat label="Добавить" color="primary" @click="handleCreate" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Модальное окно для редактирования должности -->
    <q-dialog v-model="showEditModal">
      <q-card v-if="editedPosition">
        <q-card-section>
          <div class="text-h6">Изменить должность</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editedPosition.name"
            label="Название должности"
            filled
            required
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="negative" @click="cancelEdit" />
          <q-btn flat label="Сохранить" color="primary" @click="handleUpdate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { getPositions } from 'src/api/positions';
import { positionsColumns } from 'src/pages/columns/positionsColumns';
import { useCreatePosition } from 'src/pages/composables/positions/useCreatePosition';
import { useUpdatePosition } from 'src/pages/composables/positions/useUpdatePosition';
import { useDeletePosition } from 'src/pages/composables/positions/useDeletePosition';

const positions = ref([]);
const columns = ref(positionsColumns);

const loadPositions = async () => {
  try {
    positions.value = await getPositions();
  } catch (err) {
    console.error('Ошибка загрузки должностей:', err);
  }
};

onMounted(loadPositions);

const { newPosition, createPositionHandler } = useCreatePosition(loadPositions);
const {
  editedPosition,
  startEditingPosition,
  cancelEdit,
  updatePositionHandler,
} = useUpdatePosition(loadPositions);
const { deletePositionHandler } = useDeletePosition(loadPositions);

const showAddModal = ref(false);
const showEditModal = ref(false);

const handleCreate = async () => {
  await createPositionHandler();
  showAddModal.value = false;
};

const handleUpdate = async () => {
  await updatePositionHandler();
  showEditModal.value = false;
};

const startEditingWithModal = (position: { id: string; name: string }) => {
  startEditingPosition(position);
  showEditModal.value = true;
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
