<template>
  <div>
    <AppHeader />

    <h1>Организации</h1>

    <!-- Кнопка открытия модального окна добавления -->
    <q-btn
      label="Добавить организацию"
      color="primary"
      @click="showAddModal = true"
    />

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
          @click="startEditingWithModal(props.row)"
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

    <!-- Модальное окно для добавления организации -->
    <q-dialog v-model="showAddModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Добавить организацию</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newOrganization.name"
            label="Название организации"
            filled
            required
          />
          <q-input
            v-model="newOrganization.comment"
            label="Комментарий"
            filled
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

    <!-- Модальное окно для редактирования организации -->
    <q-dialog v-model="showEditModal">
      <q-card v-if="editedOrganization">
        <q-card-section>
          <div class="text-h6">Изменить организацию</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editedOrganization.name"
            label="Название организации"
            filled
            required
          />
          <q-input
            v-model="editedOrganization.comment"
            label="Комментарий"
            filled
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
import { ref, onMounted } from 'vue';
import AppHeader from 'components/AppHeader.vue';
import { organizationsColumns } from 'src/pages/columns/organizationsColumns';
import { getOrganizations } from 'src/api/organizations';

import { useCreateOrganization } from 'src/pages/composables/organizations/useCreateOrganization';
import { useUpdateOrganization } from 'src/pages/composables/organizations/useUpdateOrganization';
import { useDeleteOrganization } from 'src/pages/composables/organizations/useDeleteOrganization';

const columns = organizationsColumns;

const organizations = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);

const loadOrganizations = async () => {
  try {
    organizations.value = await getOrganizations();
  } catch (error) {
    console.error('Ошибка загрузки организаций:', error);
  }
};

onMounted(loadOrganizations);

const { newOrganization, createOrganizationHandler } =
  useCreateOrganization(loadOrganizations);
const {
  editedOrganization,
  startEditingOrganization,
  cancelEdit,
  updateOrganizationHandler,
} = useUpdateOrganization(loadOrganizations);
const { deleteOrganizationHandler } = useDeleteOrganization(loadOrganizations);

const handleCreate = async () => {
  await createOrganizationHandler();
  showAddModal.value = false;
};

const handleUpdate = async () => {
  await updateOrganizationHandler();
  showEditModal.value = false;
};

const startEditingWithModal = (organization: {
  id: string;
  name: string;
  comment: string;
}) => {
  startEditingOrganization(organization);
  showEditModal.value = true;
};
</script>

<style scoped>
.table-container {
  margin-top: 1rem;
}

.q-dialog {
  min-width: 400px;
}
</style>
