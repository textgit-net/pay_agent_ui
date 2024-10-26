<script setup lang="ts">
import { LogoutOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue';
const message = useMessage()
const userStore = useUserStore()
const multiTabStore = useMultiTab()
const layoutMenuStore = useLayoutMenu()
const router = useRouter()
const { avatar, nickname } = storeToRefs(userStore)
async function handleClick({ key }: any) {
  if (key === 'logout') {
   
    try {
      Modal.confirm({
        title: '温馨提示',
        content: `确认【 ${nickname.value} 】退出登录吗？`,
        okText: '确认',
        type: 'info',
        cancelText: '取消',
        async onOk() {
          const hide = message.loading('退出登录...', 0)
          try {
            
            await userStore.logout()
          } catch {
            
          } finally {
            hide()
            message.success('退出登录成功', 3)
            router.push({
              path: '/login',
            }).then(() => {
              multiTabStore.clear()
              layoutMenuStore.clear()
            })
          }
        },
        onCancel() {},
      });
     
    }
    finally {
      
    }
  }
}
</script>

<template>
  <a-dropdown>
    <span hover="bg-[var(--hover-color)]" flex items-center h-48px px-12px cursor-pointer class="transition-all-300">
      <a-avatar :src="avatar" mr-8px size="small" />
      <span class="anticon">{{ nickname }}</span>
    </span>
    <template #overlay>
      <a-menu @click="handleClick">
        <a-menu-item key="0">
          <template #icon>
            <UserOutlined />
          </template>
          <RouterLink to="/account/center">
            个人中心
          </RouterLink>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout">
          <template #icon>
            <LogoutOutlined />
          </template>
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
