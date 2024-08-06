import type { LayoutSetting } from '~@/stores/app'

export default {
  title: '商户管理后台',
  theme: 'light',
  logo: '/logo.svg',
  collapsed: false,
  drawerVisible: false,
  colorPrimary: '#1677FF',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixedSider: true,
  splitMenus: false,
  header: true,
  menu: true,
  watermark: true,
  menuHeader: true,
  footer: false,
  colorWeak: false,
  multiTab: false,
  multiTabFixed: false,
  keepAlive: true,
  accordionMode: false,
  leftCollapsed: true,
  compactAlgorithm: false,
  headerHeight: 48,
  copyright: '应用管理 2023',
  animationName: 'slide-fadein-right',
} as LayoutSetting

export const animationNameList = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Fadein Up',
    value: 'slide-fadein-up',
  },
  {
    label: 'Fadein Right',
    value: 'slide-fadein-right',
  },
  {
    label: 'Zoom Fadein',
    value: 'zoom-fadein',
  },
  {
    label: 'Fadein',
    value: 'fadein',
  },
]
export type AnimationNameValueType = 'none' | 'slide-fadein-up' | 'slide-fadein-right' | 'zoom-fadein' | 'fadein'
