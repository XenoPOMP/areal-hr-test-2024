import { route } from 'quasar/wrappers';
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { restoreAuthState, setRedirectRoute } from './auth';

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
    console.log('Navigating to:', to.fullPath);
    console.log('Authentication required:', !!to.meta.requiresAuth);

    const isAuthenticated = await restoreAuthState(); // Проверяем сессию
    console.log('User authenticated:', isAuthenticated);

    if (to.meta.requiresAuth && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      setRedirectRoute(to.fullPath);
      next({ name: 'login' });
    } else {
      next(); // Разрешаем переход
    }
  });

  return Router;
});
