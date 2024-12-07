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

      <button type="submit" :disabled="isSubmitting">Войти</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="user" class="success">Добро пожаловать, {{ user.login }}!</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      login: '', // Логин пользователя
      password: '', // Пароль пользователя
      isSubmitting: false, // Флаг для блокировки кнопки отправки при отправке формы
      user: null, // Данные пользователя после успешной авторизации
      error: null, // Сообщение об ошибке
    };
  },
  methods: {
    // Метод для отправки формы авторизации
    handleLogin() {
      this.isSubmitting = true; // Включаем индикатор отправки
      this.error = null; // Сбрасываем ошибку

      axios
        .post(
          'http://localhost:3000/auth/login',
          {
            login: this.login,
            password: this.password,
          },
          { withCredentials: true } // Убедитесь, что добавили this в запрос
        )
        .then((response) => {
          this.isSubmitting = false; // Выключаем индикатор отправки

          // Если авторизация успешна, сохраняем данные пользователя
          this.user = response.data.user;
          this.login = ''; // Очищаем поля логина и пароля
          this.password = '';
        })
        .catch((error) => {
          this.isSubmitting = false; // Выключаем индикатор отправки
          console.error('Ошибка при авторизации:', error);
          this.error = 'Неверный логин или пароль'; // Показываем ошибку
        });
    },
    // Проверка сессии пользователя при загрузке страницы
    checkSession() {
      axios
        .get('http://localhost:3000/auth/session', { withCredentials: true })
        .then((response) => {
          if (response.data.user) {
            this.user = response.data.user; // Устанавливаем данные пользователя
          }
        })
        .catch((error) => {
          console.error('Ошибка при проверке сессии:', error);
          this.error = 'Не удалось проверить сессию'; // В случае ошибки
        });
    },
  },
  created() {
    this.checkSession(); // Проверяем сессию при загрузке компонента
  },
};
</script>

<style scoped>
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

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>
