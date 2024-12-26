import { useQuasar } from 'quasar';
import axios from 'axios';

export function useDeleteUser(loadUsers: () => Promise<void>) {
  const $q = useQuasar();

  const deleteUserHandler = async (userId: number) => {
    try {
      await axios.patch(
        `http://localhost:3000/users/${userId}/soft-delete`,
        {},
        { withCredentials: true }
      );
      await loadUsers();
      $q.notify({ type: 'positive', message: 'Пользователь успешно удален' });
    } catch (err) {
      console.error('Ошибка удаления пользователя:', err);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при удалении пользователя',
      });
    }
  };

  return { deleteUserHandler };
}
