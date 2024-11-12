import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'src/layouts/MainLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: () => import('src/pages/OrganizationsPage.vue'), name: 'organizations' }, // Главная страница — Организации
      { path: 'departments', component: () => import('src/pages/DepartmentsPage.vue'), name: 'departments' }, // Страница отделов
      { path: 'positions', component: () => import('src/pages/PositionsPage.vue'), name: 'positions' }, // Страница должностей
      { path: 'employees', component: () => import('src/pages/EmployeesPage.vue'), name: 'employees' }, // Страница сотрудников
      { path: 'files', component: () => import('src/pages/FilesPage.vue'), name: 'files' }, // Страница файлов
      { path: 'hr_actions', component: () => import('src/pages/HRActionsPage.vue'), name: 'hr_actions' }, // Страница кадровых операций
      { path: 'history_of_changes', component: () => import('src/pages/HistoryOfChangesPage.vue'), name: 'history_of_changes' }, // Страница истории изменений
      { path: 'home', component: () => import('src/pages/IndexPage.vue'), name: 'home' }, // Альтернативная страница для IndexPage
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
