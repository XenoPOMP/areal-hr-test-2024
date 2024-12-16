<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

// Имя компонента
defineOptions({
  name: 'App',
});

// Логика для периодической загрузки логов
onMounted(() => {
  setInterval(async () => {
    try {
      const response = await fetch('/logs');
      const logs = await response.text();
      console.log('Backend logs:', logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }, 5000);
});
</script>
