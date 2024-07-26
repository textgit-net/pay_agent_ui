import type { RouteRecordRaw } from 'vue-router'
import { basicRouteMap } from './router-modules'
import path from 'path'

export const ROOT_ROUTE_REDIRECT_PATH = '/dashboard'
const Layout = () => import('~/layouts/index.vue')

export const rootRoute: RouteRecordRaw = {
  path: '/',
  name: 'rootPath',
  redirect: ROOT_ROUTE_REDIRECT_PATH,
  component: Layout,
  children: []
}

export default [
  {
    path: '/dashboard',
    redirect: '/dashboard/analysis',
    name: 'DashboardFilled',
    meta: {
      title: '仪表盘',
      icon: 'DashboardOutlined'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/dashboard/analysis',
        name: 'DashboardAnalysis',
        component: () => import('~/pages/dashboard/analysis/index.vue'),
        meta: {
          title: '分析页'
        }
      }
    ]
  },
  {
    name: '渠道管理',
    path: '/channel',
    meta: {
      title: '渠道管理',
      icon: 'RobotFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/channel/list',
        name: 'ChannelList',
        component: () => import('~/pages/channel/index.vue'),
        meta: {
          title: '渠道列表',
          hideChildrenInMenu: true
        }
      }
    ]
  },
  {
    name: '商户管理',
    path: '/mch',
    meta: {
      title: '商户管理',
      icon: 'RobotFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/mch/list',
        name: 'MchList',
        component: () => import('~/pages/mch/index.vue'),
        meta: {
          title: '渠道列表',
          hideChildrenInMenu: true
        }
      }
    ]
  },
  {
    name: 'system',
    path: '/system',
    meta: {
      title: '系统设置',
      icon: 'RobotFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/system/appBlacklist',
        name: 'AppBlackList',
        component: () => import('~/pages/system/app-blacklist/index.vue'),
        meta: {
          title: '应用黑名单',

          hideChildrenInMenu: true
        }
      }
    ]
  },
  {
    path: '/exception',
    redirect: '/exception/403',
    name: 'Exception',
    meta: {
      title: '异常页',
      icon: 'WarningOutlined',
      hideInMenu: true,
      locale: 'menu.exception'
    },
    children: [
      {
        path: '/exception/403',
        name: 'Exception403',
        component: () => import('~/pages/exception/403.vue'),
        meta: {
          title: '403',
          locale: 'menu.exception.not-permission'
        }
      },
      {
        path: '/exception/404',
        name: 'Exception404',
        component: () => import('~/pages/exception/404.vue'),
        meta: {
          title: '404',
          locale: 'menu.exception.not-find'
        }
      },
      {
        path: '/exception/500',
        name: 'Exception500',
        component: () => import('~/pages/exception/500.vue'),
        meta: {
          title: '500',
          locale: 'menu.exception.server-error'
        }
      }
    ]
  }
] as RouteRecordRaw[]
