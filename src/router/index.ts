import { createRouter, createWebHistory } from 'vue-router'
import routers from './routers'

export const router = createRouter({
  history: createWebHistory(),
  routes: routers,
})

router.beforeEach(async (to: any, from: any, next: any) => {
  console.log("to from", to, from)
  next()
})
export default router
