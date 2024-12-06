let isUserAuthenticated = false; // Глобальная переменная для состояния авторизации
let redirectRoute = null; // Глобальная переменная для хранения маршрута для редиректа

// Функция для восстановления состояния авторизации
export async function restoreAuthState() {
  try {
    const response = await fetch('/session', {
      credentials: 'include', // Передача cookie для сессий
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Session restored:', data);
      isUserAuthenticated = true; // Устанавливаем флаг авторизации в true
      return true; // Пользователь авторизован
    } else {
      console.log('No active session');
      isUserAuthenticated = false; // Устанавливаем флаг авторизации в false
      return false; // Нет активной сессии
    }
  } catch (error) {
    console.error('Error restoring session:', error);
    isUserAuthenticated = false; // Устанавливаем флаг авторизации в false
    return false; // Ошибка при восстановлении
  }
}

// Функция для установки маршрута для редиректа
export function setRedirectRoute(route) {
  redirectRoute = route;
}

// Функция для получения маршрута редиректа
export function getRedirectRoute() {
  return redirectRoute;
}

// Функция для выполнения входа
export async function login(credentials) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', // Включаем cookie для сессии
    });

    if (response.ok) {
      const data = await response.json();
      console.log('User logged in:', data);
      isUserAuthenticated = true; // Устанавливаем флаг авторизации в true
      return data; // Возвращаем данные пользователя
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

// Функция для выполнения выхода
export async function logout() {
  try {
    const response = await fetch('/logout', {
      method: 'POST',
      credentials: 'include', // Передача cookie для сессий
    });

    if (response.ok) {
      console.log('User logged out');
      isUserAuthenticated = false; // Устанавливаем флаг авторизации в false
    } else {
      console.error('Error during logout');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

// Функция для сброса состояния авторизации
export function resetAuth() {
  isUserAuthenticated = false; // Сбрасываем состояние авторизации
  redirectRoute = null; // Сбрасываем редирект
}

// Функция для проверки текущего состояния авторизации
export function isAuthenticated() {
  return isUserAuthenticated; // Возвращаем текущее состояние авторизации
}
