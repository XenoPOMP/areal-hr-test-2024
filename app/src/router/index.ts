import { route } from 'quasar/wrappers';
import {
  createRouter,
  createWebHistory, // Используем history для чистых URL
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';

export default route(async function () {
  const createHistory =
    process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory() // Режим history
      : createWebHashHistory(); // Если необходимо, можно использовать hash-режим

  const Router = createRouter({
    history: createHistory, // Используем правильный режим
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  });

  return Router;
});
