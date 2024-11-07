<template>
  <div>
    <h1>Организации</h1>

    <!-- Форма для добавления новой организации -->
    <form @submit.prevent="createOrganizationHandler">
      <input v-model="newOrganization.name" placeholder="Название отдела" required />
      <input v-model="newOrganization.comment" placeholder="Комментарий" />
      <button type="submit">Добавить</button>
    </form>

    <!-- Список организаций с кнопками редактирования и удаления -->
    <ul>
      <li v-for="organization in organizations" :key="organization.id">
        <strong>{{ organization.name }}</strong>: {{ organization.comment }}
        <button @click="startEditingOrganization(organization)">Изменить</button>
        <button @click="deleteOrganizationHandler(organization.id)">Удалить</button>
      </li>
    </ul>

    <!-- Форма редактирования организации (отображается только при наличии editedOrganization) -->
    <div v-if="editMode && editedOrganization">
      <h3>Изменить организацию</h3>
      <form @submit.prevent="updateOrganizationHandler">
        <input v-model="editedOrganization.name" placeholder="Название организации" required />
        <input v-model="editedOrganization.comment" placeholder="Комментарий организации" />
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
  name: string;
  comment: string;
}

// Состояния для организаций, новой организации и редактируемой организации
const organizations = ref<Organization[]>([]);
const newOrganization = ref<{ name: string; comment: string }>({ name: '', comment: '' });
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

// Обработчик создания новой организации
const createOrganizationHandler = async () => {
  try {
    await createOrganization({
      name: newOrganization.value.name,
      comment: newOrganization.value.comment,
    });
    newOrganization.value = { name: '', comment: '' };  // Очистка формы
    loadOrganizations();  // Обновление списка организаций
  } catch (error) {
    console.error('Ошибка добавления организации:', error);
  }
};

// Обработчик начала редактирования
const startEditingOrganization = (organization: Organization) => {
  editedOrganization.value = { ...organization };  // Копируем данные организации для редактирования
  editMode.value = true;  // Включаем режим редактирования
};

// Обработчик обновления организации
const updateOrganizationHandler = async () => {
  if (editedOrganization.value) {
    try {
      // Отправка обновления на сервер
      await updateOrganization(editedOrganization.value.id, {
        name: editedOrganization.value.name,
        comment: editedOrganization.value.comment,
      });

      // Перезагрузка списка организаций из базы данных
      await loadOrganizations();  // Это гарантирует, что данные обновляются из базы
      cancelEdit();  // Завершение режима редактирования
    } catch (error) {
      console.error('Ошибка обновления организации:', error);
    }
  }
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
