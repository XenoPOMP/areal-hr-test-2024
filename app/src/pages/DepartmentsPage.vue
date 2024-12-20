<template>
  <div>
    <AppHeader />
    <h1>Отделы</h1>
    <q-btn label="Добавить отдел" color="primary" @click="openAddModal" />

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
          @click="deleteDepartment(props.row.id)"
          flat
          size="sm"
        />
      </template>
    </q-table>

    <!-- Модальное окно для добавления -->
    <q-dialog v-model="isAddModalOpen">
      <q-card>
        <q-card-section>
          <h3>Добавить отдел</h3>
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="createDepartment(newDepartment)">
            <q-input
              v-model="newDepartment.name"
              label="Название отдела"
              filled
              required
            />
            <q-input
              v-model="newDepartment.comment"
              label="Комментарий"
              filled
            />
            <q-btn type="submit" label="Добавить" color="primary" />
            <q-btn
              label="Отмена"
              color="secondary"
              flat
              @click="closeAddModal"
            />
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Модальное окно для изменения -->
    <q-dialog v-model="isEditModalOpen">
      <q-card>
        <q-card-section>
          <h3>Изменить отдел</h3>
        </q-card-section>

        <q-card-section>
          <form @submit.prevent="saveEditedDepartment">
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
            <q-btn type="submit" label="Сохранить" color="primary" />
            <q-btn label="Отмена" color="secondary" flat @click="cancelEdit" />
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import AppHeader from 'src/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
import { QTableColumn } from 'quasar';
import { departmentColumns } from 'src/pages/columns/departmentsColumns';
import { useGetDepartments } from 'src/pages/composables/departments/useGetDepartment';
import { useCreateDepartment } from 'src/pages/composables/departments/useCreateDepartment';
import { useUpdateDepartment } from 'src/pages/composables/departments/useUpdateDepartment';
import { useDeleteDepartment } from 'src/pages/composables/departments/useDeleteDepartment';

const columns: QTableColumn[] = departmentColumns;
const { departments, loadDepartments } = useGetDepartments();
const { createDepartment } = useCreateDepartment(loadDepartments);
const { updateDepartment } = useUpdateDepartment(loadDepartments);
const { deleteDepartment } = useDeleteDepartment(loadDepartments);

const newDepartment = ref({
  name: '',
  comment: '',
  parent_id: null,
  organisation_id: null,
});

const editedDepartment = ref({
  id: 0,
  name: '',
  comment: '',
  parent_id: null,
  organisation_id: null,
});

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);

const openAddModal = () => {
  isAddModalOpen.value = true;
};

const closeAddModal = () => {
  isAddModalOpen.value = false;
  newDepartment.value = {
    name: '',
    comment: '',
    parent_id: null,
    organisation_id: null,
  };
};

const startEditingDepartment = (department: typeof editedDepartment.value) => {
  editedDepartment.value = { ...department };
  isEditModalOpen.value = true;
};

const cancelEdit = () => {
  isEditModalOpen.value = false;
};

const saveEditedDepartment = async () => {
  await updateDepartment(editedDepartment.value.id, editedDepartment.value);
};

onMounted(() => {
  loadDepartments();
});
</script>

<style scoped>
.form-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.table-container {
  margin-top: 1rem;
}
</style>
