let isUserAuthenticated = false;
let currentUser = null; // Глобальная переменная для данных пользователя
let redirectRoute = null;

// Получить текущего пользователя
export function getCurrentUser() {
  return currentUser;
}

// Проверить, авторизован ли пользователь
export function isAuthenticated() {
  return isUserAuthenticated;
}

// Сбросить состояние авторизации
export function resetAuth() {
  isUserAuthenticated = false;
  currentUser = null;
  redirectRoute = null;
}

// Установить маршрут для редиректа
export function setRedirectRoute(route) {
  redirectRoute = route;
}

// Получить маршрут для редиректа
export function getRedirectRoute() {
  return redirectRoute;
}

// Восстановить состояние сессии
export async function restoreAuthState() {
  try {
    const data = await fetchAPI('http://localhost:3000/auth/session');
    if (data.user) {
      isUserAuthenticated = true;
      currentUser = data.user;
      console.log('Session restored:', data);
      return true;
    } else {
      console.log('No active session');
      resetAuth();
      return false;
    }
  } catch (error) {
    console.error('Error restoring session:', error);
    resetAuth();
    return false;
  }
}

// Выполнить вход
export async function login(login, password) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  isUserAuthenticated = true;
  currentUser = data.user;
  return data;
}

// Выполнить выход
export async function logout() {
  try {
    const data = await fetchAPI('http://localhost:3000/auth/logout', {
      method: 'POST',
    });
    resetAuth();
    console.log('User logged out:', data);
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

// Общая функция для запросов
async function fetchAPI(url, options = {}) {
  const response = await fetch(url, { ...options, credentials: 'include' });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      resetAuth();
    }
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}
