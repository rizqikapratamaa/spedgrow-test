import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ExpensesView from '../views/ExpensesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: ExpensesView,

      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token');
        if (token) {
          next();
        } else {
          next('/login');
        }
      }
    },

    {
      path: '/',
      redirect: () => {
        return localStorage.getItem('token') ? '/expenses' : '/login';
      }
    }
  ]
})

export default router