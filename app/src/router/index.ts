import { route } from 'quasar/wrappers';
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';

/*
 * This is where we configure the Vue Router instance.
 * The function below can be async too; either use
 * async/await or return a Promise that resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  // Use 'hash' mode explicitly for debugging purposes
  const createHistory =
    process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory()
      : createWebHashHistory();

  // Debug: log which mode is being used
  console.log('Router mode:', process.env.VUE_ROUTER_MODE || 'hash');

  const Router = createRouter({
    history: createHistory,
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  });

  return Router;
});
