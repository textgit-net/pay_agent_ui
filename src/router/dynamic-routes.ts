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
    path: '/company',
    redirect: '/company/list',
    name: 'CompanyManage',
    meta: {
      title: '企业管理',
      icon: 'BankFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/company/list',
        name: 'CompanyList',
        component: () => import('~/pages/company/list.vue'),
        meta: {
          title: '企业列表'
        }
      },
      {
        path: '/company/edit',
        name: 'CompanyEdit',
        component: () => import('~/pages/company/edit.vue'),
        meta: {
          title: '企业列表',
          hideInMenu: true
        }
      },
      {
        path: '/company/rechargeRecord',
        name: 'RechargeRecord',
        component: () => import('~@/pages/company/recharge-Record.vue'),
        meta: {
          title: '企业充值记录'
        }
      },
      {
        path: '/company/accountStatement',
        name: 'AccountStatement',
        component: () => import('~/pages/company/account-Statement.vue'),
        meta: {
          title: '获取账户流水'
        }
      }
    ]
  },
  {
    path: '/application',
    redirect: '/application/manage/list',
    name: 'Application',
    meta: {
      title: '应用管理',
      icon: 'AppstoreFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/application/manage',
        name: 'ApplicationManage',
        redirect: '/application/manage/list',
        component: basicRouteMap.ApplicationLayout,
        meta: {
          hideChildrenInMenu: true,
          title: '应用列表',
          icon: 'AppstoreFilled'
        },
        children: [
          {
            path: '/application/manage/list',
            name: 'ApplicationList',
            component: () => import('~/pages/application/list.vue'),
            meta: {
              hideInMenu: true,
              parentKeys: ['/application', '/application/manage'],
              title: '应用列表'
            }
          },
          {
            path: '/application/manage/add',
            name: 'ApplicationNews',
            component: () => import('~/pages/application/from.vue'),
            meta: {
              parentKeys: ['/application', '/application/manage'],
              hideInMenu: true,
              title: '创建应用'
            }
          },
          {
            path: '/application/manage/edit',
            name: 'ApplicationEdit',
            component: () => import('~/pages/application/from.vue'),
            meta: {
              parentKeys: ['/application', '/application/manage'],
              hideInMenu: true,
              title: '编辑应用'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/appStore',
    redirect: '/appStore/manage/list',
    name: 'AppStore',
    meta: {
      title: '移动端应用商店',
      icon: 'AppstoreFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/appstore/manage',
        name: 'AppStoreManage',
        redirect: '/appStore/manage/list',
        component: basicRouteMap.ApplicationLayout,
        meta: {
          hideChildrenInMenu: true,
          title: '应用列表',
          icon: 'DatabaseOutlined'
        },
        children: [
          {
            path: '/appstore/manage/list',
            name: 'AppStoreList',
            component: () => import('~/pages/appStore/list.vue'),
            meta: {
              hideInMenu: true,
              parentKeys: ['/appstore', '/appstore/manage'],
              title: '应用列表'
            }
          },
          {
            path: '/appstore/manage/add',
            name: 'AppStoreNews',
            component: () => import('~/pages/appStore/from.vue'),
            meta: {
              parentKeys: ['/appstore', '/appstore/manage'],
              hideInMenu: true,
              title: '创建应用'
            }
          },
          {
            path: '/appstore/manage/edit',
            name: 'AppStoreEdit',
            component: () => import('~/pages/appStore/from.vue'),
            meta: {
              parentKeys: ['/appstore', '/appstore/manage'],
              hideInMenu: true,
              title: '编辑应用'
            }
          }
        ]
      },
      {
        path: '/appStore/category',
        name: 'Category',
        component: () => import('~@/pages/appStore/category.vue'),
        meta: {
          title: '分类列表',
          icon: 'ApartmentOutlined',
          hideChildrenInMenu: true
        }
      },
      {
        path: '/appStore/hot',
        name: 'HotRecommend',
        component: () => import('~@/pages/appStore/hotRecommend.vue'),
        meta: {
          title: '热门推荐',
          icon: 'FireOutlined',
          hideChildrenInMenu: true
        }
      }
    ]
  },
  {
    path: '/game',
    name: 'GameGPL',
    meta: {
      title: '游戏变现',
      icon: 'AppstoreFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/game/platform',
        name: 'GamePlatformManage',
        redirect: '/game/platform/list',
        component: basicRouteMap.ApplicationLayout,
        meta: {
          hideChildrenInMenu: true,
          title: '渠道管理',
          icon: 'DatabaseOutlined'
        },
        children: [
          {
            path: '/game/platform/list',
            name: 'GamePlatformList',
            component: () => import('~/pages/task/gam-platform-list.vue'),
            meta: {
              hideInMenu: true,
              parentKeys: ['/game', '/game/platform'],
              title: '渠道列表'
            }
          },
          {
            path: '/game/platform/edit',
            name: 'GamePlatformEdit',
            component: () => import('~/pages/appStore/from.vue'),
            meta: {
              parentKeys: ['/game', '/game/platform'],
              hideInMenu: true,
              title: '编辑渠道'
            }
          }
        ]
      },
      {
        path: '/game/task',
        name: 'GameTaskManage',
        redirect: '/game/task/list',
        component: basicRouteMap.ApplicationLayout,
        meta: {
          hideChildrenInMenu: true,
          title: '推广任务',
          icon: 'DatabaseOutlined'
        },
        children: [
          {
            path: '/game/task/list',
            name: 'GameTaskList',
            component: () => import('~/pages/task/game-task-list.vue'),
            meta: {
              hideInMenu: true,
              parentKeys: ['/game', '/game/task'],
              title: '任务列表'
            }
          },
          {
            path: '/game/task/edit',
            name: 'GamePlatformEdit',
            component: () => import('~/pages/task/game-task-edit.vue'),
            meta: {
              parentKeys: ['/game', '/game/task'],
              hideInMenu: true,
              title: '编辑任务'
            }
          }
        ]
      },
      {
        path: '/game/task/record',
        name: 'GameTaskRecordManage',
        component: () => import('~/pages/appStore/list.vue'),
        meta: {
          hideChildrenInMenu: true,
          title: '收益报表',
          icon: 'DatabaseOutlined'
        }
      }
    ]
  },
  {
    path: '/seed',
    redirect: '/seed/list',
    name: 'SeedManage',
    meta: {
      title: '种草文章',
      icon: 'BankFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/seed/list',
        name: 'SeedList',
        component: () => import('~/pages/seed/list.vue'),
        meta: {
          title: '种草文章列表'
        }
      },
      {
        path: '/seed/from',
        name: 'Seedfrom',
        component: () => import('~/pages/seed/from.vue'),
        meta: {
          title: '添加文章',
          hideInMenu: true
        }
      }
    ]
  },
  {
    name: 'League',
    path: '/league',
    meta: {
      title: '联盟',
      icon: 'RobotFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/league/product',
        name: 'LeagueProduct',
        component: basicRouteMap.MediationCodeLayout,
        redirect: '/league/product/list',
        meta: {
          title: '商品管理',
          hideChildrenInMenu: true
        },
        children: [
          {
            name: 'LeagueProductManage',
            path: '/league/product/market',
            component: () => import('~/pages/league/product-market.vue'),
            meta: {
              hideInMenu: true,
              title: '商品管理'
            }
          },
          {
            name: 'LeagueProductList',
            path: '/league/product/list',
            component: () => import('~/pages/league/league-spu-list.vue'),
            meta: {
              hideInMenu: true,
              title: '选品市场'
            }
          }
        ]
      },
      {
        name: 'LeagueProductChannel',
        path: '/league/product/channel',
        component: () => import('~/pages/league/league-spu-channel.vue'),
        meta: {
          hideInMenu: false,
          title: '供应商渠道'
        }
      }
    ]
  },
  // {
  //   path: '/mediation/site',
  //   name: 'MediationManage',
  //   meta: {
  //     title: '广告变现',
  //     icon: 'RobotFilled'
  //   },
  //   component: basicRouteMap.RouteView,
  //   children: [
  //     {
  //       path: '/mediation/site/list',
  //       name: 'MediationSiteList',
  //       component: () => import('~/pages/mediation/site-manage.vue'),
  //       meta: {
  //         title: '应用管理'
  //       }
  //     },
  //     {
  //       path: '/mediation/site/unit',
  //       name: 'MediationCode',
  //       component: basicRouteMap.MediationCodeLayout,
  //       redirect: '/mediation/site/unit/mediationCodeEdit',
  //       meta: {
  //         title: '瀑布流管理',
  //         hideChildrenInMenu: true
  //       },
  //       children: [
  //         {
  //           name: 'MediationCodeEdit',
  //           path: '/mediation/site/unit/mediationCodeEdit',
  //           component: () => import('~/pages/mediation/unitCode/code-edit-page.vue'),
  //           meta: {
  //             parentComps: [() => import('~/pages/mediation/unitCode/code-edit.vue')],
  //             hideInMenu: true,
  //             parentKeys: ['/mediation/site', '/mediation/site/unit'],
  //             title: '瀑布流管理'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: '/network',
  //       name: 'AdNetwork',
  //       component: () => import('~/pages/mediation/network-list.vue'),
  //       meta: {
  //         title: '广告网络'
  //       }
  //     }
  //   ]
  // },
  {
    name: 'asset',
    path: '/asset',
    meta: {
      title: '资金管理',
      icon: 'RobotFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/asset/withdrawList',
        name: 'assetWithdrawList',
        component: () => import('~/pages/asset/withdrawList.vue'),
        meta: {
          title: '提现管理',
          hideChildrenInMenu: true
        }
      }
    ]
  },

  {
    path: '/member',
    redirect: '/member/index',
    name: 'MemberManage',
    meta: {
      title: '会员管理',
      icon: 'BankFilled'
    },
    component: basicRouteMap.MemberLayout,
    children: [
      {
        path: '/member/index',
        name: 'MemberList',
        component: () => import('~/pages/member/index.vue'),
        meta: {
          title: '会员列表'
        }
      },
      {
        path: '/member/detail',
        name: 'MemberDetail',
        component: () => import('~/pages/member/detail.vue'),
        meta: {
          title: '会员详情',
          hideInMenu: true
        }
      },
      // {
      //   path: '/member/rankList',
      //   name: 'RankList',
      //   component: () => import('~/pages/member/rank-list.vue'),
      //   meta: {
      //     title: '每日收益排行榜'
      //   }
      // },
    ]
  },

  {
    name: 'dataReport',
    path: '/dataReport',
    meta: {
      title: '数据报表',
      icon: 'RobotFilled'
    },
    component: basicRouteMap.RouteView,
    children: [
      {
        path: '/dataReport/appProfit',
        name: 'dataReportAppProfit',
        component: () => import('~/pages/dataReport/appProfit/index.vue'),
        meta: {
          title: '应用收益',
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
