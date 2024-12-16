import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'
import routers from './routers'

export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE),
  routes: routers,
})

router.beforeEach(async (to: any, from: any, next: any) => {
  next()
})
export default router
