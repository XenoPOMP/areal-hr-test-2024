import { RouteRecordRaw } from 'vue-router';
import { isAuthenticated } from './auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('src/pages/LoginPage.vue'),
    name: 'login',
  },
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    redirect: (to) => {
      return isAuthenticated() ? '/organizations' : '/login';
    },
    children: [
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
        path: 'files',
        component: () => import('src/pages/FilesPage.vue'),
        name: 'files',
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
    ],
  },
];

export default routes;
