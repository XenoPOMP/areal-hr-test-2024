<template>
  <div>
    <h1>Организации</h1>
    <ul>
      <li v-for="org in organizations" :key="org.id_organisation">{{ org.org_name }}</li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getOrganizations } from '../api'; // Импортируйте функцию для получения данных

export default {
  setup() {
    const organizations = ref([]);

    onMounted(async () => {
      organizations.value = await getOrganizations();
      console.log('Fetched organizations:', organizations.value); // Проверка полученных данных
    });

    return { organizations };
  },
};
</script>