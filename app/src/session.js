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

// Установить данные текущего пользователя
export function setCurrentUser(user) {
  isUserAuthenticated = true;
  currentUser = user;
}
