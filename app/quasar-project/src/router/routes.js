const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { 
        path: 'organizations',
        component: () => import('src/pages/OrganizationsPage.vue'),
      },
      // другие маршруты
    ]
  }
];

export default routes;