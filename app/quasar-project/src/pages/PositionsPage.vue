<template>
  <div>
    <h1>Должности</h1>

    <!-- Форма для добавления новой должности -->
    <form @submit.prevent="createPositionHandler">
      <input v-model="newPosition.pos_name" placeholder="Название должности" required />
      <button type="submit">Добавить</button>
    </form>

    <!-- Список должностей с кнопками редактирования и удаления -->
    <ul>
      <li v-for="position in positions" :key="position.id">
        <strong>{{ position.pos_name }}</strong>
        <button @click="startEditingPosition(position)">Изменить</button>
        <button @click="deletePositionHandler(position.id)">Удалить</button>
      </li>
    </ul>

    <!-- Форма редактирования должности -->
    <div v-if="editMode && editedPosition">
      <h3>Изменить должность</h3>
      <form @submit.prevent="updatePositionHandler">
        <input v-model="editedPosition.pos_name" placeholder="Название должности" required />
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
  pos_name: string;
}

// Состояния для должностей, новой должности и редактируемой должности
const positions = ref<Position[]>([]);
const newPosition = ref<{ pos_name: string }>({ pos_name: '' });
const editMode = ref(false);  // Режим редактирования
const editedPosition = ref<Position | null>(null);  // Текущая редактируемая должность

// Загрузка списка должностей
const loadPositions = async () => {
  try {
    positions.value = await getPositions();
  } catch (error) {
    console.error('Ошибка загрузки должностей:', error);
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadPositions();
});

// Обработчик создания новой должности
const createPositionHandler = async () => {
  try {
    await createPosition({
      pos_name: newPosition.value.pos_name,
    });
    newPosition.value = { pos_name: '' };  // Очистка формы
    loadPositions();  // Обновление списка должностей
  } catch (error) {
    console.error('Ошибка добавления должности:', error);
  }
};

// Обработчик начала редактирования
const startEditingPosition = (position: Position) => {
  editedPosition.value = { ...position };  // Копируем данные должности для редактирования
  editMode.value = true;  // Включаем режим редактирования
};

// Обработчик обновления должности
const updatePositionHandler = async () => {
  if (editedPosition.value) {
    try {
      await updatePosition(editedPosition.value.id, {
        pos_name: editedPosition.value.pos_name,
      });
      await loadPositions();  // Перезагрузка списка должностей
      cancelEdit();  // Завершение режима редактирования
    } catch (error) {
      console.error('Ошибка обновления должности:', error);
    }
  }
};

// Отмена редактирования
const cancelEdit = () => {
  editMode.value = false;
  editedPosition.value = null;
};

// Удаление должности
const deletePositionHandler = async (id: string) => {
  try {
    await deletePosition(id);
    loadPositions();  // Обновление списка должностей после удаления
  } catch (error) {
    console.error('Ошибка удаления должности:', error);
  }
};
</script>
