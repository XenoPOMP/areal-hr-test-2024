import { useQuasar } from 'quasar';
import axios from 'axios';

export function useDeletePosition(loadPositions: () => Promise<void>) {
  const $q = useQuasar();

  const deletePositionHandler = async (posId: number) => {
    try {
      await axios.patch(
        `http://localhost:3000/positions/${posId}/soft-delete`,
        {},
        { withCredentials: true }
      );
      await loadPositions();
      $q.notify({ type: 'positive', message: 'Должность успешно удалена' });
    } catch (err) {
      console.error('Ошибка удаления должности:', err);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при удалении должности',
      });
    }
  };

  return { deletePositionHandler };
}
