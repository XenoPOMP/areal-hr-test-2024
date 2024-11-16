<template>
  <div>
    <!-- Компонент шапки для навигации -->
    <AppHeader />

    <h1>Кадровые операции</h1>

    <!-- Форма для добавления новой кадровой операции -->
    <form @submit.prevent="createActionHandler" class="form-container">
      <q-input
        v-model="newAction.action_type"
        label="Тип операции"
        filled
        required
      />
      <q-input
        v-model="newAction.date"
        label="Дата"
        type="date"
        filled
        required
      />
      <q-btn type="submit" label="Добавить" color="primary" />
    </form>

    <!-- Таблица кадровых операций -->
    <q-table
      :rows="actions"
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
          @click="startEditingAction(props.row)"
          flat
          size="sm"
        />
        <q-btn
          color="negative"
          label="Удалить"
          @click="deleteActionHandler(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>

    <!-- Форма редактирования кадровой операции -->
    <div v-if="editMode && editedAction" class="edit-form">
      <h3>Изменить данные операции</h3>
      <form @submit.prevent="updateActionHandler">
        <q-input
          v-model="editedAction.action_type"
          label="Тип операции"
          filled
          required
        />
        <q-input
          v-model="editedAction.date"
          label="Дата"
          type="date"
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
  getHRActions,
  createHRAction,
  updateHRAction,
  deleteHRAction,
} from 'src/api';
import { QTableColumn } from 'quasar';

// Интерфейс для кадровой операции
interface HRActions {
  id: string;
  action_type: string;
  date: string;
}

// Состояния для операции, новой операции и редактируемой операции
const actions = ref<HRActions[]>([]);
const newAction = ref<HRActions>({ id: '', action_type: '', date: '' });
const editMode = ref(false);
const editedAction = ref<HRActions | null>(null);

// Определение колонок для таблицы
const columns: QTableColumn[] = [
  {
    name: 'action_type',
    label: 'Тип операции',
    align: 'left',
    field: 'action_type',
    required: true,
  },
  { name: 'date', label: 'Дата', align: 'left', field: 'date', required: true },
  { name: 'actions', label: 'Действия', align: 'center', field: 'actions' },
];

// Загрузка списка операций
const loadActions = async () => {
  try {
    actions.value = await getHRActions();
  } catch (error) {
    console.error('Ошибка загрузки операций:', error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadActions();
});

const createActionHandler = async () => {
  try {
    await createHRAction({
      action_type: newAction.value.action_type.slice(0, 50),
      date: newAction.value.date,
    });
    newAction.value = { id: '', action_type: '', date: '' };
    await loadActions();
  } catch (error) {
    console.error('Ошибка добавления операции:', error);
  }
};

const updateActionHandler = async () => {
  if (editedAction.value) {
    try {
      await updateHRAction(editedAction.value.id, {
        action_type: editedAction.value.action_type,
        date: editedAction.value.date,
      });
      await loadActions();
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления операции:', error);
    }
  }
};

const startEditingAction = (action: HRActions) => {
  editedAction.value = { ...action };
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
  editedAction.value = null;
};

const deleteActionHandler = async (id: string) => {
  try {
    await deleteHRAction(id);
    await loadActions();
  } catch (error) {
    console.error('Ошибка удаления операции:', error);
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
