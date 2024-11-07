<template>
  <div>
    <h1>Организации</h1>

    <!-- Форма для добавления новой организации -->
    <form @submit.prevent="createOrganizationHandler">
      <input v-model="newOrganization.org_name" placeholder="Название организации" required />
      <input v-model="newOrganization.org_comment" placeholder="Комментарий" />
      <button type="submit">Добавить</button>
    </form>

    <!-- Список организаций с кнопками редактирования и удаления -->
    <ul>
      <li v-for="organization in organizations" :key="organization.id">
        <strong>{{ organization.org_name }}</strong>: {{ organization.org_comment }}
        <button @click="startEditingOrganization(organization)">Изменить</button>
        <button @click="deleteOrganizationHandler(organization.id)">Удалить</button>
      </li>
    </ul>

    <!-- Форма редактирования организации (отображается только при наличии editedOrganization) -->
    <div v-if="editMode && editedOrganization">
      <h3>Изменить организацию</h3>
      <form @submit.prevent="updateOrganizationHandler">
        <input v-model="editedOrganization.org_name" placeholder="Название организации" required />
        <input v-model="editedOrganization.org_comment" placeholder="Комментарий организации" />
        <button type="submit">Изменить</button>
        <button @click="cancelEdit">Отмена</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization } from 'src/api';

// Интерфейс для организации
interface Organization {
  id: string;
  org_name: string;
  org_comment: string;
}

// Состояния для организаций, новой организации и редактируемой организации
const organizations = ref<Organization[]>([]);
const newOrganization = ref<Organization>({ id: '', org_name: '', org_comment: '' });
const editMode = ref(false);  // Режим редактирования
const editedOrganization = ref<Organization | null>(null);  // Текущая редактируемая организация

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
      org_name: newOrganization.value.org_name.slice(0, 255),
      org_comment: newOrganization.value.org_comment,
    });
    newOrganization.value = { id: '', org_name: '', org_comment: '' };  // Очистка формы
    loadOrganizations();  // Обновление списка организаций
  } catch (error) {
    console.error('Ошибка добавления организации:', error);
  }
};

const updateOrganizationHandler = async () => {
  if (editedOrganization.value) {
    try {
      await updateOrganization(editedOrganization.value.id, {
        org_name: editedOrganization.value.org_name,
        org_comment: editedOrganization.value.org_comment,
      });
      await loadOrganizations();  // Перезагрузка списка организаций из базы данных
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления организации:', error);
    }
  }
};

// Обработчик начала редактирования
const startEditingOrganization = (organization: Organization) => {
  editedOrganization.value = { ...organization };  // Копируем данные организации для редактирования
  editMode.value = true;  // Включаем режим редактирования
};

// Отмена редактирования
const cancelEdit = () => {
  editMode.value = false;
  editedOrganization.value = null;
};

// Удаление организации
const deleteOrganizationHandler = async (id: string) => {
  try {
    await deleteOrganization(id);
    loadOrganizations();  // Обновление списка организаций после удаления
  } catch (error) {
    console.error('Ошибка удаления организации:', error);
  }
};
</script>
