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
        <q-tab name="/" label="Организации" @click="goTo('/')" />
        <q-tab
          name="/departments"
          label="Отделы"
          @click="goTo('/departments')"
        />
        <q-tab
          name="/positions"
          label="Должности"
          @click="goTo('/positions')"
        />
        <q-tab
          name="/employees"
          label="Сотрудники"
          @click="goTo('/employees')"
        />
        <q-tab name="/files" label="Файлы" @click="goTo('/files')" />
        <q-tab
          name="/hr_actions"
          label="Кадровые операции"
          @click="goTo('/hr_actions')"
        />
        <q-tab
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
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { logout } from 'src/auth';

const router = useRouter();
const route = useRoute();
const currentTab = ref('/');

watch(
  () => route.path,
  (newPath) => {
    currentTab.value = newPath === '/' ? '/' : newPath;
  },
  { immediate: true }
);

const goTo = (path: string) => {
  router.push({ path });
};

const handleLogout = () => {
  logout();
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
