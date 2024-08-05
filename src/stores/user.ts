import { logoutApi } from '~@/api/common/login'
import { getRouteMenusApi } from '~@/api/common/menu'
import type { UserInfo } from '~@/api/common/user'
import type { MenuData } from '~@/layouts/basic-layout/typing'
import {rootRoute} from '~@/router/dynamic-routes'
import { generateFlatRoutes, generateRoutes, generateTreeRoutes } from '~@/router/generate-route'
import {BaseSelectOption, DYNAMIC_LOAD_WAY, DynamicLoadEnum, SelectOption} from '~@/utils/constant'
import {AccountInfo, getAccountInfo} from "~/api/account/AccountInterface.ts";

export const useUserStore = defineStore('user', () => {
  const routerData = shallowRef()
  const menuData = shallowRef<MenuData>([])
  const userInfo = shallowRef<AccountInfo>()
  const token = useAuthorization()
  const avatar = computed(() => userInfo.value?.avatar)
  const nickname = computed(() => userInfo.value?.nickName ?? userInfo.value?.loginName)
  const permissions = computed(() => userInfo.value?.permissions)
  const getMenuRoutes = async () => {
    const { data } = await getRouteMenusApi()
    return generateTreeRoutes(data ?? [])
  }

  const generateDynamicRoutes = async () => {
    const dynamicLoadWay = DYNAMIC_LOAD_WAY === DynamicLoadEnum.BACKEND ? getMenuRoutes : generateRoutes
    const { menuData: treeMenuData, routeData } = await dynamicLoadWay()

    menuData.value = treeMenuData

    routerData.value = {
      ...rootRoute,
      children: generateFlatRoutes(routeData),
    }

    return routerData.value
  }

  // 获取用户信息
  const getUserInfo = async () => {
    // 获取用户信息
    const { data } = await getAccountInfo()
    userInfo.value=data
  }


  const logout = async () => {
    // 退出登录
    // 1. 清空用户信息
    try {
      await logoutApi()
    }
    finally {
      token.value = null
      userInfo.value = undefined
      routerData.value = undefined
      menuData.value = []
    }
  }

  return {
    userInfo,
    permissions,
    getUserInfo,
    logout,
    routerData,
    menuData,
    generateDynamicRoutes,
    avatar,
    nickname,
  }
})
