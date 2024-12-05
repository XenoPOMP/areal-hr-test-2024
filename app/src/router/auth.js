let redirectRoute = null; // Храним маршрут для перенаправления после авторизации

export function isAuthenticated() {
  return localStorage.getItem('isLoggedIn') === 'true'; // Проверяем состояние авторизации
}

export function login() {
  localStorage.setItem('isLoggedIn', 'true'); // Устанавливаем флаг авторизации
}

export function logout() {
  localStorage.removeItem('isLoggedIn'); // Удаляем флаг авторизации
}

export function setRedirectRoute(route) {
  redirectRoute = route; // Сохраняем маршрут для перенаправления
}

export function getRedirectRoute() {
  return redirectRoute; // Возвращаем сохранённый маршрут
}
