<template>
  <div class="login-page">
    <h2>Авторизация</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="login">Логин</label>
        <input
          type="text"
          id="login"
          v-model="loginField"
          placeholder="Введите логин"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Пароль</label>
        <input
          type="password"
          id="password"
          v-model="passwordField"
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

<script setup>
import { ref } from 'vue';
import { login } from 'src/auth';
import { getRedirectRoute, setCurrentUser } from 'src/session';
import { useRouter } from 'vue-router';

const loginField = ref('');
const passwordField = ref('');
const isSubmitting = ref(false);
const error = ref(null);
const user = ref(null);

const router = useRouter();

const handleLogin = async () => {
  isSubmitting.value = true;
  error.value = null;

  try {
    const user = await login(loginField.value, passwordField.value);
    setCurrentUser(user);

    const redirect = getRedirectRoute() || { name: 'organizations' };
    router.push(redirect);
  } catch (err) {
    console.error('Ошибка авторизации:', err);
    error.value = 'Неверный логин или пароль';
  } finally {
    isSubmitting.value = false;
  }
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
