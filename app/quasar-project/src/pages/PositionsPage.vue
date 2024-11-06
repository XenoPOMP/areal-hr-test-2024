<template>
    <div>
      <h1>Должности</h1>
      <ul>
        <li v-for="pos in positions" :key="pos.id_position">
          <strong>{{ pos.pos_name }}</strong><br />
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getPositions } from '../api';
  
  export default {
    setup() {
      const positions = ref([]);
  
      onMounted(async () => {
        try {
          const data = await getPositions();
          positions.value = data;
          console.log('Positions:', data);
        } catch (error) {
          console.error('Ошибка загрузки данных должностей:', error);
        }
      });
  
      return { positions };
    },
  };
  </script>