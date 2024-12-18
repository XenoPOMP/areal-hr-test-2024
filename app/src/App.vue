<script setup lang="ts">
import { restoreAuthState } from './session';
import { useRouter } from 'vue-router';

const router = useRouter();

restoreAuthState().then((isAuthenticated) => {
  if (!isAuthenticated) {
    router.push({ name: 'login' }); // Перенаправляем на логин, если пользователь не авторизован
  }
});
</script>
<template>
  <router-view />
</template>
