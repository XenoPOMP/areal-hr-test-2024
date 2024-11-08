<template>
  <div>
    <h1>Должности</h1>

    <!-- Форма для добавления новой должности -->
    <form @submit.prevent="createPositionHandler">
      <input v-model="newPosition.name" placeholder="Название должности" required />
      <button type="submit">Добавить</button>
    </form>

    <!-- Список должностей с кнопками редактирования и удаления -->
    <ul>
      <li v-for="position in positions" :key="position.id">
        <strong>{{ position.name }}</strong>
        <button @click="startEditingPosition(position)">Изменить</button>
        <button @click="deletePositionHandler(position.id)">Удалить</button>
      </li>
    </ul>

    <!-- Форма редактирования должности (отображается только при наличии editedPosition) -->
    <div v-if="editMode && editedPosition">
      <h3>Изменить должность</h3>
      <form @submit.prevent="updatePositionHandler">
        <input v-model="editedPosition.name" placeholder="Название должности" required />
        <button type="submit">Изменить</button>
        <button @click="cancelEdit">Отмена</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPositions, createPosition, updatePosition, deletePosition } from 'src/api';

// Интерфейс для должности
interface Position {
  id: string;
  name: string;
}

// Состояния для должности, новой должности и редактируемой должности
const positions = ref<Position[]>([]);
const newPosition = ref<Position>({ id: '', name: ''});
const editMode = ref(false);  // Режим редактирования
const editedPosition = ref<Position | null>(null);  // Текущая редактируемая должность

// Загрузка списка организаций
const loadPositions = async () => {
  try {
    positions.value = await getPositions();
  } catch (error) {
    console.error('Ошибка загрузки должности:', error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadPositions();
});

const createPositionHandler = async () => {
  try {
    await createPosition({
      name: newPosition.value.name.slice(0, 255),
    });
    newPosition.value = { id: '', name: '' };  // Очистка формы
    loadPositions();  // Обновление списка должностей
  } catch (error) {
    console.error('Ошибка добавления должности:', error);
  }
};

const updatePositionHandler = async () => {
  if (editedPosition.value) {
    try {
      await updatePosition(editedPosition.value.id, {
        name: editedPosition.value.name,
      });
      await loadPositions();  // Перезагрузка списка должностей из базы данных
      cancelEdit();
    } catch (error) {
      console.error('Ошибка обновления должности:', error);
    }
  }
};

// Обработчик начала редактирования
const startEditingPosition = (position: Position) => {
  editedPosition.value = { ...position };  // Копируем данные должности для редактирования
  editMode.value = true;  // Включаем режим редактирования
};

// Отмена редактирования
const cancelEdit = () => {
  editMode.value = false;
  editedPosition.value = null;
};

// Удаление организации
const deletePositionHandler = async (id: string) => {
  try {
    await deletePosition(id);
    loadPositions();  // Обновление списка должностей после удаления
  } catch (error) {
    console.error('Ошибка удаления должности:', error);
  }
};
</script>
