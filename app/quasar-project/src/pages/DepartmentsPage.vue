<template>
  <div>
    <h1>Отделы</h1>

    <!-- Форма для добавления нового отдела -->
    <form @submit.prevent="createDepartmentHandler">
      <input v-model="newDepartment.name" placeholder="Название отдела" required />
      <input v-model="newDepartment.comment" placeholder="Комментарий" />
      <button type="submit">Добавить</button>
    </form>

    <!-- Список отделов с кнопками редактирования и удаления -->
    <ul>
      <li v-for="department in departments" :key="department.id">
        <strong>{{ department.name }}</strong>: {{ department.comment }}
        <button @click="startEditingDepartment(department)">Изменить</button>
        <button @click="deleteDepartmentHandler(department.id)">Удалить</button>
      </li>
    </ul>

    <!-- Форма редактирования отдела (отображается только при наличии editedDepartment) -->
    <div v-if="editMode && editedDepartment">
      <h3>Изменить отдел</h3>
      <form @submit.prevent="updateDepartmentHandler">
        <input v-model="editedDepartment.name" placeholder="Название отдела" required/>
        <input v-model="editedDepartment.comment" placeholder="Комментарий отдела"/>
        <button type="submit">Изменить</button>
        <button @click="cancelEdit">Отмена</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {getDepartments, createDepartment, updateDepartment, deleteDepartment} from 'src/api';

// Интерфейс для отдела
interface Department {
  id: string;
  name: string;
  comment: string;
}

// Состояния для отделов, нового отдела и редактируемого отдела
const departments = ref<Department[]>([]);
const newDepartment = ref<{ name: string; comment: string }>({name: '', comment: ''});
const editMode = ref(false);  // Режим редактирования
const editedDepartment = ref<Department | null>(null);  // Текущий редактируемый отдел

// Загрузка списка отделов
const loadDepartments = async () => {
  try {
    departments.value = await getDepartments();
  } catch (error) {
    console.error('Ошибка загрузки отделов:', error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadDepartments();
});

// Обработчик создания нового отдела
const createDepartmentHandler = async () => {
  try {
    await createDepartment({
      name: newDepartment.value.name,
      comment: newDepartment.value.comment,
    });
    newDepartment.value = {name: '', comment: ''};  // Очистка формы
    loadDepartments();  // Обновление списка отделов
  } catch (error) {
    console.error('Ошибка добавления отдела:', error);
  }
};

// Обработчик начала редактирования
const startEditingDepartment = (department: Department) => {
  editedDepartment.value = {...department};  // Копируем данные отдела для редактирования
  editMode.value = true;  // Включаем режим редактирования
};

// Обработчик обновления отдела
const updateDepartmentHandler = async () => {
  if (editedDepartment.value) {
    try {
      await updateDepartment(editedDepartment.value.id, {
        name: editedDepartment.value.name,
        comment: editedDepartment.value.comment,
      });

      // Перезагрузка списка организаций из базы данных
      await loadDepartments();  // Перезагрузка списка отделов
      cancelEdit();  // Завершение режима редактирования
    } catch (error) {
      console.error('Ошибка обновления отдела:', error);
    }
  }
};

// Отмена редактирования
const cancelEdit = () => {
  editMode.value = false;
  editedDepartment.value = null;
};

// Удаление отдела
const deleteDepartmentHandler = async (id: string) => {
  try {
    await deleteDepartment(id);
    loadDepartments();  // Обновление списка отделов после удаления
  } catch (error) {
    console.error('Ошибка удаления отдела:', error);
  }
};
</script>
