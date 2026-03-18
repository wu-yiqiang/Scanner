const routers = [
  {
    path: '/',
    redirect: `/scanCode`,
    meta: {
      nameId: 'home',
    },
  },
  {
    path: '/scanCode',
    component: () => import('@/pages/scancode/index.vue'),
    meta: {
      nameId: 'ScanCode',
    },
  },
  {
    path: '/qrcode',
    component: () => import('@/pages/qrcode/index.vue'),
    meta: {
      nameId: 'qrcode',
    },
  },
]

export default routers
