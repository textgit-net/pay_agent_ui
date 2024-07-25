import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('~/layouts/index.vue')

export default [
  {
    path: '/login',
    component: () => import('~/pages/common/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path:'/page/designer',
    component:()=>import('~/pages/designer/index.vue'),
    meta: {
      title: '设计器',
    },
  },
  {
    path: '/media/union/mediationCodeCreate',
    name: 'MediationCodeCreate',
    component: () => import('~/pages/mediation/unitCode/mediation-code-create.vue'),
    meta: {
      hideInMenu: true,
      hideInBreadcrumb:true
    },
    children: [],
  },
  {
    path: '/401',
    name: 'Error401',
    component: () => import('~/pages/exception/401.vue'),
    meta: {
      title: '授权已过期',
    },
  },
  {
    path: '/common',
    name: 'LayoutBasicRedirect',
    component: Layout,
    redirect: '/common/redirect',
    children: [
      {
        path: '/common/redirect',
        component: () => import('~/pages/common/route-view.vue'),
        name: 'CommonRedirect',
        redirect: '/redirect',
        children: [
          {
            path: '/redirect/:path(.*)',
            name: 'RedirectPath',
            component: () => import('~/pages/common/redirect.vue'),
          },
        ],
      },

    ],
  },
  {
    path: '/:pathMatch(.*)',
    meta: {
      title: '找不到页面',
    },
    component: () => import('~/pages/exception/error.vue'),
  },
] as RouteRecordRaw[]
