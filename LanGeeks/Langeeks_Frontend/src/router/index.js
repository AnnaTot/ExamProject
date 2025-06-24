import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: MainPage,
    },
    {
      path: '/registerPage',
      name: 'registerPage',
      component: () => import('../views/RegisterPage.vue'),
    },
    {
      path: '/loginPage',
      name: 'loginPage',
      component: () => import('../views/LoginPage.vue'),
    },
    {
      path: '/myPage',
      name: 'myPage',
      component: () => import('../views/MyPage.vue'),
    },
    {
      path: '/searchPage',
      name: 'searchPage',
      component: () => import('../views/SearchPage.vue'),
    },

    {
      path: '/messagePage',
      name: 'messagePage',
      component: () => import('../views/MessagePage.vue'),
    },

    {
      path: '/myGroup',
      name: 'myGroup',
      component: () => import('../views/MyGroupPage.vue'),
    },

    {
      path: '/searchGroupsPage',
      name: 'searchGroupsPage',
      component: () => import('../views/SearchGroupPage.vue'),
    },
  ],
})

export default router
