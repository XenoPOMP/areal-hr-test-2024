import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'src/layouts/MainLayout.vue';
import OrganizationsPage from 'src/pages/OrganizationsPage.vue';
import DepartmentsPage from 'src/pages/DepartmentsPage.vue';
import PositionsPage from 'src/pages/PositionsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: OrganizationsPage, name: 'organizations' }, // Главная страница — Организации
      { path: 'departments', component: DepartmentsPage, name: 'departments' }, // Страница отделов
      { path: 'positions', component: PositionsPage, name: 'positions' }, // Страница должностей
      { path: 'home', component: () => import('pages/IndexPage.vue'), name: 'home' }, // Альтернативная страница для IndexPage
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
