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
    name: 'info',
    path: '/info',
    meta: {
      title: '个人信息',
      icon: 'TeamOutlined'
    },
    redirect: '/info/base',
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/info/base',
        name: 'InfoBase',

        component: () => import('~/pages/account/center/basicInfo.vue'),
        meta: {
          title: '基础信息',
          hideChildrenInMenu: true
        }
      },
      {
        path: '/info/product',
        name: 'InfoProduct',

        component: () => import('~/pages/account/center/ratesConfig.vue'),
        meta: {
          title: '支付产品',
          hideChildrenInMenu: true
        }
      },
    ]
  },

  {
    name: 'AgentManage',
    path: '/agent',
    meta: {
      title: '代理管理',
      icon: 'TeamOutlined'
    },
    redirect: '/agent/list',
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/agent/list',
        name: 'AgentList',

        component: () => import('~/pages/agent/list.vue'),
        meta: {
          title: '代理列表',
          hideChildrenInMenu: true
        }
      },
      {
        path: '/agent/edit',
        name: 'AgentEdit',
        component: () => import('~/pages/agent/edit.vue'),
        meta: {
          title: '代理商户',
          hideInMenu:true
        }
      },
      {
        path: '/agent/info',
        name: 'AgentInfo',
        component: () => import('~/pages/agent/info.vue'),
        meta: {
          title: '代理商',
          hideInMenu:true
        }
      }
    ]
  },

  {
    name: 'MchManage',
    path: '/mch',
    meta: {
      title: '商户管理',
      icon: 'TeamOutlined'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/mch/list',
        name: 'MchList',

        component: () => import('~/pages/mch/index.vue'),
        meta: {
          title: '商户列表',
          hideChildrenInMenu: true
        }
      },
      {
        path: '/mch/edit',
        name: 'MchEdit',
        component: () => import('~/pages/mch/edit.vue'),
        meta: {
          parentKeys: ['/mch','/mch/list'],
          title: '新增商户',
          hideInMenu:true
        }
      },
      {
        path: '/mch/info',
        name: 'MchInfo',
        component: () => import('~/pages/mch/info.vue'),
        meta: {
          parentKeys: ['/mch','/mch/list'],
          title: '商户详情',
          hideInMenu:true
        }
      }
    ]
  },
  {
    name: 'ChannelManage',
    path: '/channel',
    meta: {
      title: '渠道管理',
      icon: 'ThunderboltOutlined'
    },
    children: [

      // {
      //   path: '/channel/group',
      //   name: 'ChannelGroup',
      //   component: () => import('~/pages/channel/group/index.vue'),
      //   meta: {
      //     title: '渠道分组',
      //     hideChildrenInMenu: true
      //   }
      // },
      {
        path: '/channel/group-info',
        name: 'ChannelGroupInfo',
        component: () => import('~/pages/channel/group/info.vue'),
        meta: {
          title: '渠道组信息',
          hideInMenu: true,
          hideChildrenInMenu: true
        }
      },
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
        path: '/channel/info',
        name: 'ChannelInfo',
        component: () => import('~/pages/channel/info.vue'),
        meta: {
          title: '渠道信息',
          hideInMenu: true,
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
          title: '渠道测试',
        }
      },
      {
        path: '/channel/withdraw-list',
        name: 'ChannelWithdrawList',
        component: () => import('~/pages/channel/withdraw/list.vue'),
        meta: {
          title: '提现记录',
        }
      }
    ]
  },

  {
    name: 'debt',
    path: '/debt',
    meta: {
      title: '分账管理',
      icon: 'PayCircleOutlined'
    },
    redirect: '/debt/account-list',
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/debt/account-list',
        name: 'DebtAccountList',

        component: () => import('~/pages/debt/accountList.vue'),
        meta: {
          title: '分账账户',
          hideChildrenInMenu: true
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
        component: () => import('~/pages/order/debt/order.vue'),
        meta: {
          title: '分账单',
          hideChildrenInMenu: true
        }
      },
      {
        path: '/order/royalty-detail',
        name: 'OrderRoyaltyDetail',
        component: () => import('~/pages/order/debt/info.vue'),
        meta: {
          title: '分账单详细',
          hideInMenu: true,
          hideChildrenInMenu: true
        }
      }
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
        path: '/report/product',
        name: 'reportProduct',
        component: () => import('~/pages/report/product/index.vue'),
        meta: {
          title: '产品报表',
          hideChildrenInMenu: true
        }
      },

      // {
      //   path: '/report/channel',
      //   name: 'ChannelReport',
      //   component: () => import('~/pages/report/channel/index.vue'),
      //   meta: {
      //     title: '渠道报表',
      //     hideChildrenInMenu: true
      //   }
      // },

      {
        path: '/report/agent',
        name: 'AgentReport',
        component: () => import('~/pages/report/agent/index.vue'),
        meta: {
          title: '代理商报表',
          hideChildrenInMenu: true
        }
      },

      {
        path: '/report/merchant',
        name: 'MerchantReport',
        component: () => import('~/pages/report/merchant/index.vue'),
        meta: {
          title: '商户报表',
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
    path: '/account/center',
    name: 'AccountInfo',
    component: () => import('~/pages/account/center/index.vue'),
    meta: {
      hideInMenu:true,
      title: '账号中心',
    }
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
            component: () => import('~/pages/system/staff/index.vue'),
            meta: {
              title: '人员管理',
            }
          },
          {
            path: '/system/role/list',
            name: 'RolePermission',
            component: () => import('~/pages/system/role/index.vue'),
            meta: {
              title: '角色权限',
            }
          },
          {
            path: '/system/role/edit',
            name: 'AccountRoleEdit',
            component: () => import('~/pages/system/role/edit.vue'),
            meta: {
              hideInMenu:true,
              title: '编辑角色',
            }
          }
        ]
      },
     

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
        path: '/system/bot',
        name: 'SystemBot',
        component: () => import('~/pages/system/bot/index.vue'),
        meta: {
          title: '机器人',
          hideChildrenInMenu: true
        }
      },
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
