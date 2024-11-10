<template>
  <q-header elevated class="header bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title>Управление кадрами</q-toolbar-title>
      <q-tabs
        v-model="currentTab"
        active-color="white"
        indicator-color="accent"
        dense
        transition-prev="scale"
        transition-next="scale"
      >
      <q-tab name="/" label="Организации" @click="goTo('/')" />
      <q-tab name="/departments" label="Отделы" @click="goTo('/departments')" />
      <q-tab name="/positions" label="Должности" @click="goTo('/positions')" />
      </q-tabs>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
</script>

<style scoped>
.header {
  display: flex;
  gap: 20px;
  padding: 10px;
  background-color: #333;
  color: white;
}

.q-tab--active .q-tab__label {
  color: white !important;
}

.q-tab {
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out, margin 0.3s ease-in-out; /* Плавное изменение масштаба, прозрачности и отступов */
}

.q-tab--active {
  transform: scale(1.1);
  opacity: 1;
}

.q-tab:not(.q-tab--active) {
  opacity: 0.6;
  transform: scale(0.95);
}

.q-tabs {
  transition: all 0.4s ease;
}
</style>
