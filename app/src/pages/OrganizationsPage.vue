<template>
  <div>
    <!-- Компонент шапки для навигации -->
    <AppHeader />

    <h1>Организации</h1>

    <!-- Форма для добавления новой организации -->
    <form @submit.prevent="createOrganizationHandler" class="form-container">
      <q-input
        v-model="newOrganization.name"
        label="Название организации"
        filled
        required
      />
      <q-input v-model="newOrganization.comment" label="Комментарий" filled />
      <q-btn type="submit" label="Добавить" color="primary" />
    </form>

    <!-- Таблица организаций -->
    <q-table
      :rows="organizations"
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
          @click="startEditingOrganization(props.row)"
          flat
          size="sm"
        />
        <q-btn
          color="negative"
          label="Удалить"
          @click="deleteOrganizationHandler(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>

    <!-- Форма редактирования организации -->
    <div v-if="editMode && editedOrganization" class="edit-form">
      <h3>Изменить организацию</h3>
      <form @submit.prevent="updateOrganizationHandler">
        <q-input
          v-model="editedOrganization.name"
          label="Название организации"
          filled
          required
        />
        <q-input
          v-model="editedOrganization.comment"
          label="Комментарий организации"
          filled
        />
        <q-btn type="submit" label="Изменить" color="primary" />
        <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
} from 'src/api';
import { QTableColumn } from 'quasar';
import AppHeader from 'components/AppHeader.vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
const $q = useQuasar();

// Определение колонок для таблицы
const columns: QTableColumn[] = [
  {
    name: 'name',
    label: 'Название',
    align: 'left',
    field: 'name',
    required: true,
  },
  { name: 'comment', label: 'Комментарий', align: 'left', field: 'comment' },
  {
    name: 'actions',
    label: 'Действия',
    align: 'center',
    field: (row) => row.id,
  },
];

// Интерфейс для организации
interface Organization {
  id: string;
  name: string;
  comment: string;
}

// Состояния для организаций, новой организации и редактируемой организации
const organizations = ref<Organization[]>([]);
const newOrganization = ref<Organization>({ id: '', name: '', comment: '' });
const editMode = ref(false); // Режим редактирования
const editedOrganization = ref<Organization | null>(null); // Текущая редактируемая организация

// Загрузка списка организаций
const loadOrganizations = async () => {
  try {
    organizations.value = await getOrganizations();
  } catch (error) {
    console.error('Ошибка загрузки организаций:', error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadOrganizations();
});

const createOrganizationHandler = async () => {
  try {
    await createOrganization({
      name: newOrganization.value.name.slice(0, 255),
      comment: newOrganization.value.comment,
    });
    newOrganization.value = { id: '', name: '', comment: '' }; // Очистка формы
    await loadOrganizations(); // Обновление списка организаций
  } catch (error) {
    console.error('Ошибка добавления организации:', error);
  }
};

const updateOrganizationHandler = async () => {
  if (editedOrganization.value) {
    try {
      await updateOrganization(editedOrganization.value.id, {
        name: editedOrganization.value.name,
        comment: editedOrganization.value.comment,
      });
      await loadOrganizations(); // Перезагрузка списка организаций из базы данных
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления организации:', error);
    }
  }
};

// Обработчик начала редактирования
const startEditingOrganization = (organization: Organization) => {
  editedOrganization.value = { ...organization }; // Копируем данные организации для редактирования
  editMode.value = true; // Включаем режим редактирования
};

const cancelEdit = () => {
  editMode.value = false;
  editedOrganization.value = null;
};

const deleteOrganizationHandler = async (orgId: number) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/organizations/${orgId}/soft-delete`
    );
    console.log('Response:', response.data);
    await loadOrganizations();
    $q.notify({ type: 'positive', message: 'Организация успешно удалена' });
  } catch (error) {
    console.error('Ошибка удаления организации:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при удалении организации' });
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
