import { useQuasar } from 'quasar';
import axios from 'axios';

export const useDeletehrActions = () => {
  const $q = useQuasar();

  const deleteActionHandler = async (hrId: number) => {
    try {
      await axios.patch(
        `http://localhost:3000/hr_actions/${hrId}/soft-delete`,
        {},
        { withCredentials: true }
      );
      $q.notify({ type: 'positive', message: 'Действие успешно удалено' });
    } catch (error) {
      console.error('Ошибка удаления действия:', error);
      $q.notify({ type: 'negative', message: 'Ошибка при удалении действия' });
    }
  };

  return {
    deleteActionHandler,
  };
};
