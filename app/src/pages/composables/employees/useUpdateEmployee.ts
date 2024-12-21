import axios from 'axios';
import { useQuasar } from 'quasar';
import { EmployeeBaseData } from 'src/pages/types/Employee';

export function useUpdateEmployee(getEmployees: () => void) {
  const $q = useQuasar();

  const updateEmployee = async (editedEmployee: EmployeeBaseData) => {
    if (!editedEmployee) return;

    const payload = {
      ...editedEmployee,
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/employees/${editedEmployee.id}`,
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        $q.notify({
          type: 'positive',
          message: 'Данные сотрудника обновлены!',
        });
        getEmployees(); // Обновляем список сотрудников
      }
    } catch (error) {
      console.error('Ошибка при обновлении сотрудника:', error);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при обновлении сотрудника',
      });
    }
  };

  return { updateEmployee };
}
