import { ref } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { userSchema } from 'src/pages/shemas/User.shemas';
import { User } from 'src/pages/types/User';

export function useUpdateUser(loadUsers: () => Promise<void>) {
  const $q = useQuasar();
  const editedUser = ref<User | null>(null);
  const editMode = ref(false);

  const updateUser = async (
    userId: number,
    userData: {
      name: string;
      surname: string;
      second_name: string;
      login: string;
      password?: string;
      role: string;
    }
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}`,
        userData
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Ошибка при обновлении пользователя';
        throw new Error(errorMessage);
      } else {
        throw new Error('Неизвестная ошибка при обновлении пользователя');
      }
    }
  };

  const startEditingUser = (user: User) => {
    editedUser.value = { ...user };
    editMode.value = true;
  };

  const cancelEdit = () => {
    editedUser.value = null;
    editMode.value = false;
  };

  const updateUserHandler = async () => {
    if (!editedUser.value) return;

    const userData = {
      name: editedUser.value.name,
      surname: editedUser.value.surname,
      second_name: editedUser.value.second_name,
      login: editedUser.value.login,
      password: editedUser.value.password,
      role: editedUser.value.role,
    };

    const { error } = userSchema.validate(userData, { abortEarly: false });

    if (error) {
      error.details.forEach((err) =>
        $q.notify({ type: 'negative', message: err.message })
      );
      return;
    }

    try {
      await updateUser(editedUser.value.id, userData);
      await loadUsers();
      cancelEdit();
      $q.notify({ type: 'positive', message: 'Пользователь успешно обновлен' });
    } catch (err: unknown) {
      let errorMessage = 'Ошибка при обновлении пользователя';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response?.data?.message;
      }
      console.error('Ошибка обновления пользователя:', err);
      $q.notify({
        type: 'negative',
        message: errorMessage,
      });
    }
  };

  return {
    editMode,
    editedUser,
    startEditingUser,
    cancelEdit,
    updateUserHandler,
  };
}
