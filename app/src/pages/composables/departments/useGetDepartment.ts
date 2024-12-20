import { ref } from 'vue';
import { getDepartments } from 'src/api/departments';

export function useGetDepartments() {
  const departments = ref([]);

  const loadDepartments = async () => {
    try {
      departments.value = await getDepartments();
    } catch (error) {
      console.error('Ошибка загрузки отделов:', error);
    }
  };

  return { departments, loadDepartments };
}
