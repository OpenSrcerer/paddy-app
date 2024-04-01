import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/login/LoginPage.vue') },
      { path: 'signup', component: () => import('pages/signup/SignupPage.vue') },
      { path: 'home', component: () => import('pages/home/HomePage.vue') },
      { path: 'daemon/:id', component: () => import('pages/daemon/DaemonPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
