import Vue from 'vue'
import VueRouter from 'vue-router'
import TablasMain from '../components/TablasMain.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'TablasMain',
    component: TablasMain
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
