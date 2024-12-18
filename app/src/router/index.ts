import { route } from 'quasar/wrappers';
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import { restoreAuthState } from 'src/session';
import routes from './routes';
import axios from 'axios';

// Функция проверки авторизации
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function isAuthenticated() {
  try {
    const response = await axios.get('http://localhost:3000/auth/session', {
      withCredentials: true,
    });
    console.log('Authenticated response:', response.data); // Лог для проверки
    return !!response.data.user;
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

  Router.beforeEach(async (to, from, next) => {
    const isAuthenticated = await restoreAuthState();

    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'login' }); // Редирект, если нет авторизации
    } else if (to.name === 'login' && isAuthenticated) {
      next({ name: 'organizations' }); // Редирект на основную страницу, если уже авторизован
    } else {
      next(); // Разрешаем переход
    }
  });

  return Router;
});
