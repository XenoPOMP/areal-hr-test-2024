const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { 
        path: '',  // Пустой путь рендерит OrganizationsPage на главной странице
        component: () => import('src/pages/OrganizationsPage.vue'),
      },
      {
        path: '/departments',  // Путь для страницы Departments
        component: () => import('src/pages/DepartmentsPage.vue'),
      },
      {
        path: '/positions',  // Путь для страницы Positions
        component: () => import('src/pages/PositionsPage.vue'),
      },
    ]
  }
];

export default routes;