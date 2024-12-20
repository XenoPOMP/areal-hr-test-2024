import axios from 'axios';
import { useQuasar } from 'quasar';
import { getSessionUserId } from 'src/useSession';

export const useDeleteEmployee = (refreshEmployees: () => Promise<void>) => {
  const $q = useQuasar();

  const deleteEmployee = async (employeeId: number) => {
    const userId = await getSessionUserId(); // Получение ID пользователя из сессии
    if (!userId) {
      $q.notify({
        type: 'negative',
        message: 'Не удалось определить текущего пользователя',
      });
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/employees/${employeeId}/soft-delete`,
        { userId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        $q.notify({ type: 'positive', message: 'Сотрудник успешно удален' });
        await refreshEmployees(); // Обновляем список сотрудников
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
};
