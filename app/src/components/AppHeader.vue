<template>
  <q-header elevated class="header bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title>Управление кадрами</q-toolbar-title>
      <q-tabs
        v-model="currentTab"
        active-color="white"
        indicator-color="white"
        dense
        transition-prev="scale"
        transition-next="scale"
      >
        <!-- Для admin показываем только вкладку "Пользователи" -->
        <q-tab
          v-if="isAdmin"
          name="/users"
          label="Пользователи"
          @click="goTo('/users')"
        />

        <!-- Для hr показываем все вкладки, кроме "Пользователи" -->
        <q-tab v-if="isHr" name="/" label="Организации" @click="goTo('/')" />
        <q-tab
          v-if="isHr"
          name="/departments"
          label="Отделы"
          @click="goTo('/departments')"
        />
        <q-tab
          v-if="isHr"
          name="/positions"
          label="Должности"
          @click="goTo('/positions')"
        />
        <q-tab
          v-if="isHr"
          name="/employees"
          label="Сотрудники"
          @click="goTo('/employees')"
        />
        <q-tab
          v-if="isHr"
          name="/hr_actions"
          label="Кадровые операции"
          @click="goTo('/hr_actions')"
        />
        <q-tab
          v-if="isHr"
          name="/history_of_changes"
          label="История изменений"
          @click="goTo('/history_of_changes')"
        />
      </q-tabs>
      <!-- Кнопка "Выйти" -->
      <q-btn
        flat
        label="Выйти"
        icon="logout"
        color="white"
        @click="handleLogout"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from 'src/auth';
import { restoreAuthState, getCurrentUser } from 'src/session'; // Импортируем функции из session.js

// Состояние текущего таба
const currentTab = ref('/');

// Получаем данные о пользователе
const user = getCurrentUser();

// Определяем, является ли пользователь администратором
const isAdmin = computed(() => user?.role === 'admin');

// Определяем, является ли пользователь HR
const isHr = computed(() => user?.role === 'hr');

const router = useRouter();

// Восстанавливаем состояние сессии и перенаправляем в зависимости от роли пользователя
onMounted(async () => {
  const isAuthenticated = await restoreAuthState(); // Восстановление состояния сессии
  if (isAuthenticated && user) {
    // Проверяем, был ли уже выполнен редирект для роли
    const hasRedirected = sessionStorage.getItem('hasRedirected') === 'true';

    if (!hasRedirected) {
      // Если редирект не выполнен, перенаправляем и устанавливаем флаг
      sessionStorage.setItem('hasRedirected', 'true');

      if (user.role === 'admin') {
        router.push('/users'); // Страница "Пользователи" для админа
      } else if (user.role === 'hr') {
        router.push('/'); // Страница "Организации" для hr
      }
    }
  }
});

// Переход по вкладкам
const goTo = (path: string) => {
  router.push({ path });
};

// Функция выхода из системы
const handleLogout = () => {
  logout();
  sessionStorage.removeItem('hasRedirected'); // Сбрасываем флаг при выходе
  router.push('/login');
};
</script>

<style scoped>
.header {
  display: flex;
  gap: 20px;
  padding: 10px;
  background-color: #333;
  color: white;
}
</style>
