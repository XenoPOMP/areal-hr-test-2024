<template>
  <div class="login-page">
    <h2>Авторизация</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="login">Логин</label>
        <input
          type="text"
          id="login"
          v-model="login"
          placeholder="Введите логин"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Пароль</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Введите пароль"
          required
        />
      </div>

      <button type="submit">Войти</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { login as authLogin, getRedirectRoute } from 'src/router/auth';

export default {
  name: 'LoginPage',
  setup() {
    const login = ref(''); // Переименовано на username
    const password = ref('');
    const error = ref(null);
    const router = useRouter();

    const handleLogin = async () => {
      try {
        error.value = null;

        const response = await axios.post('http://localhost:3000/auth/login', {
          login: login.value,
          password: password.value,
        });

        console.log('Login response:', response.data);

        if (response.data && response.data.user) {
          console.log('Successful login');
          authLogin();
          const redirectRoute = getRedirectRoute() || '/organizations';
          console.log('Redirecting to:', redirectRoute);
          router.push(redirectRoute);
        } else {
          console.log('Invalid credentials');
          error.value = 'Неверный логин или пароль.';
        }
      } catch (err) {
        console.error('Login error:', err);
        // Теперь ошибка в response data может содержать поле message
        error.value =
          err.response?.data?.message ||
          'Ошибка авторизации. Попробуйте ещё раз.';
      }
    };

    return { login, password, error, handleLogin };
  },
};
</script>

<style>
.login-page {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
