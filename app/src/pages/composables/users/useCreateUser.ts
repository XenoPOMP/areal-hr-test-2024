import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { userSchema } from 'src/pages/shemas/User.shemas';

export const useCreateUser = (loadUsers: () => Promise<void>) => {
  interface UserData {
    id?: number;
    name: string;
    surname: string;
    second_name?: string;
    login: string;
    password: string;
    role?: string;
  }

  const $q = useQuasar();
  const newUser = ref<UserData>({
    name: '',
    surname: '',
    second_name: '',
    login: '',
    password: '',
    role: '',
  });

  const createUserHandler = async () => {
    newUser.value.role = 'hr';

    const { error } = userSchema.validate(newUser.value, {
      abortEarly: false,
    });

    if (error) {
      error.details.forEach((err) =>
        $q.notify({ type: 'negative', message: err.message })
      );
      return;
    }

    try {
      // Шифрование пароля на сервере
      await createUser(newUser.value);

      newUser.value = { name: '', surname: '', login: '', password: '' };
      await loadUsers();
      $q.notify({ type: 'positive', message: 'Пользователь успешно добавлен' });
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: 'Ошибка при добавлении пользователя',
      });
    }
  };

  const createUser = async (userData: UserData) => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          role: 'hr',
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при добавлении пользователя');
      }

      return response.json();
    } catch (error) {
      throw new Error('Ошибка при добавлении пользователя');
    }
  };

  return {
    newUser,
    createUserHandler,
  };
};
