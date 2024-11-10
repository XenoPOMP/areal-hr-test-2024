<template>
  <q-layout view="hHh lpR fFf">
    <!-- Включаем шапку через AppHeader -->
    <AppHeader />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppHeader from 'components/AppHeader.vue';
</script>
