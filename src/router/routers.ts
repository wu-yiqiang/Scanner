const routers = [
  {
    path: '/',
    redirect: `/scanner`,
    meta: {
      nameId: 'home',
    },
  },
  {
    path: '/scanner',
    component: () => import('@/pages/scanner/index.vue'),
    meta: {
      nameId: 'scanner',
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
