import { toArray } from '@v-c/utils'
import type { AccessEnum } from '~@/utils/constant'

export function useAccess() {
  const userStore = useUserStore()
  const roles = computed(() => userStore.permissions)
  const hasAccess = (roles: (string | number)[] | string | number | AccessEnum) => {
    const accessRoles = userStore.permissions
    const roleArr = toArray(roles).flat(1)
    return roleArr.some(role => accessRoles?.includes(role))
  }
  return {
    hasAccess,
    roles,
  }
}
