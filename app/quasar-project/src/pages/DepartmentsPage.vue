<template>
    <div>
      <h1>Отделы</h1>
      <ul>
        <li v-for="dept in departments" :key="dept.id_department">
          <strong>{{ dept.dep_name }}</strong><br />
          <em>{{ dept.dep_comment }}</em>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getDepartments } from '../api';
  
  export default {
    setup() {
      const departments = ref([]);
  
      onMounted(async () => {
        try {
          const data = await getDepartments();
          departments.value = data;
          console.log('Departments:', data);
        } catch (error) {
          console.error('Ошибка загрузки данных отделов:', error);
        }
      });
  
      return { departments };
    },
  };
  </script>