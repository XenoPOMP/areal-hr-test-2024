import axios from 'axios';
import { useQuasar } from 'quasar';
import { getSessionUserId } from 'src/useSession';

export function useDeleteEmployee(getEmployees: () => void) {
  const $q = useQuasar();

  const deleteEmployee = async (employeeId: number) => {
    const userId = await getSessionUserId();
    if (!userId) return;

    try {
      const response = await axios.patch(
        `http://localhost:3000/employees/${employeeId}/soft-delete`,
        { userId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        $q.notify({ type: 'positive', message: 'Сотрудник успешно удален' });
        getEmployees(); // Обновляем список сотрудников
      } else {
        throw new Error('Не удалось удалить сотрудника');
      }
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при удалении сотрудника',
      });
    }
  };

  return { deleteEmployee };
}
