<script setup lang="ts">
import { pick } from '@v-c/utils'
import BasicLayout from './basic-layout/index.vue'
import SettingDrawer from './components/setting-drawer/index.vue'
import MultiTab from './multi-tab/index.vue'
import { SwapOutlined} from '@ant-design/icons-vue'
import { animationNameList } from '~@/config/default-setting'

defineOptions({
  name: 'ProLayout',
})
const appStore = useAppStore()
const { layoutSetting } = storeToRefs(appStore)
const userStore = useUserStore()
const layoutMenu = useLayoutMenu()
const { t } = useI18nLocale()
const { selectedKeys, openKeys } = storeToRefs(layoutMenu)
const { isMobile, isPad } = useQueryBreakpoints()
watch(isPad, (val) => {
  if (val)
    appStore.toggleCollapsed(true)
  else appStore.toggleCollapsed(false)
})
const layoutProps = computed(() =>
  pick(appStore.layoutSetting, [
    'fixedHeader',
    'fixedSider',
    'splitMenus',
    'menuHeader',
    'header',
    'menu',
    'layout',
    'footer',
    'contentWidth',
    'compactAlgorithm',
  ]),
)


onMounted(()=>{

})
</script>

<template>
  <BasicLayout
    :collapsed="layoutSetting.collapsed"
    :theme="layoutSetting.theme"
    :menu-data="userStore.menuData"
    v-bind="layoutProps"
    :selected-keys="selectedKeys"
    :open-keys="layoutSetting.layout === 'top' ? [] : openKeys"
    :copyright="layoutSetting.copyright"
    :is-mobile="isMobile"
    :logo="layoutSetting.logo"
    :title="layoutSetting.title"
    :accordion-mode="layoutSetting.accordionMode"
    :left-collapsed="layoutSetting.leftCollapsed"
    :header-height="layoutSetting.headerHeight"
    @update:open-keys="layoutMenu.handleOpenKeys"
    @update:selected-keys="layoutMenu.handleSelectedKeys"
    @update:collapsed="appStore.toggleCollapsed"
  >
    <template #headerActions>

      <UserAvatar />
      <SelectLang />
<!--      <GithubLink />-->
<!--      <template v-if="!isMobile">-->
<!--        <GiteeLink />-->
<!--        <DocLink />-->
<!--      </template>-->
    </template>
    <template #contentPrefix>
      <MultiTab v-if="layoutSetting.multiTab" />
    </template>

    <template #renderFooterLinks />

    <a-watermark h-full flex flex-col flex-1 :content="!layoutSetting.watermark ? '' : layoutSetting.title ?? 'Antdv Pro'">
      <RouterView>
        <template #default="{ Component }">
          <component :is="Component" />
        </template>
      </RouterView>
    </a-watermark>
  </BasicLayout>
  <SettingDrawer
    v-model:open="layoutSetting.drawerVisible"
    :t="t"
    :theme="layoutSetting.theme"
    :color-primary="layoutSetting.colorPrimary"
    :color-weak="layoutSetting.colorWeak"
    :multi-tab="layoutSetting.multiTab"
    :multi-tab-fixed="layoutSetting.multiTabFixed"
    :animation-name-list="animationNameList"
    :animation-name="layoutSetting.animationName"
    :keep-alive="layoutSetting.keepAlive"
    :accordion-mode="layoutSetting.accordionMode"
    :left-collapsed="layoutSetting.leftCollapsed"
    :watermark="layoutSetting.watermark"
    v-bind="layoutProps"
    :layout-setting="layoutSetting"
    @setting-change="appStore.changeSettingLayout"
  />
</template>

<style scoped></style>
