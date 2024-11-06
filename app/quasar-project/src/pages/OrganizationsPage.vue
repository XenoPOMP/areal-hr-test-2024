<template>
  <div>
    <h1>Организации</h1>
    <ul>
      <li v-for="org in organizations" :key="org.id_organisation">
        <strong>{{ org.org_name }}</strong><br />
        <em>{{ org.org_comment }}</em>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getOrganizations } from '../api';

export default {
  setup() {
    const organizations = ref([]);

    onMounted(async () => {
      try {
        const data = await getOrganizations();
        organizations.value = data;
        console.log('Organizations:', data);
      } catch (error) {
        console.error('Ошибка загрузки данных организаций:', error);
      }
    });

    return { organizations };
  },
};
</script>