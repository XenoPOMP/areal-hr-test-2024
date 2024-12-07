let isUserAuthenticated = false; // Глобальная переменная для состояния авторизации
let redirectRoute = null; // Глобальная переменная для хранения маршрута для редиректа

// Функция для восстановления состояния авторизации
export async function restoreAuthState() {
  try {
    const response = await fetch('http://localhost:3000/auth/session', {
      credentials: 'include',
    });

    if (response.status === 401) {
      console.log('No active session (401)');
      isUserAuthenticated = false;
      return false; // Нет активной сессии
    }

    const data = await response.json();
    console.log('Session response:', data);

    if (response.ok) {
      if (data.message === 'Not authenticated') {
        console.log('No active session');
        isUserAuthenticated = false;
        return false; // Нет активной сессии
      }

      console.log('Session restored:', data);
      isUserAuthenticated = true;
      return true; // Пользователь авторизован
    } else {
      console.log('Error: No active session');
      isUserAuthenticated = false;
      return false;
    }
  } catch (error) {
    console.error('Error restoring session:', error);
    isUserAuthenticated = false;
    return false;
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
export async function login(login, password) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
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
