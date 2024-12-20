import axios from 'axios';
import { useQuasar } from 'quasar';

export function useDeleteDepartment(loadDepartments: () => Promise<void>) {
  const $q = useQuasar();

  const deleteDepartment = async (departmentId: string) => {
    try {
      const { data: session } = await axios.get(
        'http://localhost:3000/auth/session',
        { withCredentials: true }
      );

      if (!session.user || !session.user.id) {
        console.error('Сессия пользователя недействительна');
        $q.notify({ type: 'negative', message: 'Сессия недействительна' });
        return;
      }

      await axios.patch(
        `http://localhost:3000/departments/${departmentId}/soft-delete`,
        {},
        { withCredentials: true }
      );

      await loadDepartments();
      $q.notify({
        type: 'positive',
        message: 'Отдел успешно удален',
      });
    } catch (error) {
      console.error('Ошибка при удалении отдела:', error);
      $q.notify({ type: 'negative', message: 'Ошибка при удалении отдела' });
    }
  };

  return { deleteDepartment };
}
