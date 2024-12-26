import { ref } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { userSchema } from 'src/pages/shemas/User.shemas';

export function useCreateUser(loadUsers: () => Promise<void>) {
  const $q = useQuasar();
  const newUser = ref({
    name: '',
    surname: '',
    second_name: '',
    login: '',
    password: '',
    role: '',
  });

  const createUser = async (userData: {
    name: string;
    surname: string;
    second_name: string;
    login: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/users',
        userData
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Ошибка при создании пользователя';
        throw new Error(errorMessage);
      } else {
        throw new Error('Неизвестная ошибка при создании пользователя');
      }
    }
  };

  const createUserHandler = async () => {
    const role = String(newUser.value.role).trim();

    if (!role) {
      $q.notify({
        type: 'negative',
        message: 'Роль обязательна',
      });
      return;
    }

    const userData = {
      name: newUser.value.name,
      surname: newUser.value.surname,
      second_name: newUser.value.second_name,
      login: newUser.value.login,
      password: newUser.value.password,
      role,
    };

    console.log('Данные перед валидацией:', userData);

    if (
      !userData.name ||
      !userData.surname ||
      !userData.login ||
      !userData.password ||
      !userData.role
    ) {
      $q.notify({
        type: 'negative',
        message: 'Все поля должны быть заполнены',
      });
      return;
    }

    try {
      const { error } = userSchema.validate(userData, { abortEarly: false });

      if (error) {
        error.details.forEach((err) =>
          $q.notify({ type: 'negative', message: err.message })
        );
        return;
      }

      await createUser(userData);

      newUser.value = {
        name: '',
        surname: '',
        second_name: '',
        login: '',
        password: '',
        role: '',
      };

      await loadUsers();
      $q.notify({ type: 'positive', message: 'Пользователь успешно добавлен' });
    } catch (err) {
      console.error('Ошибка при добавлении пользователя:', err);
      $q.notify({
        type: 'negative',
        message: 'Ошибка при добавлении пользователя',
      });
    }
  };

  return { newUser, createUserHandler };
}
