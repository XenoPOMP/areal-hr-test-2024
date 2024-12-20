import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/';

export function useGetEmployee() {
  const employees = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadEmployees = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`${API_URL}employees`);
      employees.value = response.data;
    } catch {
      error.value = 'Не удалось загрузить сотрудников';
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadEmployees);

  return { employees, loading, error, loadEmployees };
}
