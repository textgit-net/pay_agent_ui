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
    name: 'DashboardFilled',
    meta: {
      title: '首页',
      icon: 'DashboardOutlined'
    },
    component: () => import('~/pages/dashboard/analysis/index.vue')
  },
  {
    name: 'ChannelManage',
    path: '/channel',
    meta: {
      title: '渠道管理',
      icon: 'ThunderboltOutlined'
    },
    children: [
      {
        path: '/channel/list',
        name: 'ChannelList',
        component: () => import('~/pages/channel/index.vue'),
        meta: {
          title: '渠道列表',
          hideChildrenInMenu: true
        }
      },
      {
        path: '/channel/edit',
        name: 'ChannelEdit',
        component: () => import('~/pages/channel/edit.vue'),
        meta: {
          title: '渠道编辑',
          hideInMenu: true,
          hideChildrenInMenu: true
        }
      },
      {
        path: '/channel/test',
        name: 'ChannelTest',
        component: () => import('~/pages/channel/test.vue'),
        meta: {
          title: '渠道测式',
        }
      }
    ]
  },
  {
    path:"/order",
    name: 'OrderManage',
    meta: {
      title: '订单管理',
      icon: 'PayCircleOutlined'
    },
    children: [

      {
        path: '/order/list',
        name: 'OrderList',
        component: () => import('~/pages/order/index.vue'),
        meta: {
          title: '订单列表',
          hideChildrenInMenu: true
        }
      },
      {
        path: '/order/royalty',
        name: 'OrderRoyalty',
        component: () => import('~/pages/system/domain/list.vue'),
        meta: {
          title: '分账单',
          hideChildrenInMenu: true
        }
      }
    ]
  },
  {
    name: 'AccountManage',
    path: '/account',
    meta: {
      title: '账户信息',
      icon: 'UserOutlined'
    },
    children: [
      {
        path: '/account/role',
        name: 'AccountRoleManage',
        meta: {
          title: '账户权限'
        },
        children: [
          {
            path: '/system/role/staff',
            name: 'AccountStaffManage',
            component: () => import('~/pages/account/staff/list.vue'),
            meta: {
              title: '人员管理',
            }
          },
          {
            path: '/system/role/list',
            name: 'RolePermission',
            component: () => import('~/pages/account/role/list.vue'),
            meta: {
              title: '角色权限',
            }
          }
        ]
      },
      {
        path: '/account/accountInfo',
        name: 'AccountInfo',
        component: () => import('~/pages/account/account-info.vue'),
        meta: {
          title: '账号管理',
        }
      },

    ]
  },
  {
    name: 'Report',
    path: '/report',
    meta: {
      title: '报表中心',
      icon: 'BarChartOutlined'
    },
    children: [
      {
        path: '/report/order',
        name: 'OrderReport',
        component: () => import('~/pages/report/order/index.vue'),
        meta: {
          title: '订单报表',
          hideChildrenInMenu: true
        }
      },

      {
        path: '/report/channel',
        name: 'ChannelReport',
        component: () => import('~/pages/report/channel/index.vue'),
        meta: {
          title: '渠道报表',
          hideChildrenInMenu: true
        }
      },

      // {
      //   path: '/report/hour',
      //   name: 'HourReport',
      //   component: () => import('~/pages/report/hour/index.vue'),
      //   meta: {
      //     title: '分小时报表',
      //     hideChildrenInMenu: true
      //   }
      // }
    ]
  },
  {
    name: 'System',
    path: '/system',
    meta: {
      title: '系统设置',
      icon: 'RobotFilled'
    },
    children: [
      {
        path: '/system/log',
        name: 'SystemLog',
        component: () => import('~/pages/system/log/index.vue'),
        meta: {
          title: '操作日志',
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
