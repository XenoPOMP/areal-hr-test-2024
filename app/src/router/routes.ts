import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('src/pages/LoginPage.vue'),
    name: 'login',
  },
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    meta: { requiresAuth: false }, // Проверка авторизации для всех дочерних маршрутов
    children: [
      {
        path: '',
        redirect: { name: 'organizations' }, // Редирект на организации
      },
      {
        path: 'organizations',
        component: () => import('src/pages/OrganizationsPage.vue'),
        name: 'organizations',
        meta: { requiresAuth: true },
      },
      {
        path: 'departments',
        component: () => import('src/pages/DepartmentsPage.vue'),
        name: 'departments',
        meta: { requiresAuth: true },
      },
      {
        path: 'positions',
        component: () => import('src/pages/PositionsPage.vue'),
        name: 'positions',
        meta: { requiresAuth: true },
      },
      {
        path: 'employees',
        component: () => import('src/pages/EmployeesPage.vue'),
        name: 'employees',
        meta: { requiresAuth: true },
      },
      {
        path: 'hr_actions',
        component: () => import('src/pages/HRActionsPage.vue'),
        name: 'hr_actions',
        meta: { requiresAuth: true },
      },
      {
        path: 'history_of_changes',
        component: () => import('src/pages/HistoryOfChangesPage.vue'),
        name: 'history_of_changes',
        meta: { requiresAuth: true },
      },
      {
        path: 'users',
        component: () => import('src/pages/UsersPage.vue'),
        name: 'users',
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)', // Обработка несуществующих маршрутов
    redirect: '/login',
  },
];

export default routes;
