<template>
  <div>
    <AppHeader />

    <h1>Отделы</h1>

    <form @submit.prevent="createDepartmentHandler" class="form-container">
      <q-input
        v-model="newDepartment.name"
        label="Название отдела"
        filled
        required
      />
      <q-input v-model="newDepartment.comment" label="Комментарий" filled />
      <q-btn type="submit" label="Добавить" color="primary" />
    </form>

    <q-table
      :rows="departments"
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
          @click="startEditingDepartment(props.row)"
          flat
          size="sm"
        />
        <q-btn
          color="negative"
          label="Удалить"
          @click="deleteDepartmentHandler(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>

    <div v-if="editMode && editedDepartment" class="edit-form">
      <h3>Изменить отдел</h3>
      <form @submit.prevent="updateDepartmentHandler">
        <q-input
          v-model="editedDepartment.name"
          label="Название отдела"
          filled
          required
        />
        <q-input
          v-model="editedDepartment.comment"
          label="Комментарий отдела"
          filled
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
import { getDepartments, createDepartment, updateDepartment } from 'src/api';
import { QTableColumn, useQuasar } from 'quasar';
import axios from 'axios';
const $q = useQuasar();

interface Department {
  id: string;
  name: string;
  comment: string;
}

const departments = ref<Department[]>([]);
const newDepartment = ref<Department>({ id: '', name: '', comment: '' });
const editMode = ref(false);
const editedDepartment = ref<Department | null>(null);

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

const loadDepartments = async () => {
  try {
    departments.value = await getDepartments();
  } catch (error) {
    console.error('Ошибка загрузки отделов:', error);
  }
};

onMounted(() => {
  loadDepartments();
});

const createDepartmentHandler = async () => {
  try {
    await createDepartment({
      name: newDepartment.value.name.slice(0, 255),
      comment: newDepartment.value.comment,
    });
    newDepartment.value = { id: '', name: '', comment: '' };
    await loadDepartments();
  } catch (error) {
    console.error('Ошибка добавления отдела:', error);
  }
};

const updateDepartmentHandler = async () => {
  if (editedDepartment.value) {
    try {
      await updateDepartment(editedDepartment.value.id, {
        name: editedDepartment.value.name,
        comment: editedDepartment.value.comment,
      });
      await loadDepartments();
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления отдела:', error);
    }
  }
};

const startEditingDepartment = (department: Department) => {
  editedDepartment.value = { ...department };
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
  editedDepartment.value = null;
};

const deleteDepartmentHandler = async (departmentId: number) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/departments/${departmentId}/soft-delete`
    );
    console.log('Response:', response.data);
    await loadDepartments();
    $q.notify({ type: 'positive', message: 'Отдел удален' }); // Успешное уведомление
  } catch (error) {
    console.error('Error:', error);
    $q.notify({ type: 'negative', message: 'Ошибка при удалении отдела' }); // Ошибка
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
