import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { userSchema } from 'src/pages/shemas/User.shemas';

interface UserData {
  id?: number;
  name: string;
  surname: string;
  second_name: string;
  login: string;
  password: string;
  role?: string;
}

export const useUpdateUser = (loadUsers: () => Promise<void>) => {
  const $q = useQuasar();

  const editedUser = ref<UserData | null>(null);

  const startEditingUser = (user: UserData) => {
    editedUser.value = { ...user };
  };

  const cancelEdit = () => {
    editedUser.value = null;
  };

  const updateUserHandler = async () => {
    if (!editedUser.value) return;

    editedUser.value.role = editedUser.value.role || 'hr';

    const { error } = userSchema.validate(editedUser.value, {
      abortEarly: false,
    });

    if (error) {
      error.details.forEach((err) =>
        $q.notify({ type: 'negative', message: err.message })
      );
      return;
    }

    try {
      const userDataToUpdate = { ...editedUser.value };

      await updateUser(userDataToUpdate);
      editedUser.value = null;
      await loadUsers();
      $q.notify({ type: 'positive', message: 'Пользователь успешно обновлен' });
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: 'Ошибка при обновлении пользователя',
      });
    }
  };

  const updateUser = async (userData: UserData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${userData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        throw new Error('Ошибка при обновлении пользователя');
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
      throw error;
    }
  };

  return {
    editedUser,
    startEditingUser,
    cancelEdit,
    updateUserHandler,
  };
};
