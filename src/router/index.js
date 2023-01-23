import Vue from 'vue'
import VueRouter from 'vue-router'
import FormSat from '../components/FormSat.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'FormSat',
    component: FormSat
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
