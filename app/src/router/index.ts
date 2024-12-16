import { route } from 'quasar/wrappers';
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import axios from 'axios';

// Функция проверки авторизации
async function isAuthenticated() {
  try {
    const response = await axios.get('http://localhost:3000/auth/session', {
      withCredentials: true,
    });
    console.log('Authenticated response:', response.data); // Добавьте лог для проверки
    return !!response.data.user; // Убедитесь, что возвращается логическое значение
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error);
    return false;
  }
}

export default route(async function () {
  const createHistory =
    process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory()
      : createWebHashHistory();

  const Router = createRouter({
    history: createHistory,
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  });

  // Глобальный перехватчик маршрутов
  Router.beforeEach(async (to, from, next) => {
    console.log('Navigating to:', to.path); // Логируем маршрут

    if (to.meta.requiresAuth) {
      const authenticated = await isAuthenticated();
      console.log('Is authenticated:', authenticated);

      if (!authenticated) {
        console.log('Redirecting to login');
        return next('/login');
      }
    }

    next(); // Переход разрешен
  });

  return Router;
});
