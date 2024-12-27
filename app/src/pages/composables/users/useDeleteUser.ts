import { useQuasar } from 'quasar';

export const useDeleteUser = (loadUsers: () => Promise<void>) => {
  const $q = useQuasar();

  const deleteUserHandler = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении пользователя');
      }

      await loadUsers();

      $q.notify({
        type: 'positive',
        message: 'Пользователь успешно удалён',
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Ошибка при удалении пользователя',
      });

      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  return {
    deleteUserHandler,
  };
};
