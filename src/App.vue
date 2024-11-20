<script setup lang="ts">

import SettingPassword from '@/components/set-password/set-password-dialog.vue'

const appStore = useAppStore()
const optsStore = useOptsStore()
const { theme } = storeToRefs(appStore)
const { antd } = useI18nLocale()


onMounted(() => {
  optsStore.initOpts()
})
</script>

<template>
  <a-config-provider :theme="{
    token: {
      wireframe: false,
      borderRadius: 4,
      fontSize: 12
      }
  }" :locale="antd">
    <a-app class="h-full font-chinese antialiased">
      <TokenProvider>
        <RouterView />
      </TokenProvider>

      <SettingPassword />
    </a-app>
  </a-config-provider>
</template>
