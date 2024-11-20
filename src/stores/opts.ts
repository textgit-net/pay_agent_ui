import { logoutApi } from '~@/api/common/login'
import type { PayModesItem, ChannelTypeAndPayModeOptItem } from '~@/api/common/opts'
import { getChannelTypeAndPayModeOpts } from '@/api/common/opts'
import {PayChannelType} from '~@/utils/constant'

export const useOptsStore = defineStore('opts', () => {
  const payModesOpts = shallowRef<PayModesItem[]>([])
  // 渠道支付方式
  const fetchChannelTypeAndPayModeOpts = async () => {
    const { data } = await getChannelTypeAndPayModeOpts()
    initPayModesOpts(data, PayChannelType.ALI)
  }

  const initPayModesOpts = (arr: ChannelTypeAndPayModeOptItem[], payChannelType: PayChannelType) => {
    let newArr = arr.filter(i => i.channelType == payChannelType)
    if (newArr.length) {
      payModesOpts.value = newArr[0].payModes
    }
    console.log(newArr, payModesOpts.value)
    getPayModesText("ALI_PAY_FACE_TO_FACE_TO_H5")
  }
  const getPayModesText = (payMode: string):string => {
    let itemArr = payModesOpts.value.filter(i => i.payMode == payMode)
    return itemArr.length ? itemArr[0].payModeName : payMode
  }

  const initOpts = async () => {
    Promise.all([fetchChannelTypeAndPayModeOpts()])
  }

  return {
    initOpts,
    payModesOpts,
    getPayModesText,
    
  }
})
