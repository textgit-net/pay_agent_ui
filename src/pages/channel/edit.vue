<script setup lang="ts">
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, UploadOutlined } from "@ant-design/icons-vue";
import type { ProductItem }from '@/api/channel/group'
import type { PayModesItem } from '~@/api/common/opts'
import { Empty } from 'ant-design-vue';
import {
  changeChannel,
  ChannelFormData,
  ChannelSimpleResponse,
  getChannelEditInfo,
  getChannelListWithType,
  saveChannel
} from "~/api/channel/ChannelInterface.ts";
import {
  getPayChannelTypeText,
  getPayModeTypeText,
  PayChannelType,
  PayChannelTypeSelectOption,
  PayModeType,
  ResponseBody
} from "~/utils/constant.ts";
import type { Rule } from 'ant-design-vue/es/form';
const optsStore = useOptsStore()
const userStore = useUserStore()

import { getChannelGroups,ChannelGroupSimpleResponse } from '@/api/channel/group'

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const alipayUserChannelStepsItems = [
  {
    title: '基础信息',
  },
  {
    title: '参数配制',
  },
  {
    title: '扫码授权',
  },
  {
    title: '配置结果'
  },
]
const commonChannelStepsItems = [
  {
    title: '基础信息',
  },
  {
    title: '参数配制',
  },
  {
    title: '配置结果'
  },
]
const MQChannelStepsItems = [
  {
    title: '基础信息',
  },
  {
    title: '账户配制',
  },
  {
    title: '收款码配制',
  },
  {
    title: '配置结果'
  },
]
const current = ref(0)
const router = useRouter()
const route = useRoute()
const formRef = ref()
const groups = shallowRef<ChannelGroupSimpleResponse[]>([])
const payModes = shallowRef<any[]>([])
const saveLoading = ref(false)
const formData = reactive<ChannelFormData>({
  isEnableRoyalty: false,
  channelType: PayChannelType.ALI,
  channelConfig: {
    isCert: false,
    loginName:"",
    password:""
  }
})
const channels = shallowRef<ChannelSimpleResponse[]>([])
const oauthUrlCodeResult = ref<ResponseBody<String>>(null)
const isLoading = ref(false)
const errorMsg = ref("")
const isSaveSuccess = ref(false)

const maqinQrCodes=shallowRef<any[]>([])

const maqinTabcolumns:ColumnsType =[
  {
    title: '商户',
    dataIndex: 'mchName',
  },
  {
    title: '店铺',
    dataIndex: 'storeName',
  },
  {
    title: '收款单',
    dataIndex: 'qrName',
  },
  {
    title: '金额',
    dataIndex: 'amount',
  },
  {
    title: '启用状态',
    dataIndex: 'isEnable',
  }
]
const validateChannelType = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请选择渠道类型");
  } else {
    return Promise.resolve();
  }
};
const validateName = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请输入渠道名称");
  } else {
    return Promise.resolve();
  }
};
const validateAlipayAppId = async (_rule: Rule, value: string) => {
  if (current.value == 1 && !formData.channelConfig['appId']) {
    return Promise.reject("请输入支付宝应用ID");
  } else {
    return Promise.resolve();
  }
};
const validatePid = async (_rule: Rule, value: string) => {
  return Promise.resolve();
  if (current.value == 1 && !formData.channelConfig['pid']) {
    return Promise.reject("请输入支付宝合作伙伴Id");
  } else {
    return Promise.resolve();
  }
};
const validateAlipayPublicKey = async (_rule: Rule, value: string) => {
  if (current.value == 1 && !formData.channelConfig['alipayPublicKey']) {
    return Promise.reject("请输入支付宝公钥");
  } else {
    return Promise.resolve();
  }
};
const validateAlipayAppCert = async (_rule: Rule, value: any) => {
  if (current.value == 1 && !formData.channelConfig['appCert']) {
    return Promise.reject("请输入应用公钥证书");
  } else {
    return Promise.resolve();
  }
};
const validateAlipayPublicCert = async (_rule: Rule, value: any) => {
  if (current.value == 1 && !formData.channelConfig['alipayPublicCert']) {
    return Promise.reject("请输入支付宝公钥证书");
  } else {
    return Promise.resolve();
  }
};
const validateAlipayRootCert = async (_rule: Rule, value: any) => {
  if (current.value == 1 && !formData.channelConfig['alipayRootCert']) {
    return Promise.reject("请输入支付宝根证书");
  } else {
    return Promise.resolve();
  }
};
const validateAlipayPrivateKey = async (_rule: Rule, value: string) => {
  if (current.value == 1 && !formData.channelConfig['privateKey']) {
    return Promise.reject("请输入支付宝开发者私钥");
  } else {
    return Promise.resolve();
  }
};
const validateIsCert = async (_rule: Rule, value: string) => {
  if (current.value == 1 && formData.channelConfig['isCart'] == null) {
    return Promise.reject("请选择签名方式");
  } else {
    return Promise.resolve();
  }
};
const rules: Record<string, Rule[]> = {
  channelType: [{ required: true, validator: validateChannelType, trigger: 'change' }],
  name: [{ required: true, validator: validateName, trigger: 'change' }],
  alipayAppId: [{ required: true, validator: validateAlipayAppId, trigger: 'change' }],
  pid: [{ required: false, validator: validatePid, trigger: 'change' }],
  alipayPrivateKey: [{ required: true, validator: validateAlipayPrivateKey, trigger: 'change' }],
  IsCert: [{ required: true, validator: validateIsCert, trigger: 'change' }],
  alipayPublicKey: [{ required: true, validator: validateAlipayPublicKey, trigger: 'change' }],
  alipayAppCert: [{ required: true, validator: validateAlipayAppCert, trigger: 'blur' }],
  alipayPublicCert: [{ required: true, validator: validateAlipayPublicCert, trigger: 'blur' }],
  alipayRootCert: [{ required: true, validator: validateAlipayRootCert, trigger: 'blur' }],
};

const next = (value: number) => {
  formRef.value
    .validate()
    .then(() => {
      current.value = value
    })

}

const newChannel = () => {
  if (formData.id) {
    router.replace({ path: router.currentRoute.value.path })
    return;
  }
  formData.name = ""
  formData.id = null
  formData.allocationConfig = {
    isCert: false,
  }
  formData.channelType = PayChannelType.ALI
  current.value = 0
  isSaveSuccess.value = false
  errorMsg.value = ""
}
const onSubmit = async () => {
  formRef.value
    .validate()
    .then(() => {
      saveLoading.value = true
      if(formData.channelType==PayChannelType.MQ){
        formData.channelConfig.mchList.forEach(mch=>{
          mch.stores.forEach(store=>{
            store.codes.forEach(code=>{
                maqinQrCodes.value.forEach(qr=>{
                  if(code.qrCode===qr.qrCode){
                     code.isEnable=qr.isEnable
                     return
                  }
                })
            })
          })
        })
      }
      let currentValue=0;
      if(PayChannelType.ALI==formData.channelType){
        currentValue=2;
      }
      if(PayChannelType.MQ==formData.channelType){
        currentValue=3;
      }
      saveChannel(formData).then(res => {
        saveLoading.value = false
        isSaveSuccess.value = true
        current.value = currentValue
        optsStore.initOpts()
      }).catch(err => {
        saveLoading.value = false
        isSaveSuccess.value = false
        errorMsg.value = err
        current.value =currentValue
      })
    })
}

/**
 * 获取渠道授权二维码
 */
const getChannelOauthCode = async () => {
  isLoading.value = true
  try {
    oauthUrlCodeResult.value = await useGet(`/channel/genOauthCode/${formData.channelConfig.channelId}`)
  } finally {
    isLoading.value = false
    current.value = 2
  }
}
const getMQData =async ()=>{
  isLoading.value = true
  try {
    let result=  await useGet(`/channel/getMQData?channelId=${formData.id}`,{"loginName":formData.channelConfig['loginName'],'password':formData.channelConfig['password']})
    formData.channelConfig=result.data
    updateMaqinQrCodeData()
    isSaveSuccess.value = true
  }catch (e) {
    isSaveSuccess.value = false
    errorMsg.value = err
  }finally {
    isLoading.value=false
    current.value=2
  }
}
const updateMaqinQrCodeData =()=>{
  if(PayChannelType.MQ==formData.channelType){
    let qrcodeList=[]
    formData.channelConfig.mchList.forEach(mch=>{
      mch.stores.forEach(store=>{
        store.codes.forEach(code=>{
          qrcodeList.push({
            "qrCode":code.qrCode,
            "qrName":code.name,
            "amount":code.amount,
            "storeId":store.storeId,
            "storeName":store.storeName,
            "isEnable":code.isEnable,
            "mchId":mch.mchId,
            "mchName":mch.mchName
          })
        })
      })
    })
    maqinQrCodes.value=qrcodeList
  }
}
const loadGroups = async () => {
  const { data } = await getChannelGroups()
  groups.value = data ?? []
}

const getPayModesWithChannelType = async (type: PayChannelType) => {
  const { data } = await useGet<PayModeType[]>(`/channel/payMods?channelType=${type}`)

  payModes.value = data ?? []
  // payModes.value = optsStore.payModesOpts
}
const onChannelTypeChange = async (value: PayChannelType) => {
  console.log(value)
  await getPayModesWithChannelType(value)
  if (PayChannelType.ALI_USER == value && channels.value.length == 0) {
    getChannelListWithType(PayChannelType.ALI).then(res => {
      channels.value = res.data ?? []
    })
  }
}
const changeQrCodeEnable =(record:any)=>{
  maqinQrCodes.value=maqinQrCodes.value.map(i => {
    let isEnable=i.isEnable;
    if(i.qrCode==record.qrCode){
      isEnable=!isEnable
    }
    return {
      ...i,
      isEnable: isEnable
    }
  })

  // maqinQrCodes.value=JSON.parse(JSON.stringify(maqinQrCodes))
}
const changeProduct = (item: String) => {
  userStore.userInfo.products?.forEach(v=>{
    if(v.productCode===item){
      formData.channelType = v.channelType
    }
  })
}

const findChannelType = (productCode: string) => {
  userStore.userInfo.products.map(i=>{
    if (i.productCode == productCode) {
      formData.channelType = i.channelType
    }
  })
}

const id = route.query['id']
onMounted(() => {
  if (id) {
    isLoading.value = true
    getChannelEditInfo(id).then((res) => {
      Object.assign(formData, res.data ?? {})
      onChannelTypeChange(res.data.channelType)
      isLoading.value = false
      findChannelType(formData.productCode)
      updateMaqinQrCodeData()
    })

  } else {
    getPayModesWithChannelType(formData.channelType)
  }

  loadGroups()
})
const filterOption = (input: string, option: any) => {
  return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
</script>

<template>
  <a-spin :spinning="isLoading">
    <a-flex justify="center" align="center">
      <a-form ref="formRef" style="width: 800px" :model="formData" :rules="rules" :labelCol="{style: 'width: 120px; display: inline-block;'}">
        <a-flex vertical :gap="10">
          <a-card>
            <a-page-header :title="id ? '编辑渠道' : '添加渠道'" class="site-page-header" sub-title="  "
              @back="() => router.back()" style="padding: 0;">
              <template #tags>
              </template>
            </a-page-header>
          </a-card>
          <a-card>
            <a-steps :current="current" v-if="PayChannelType.ALI == formData.channelType" :percent="60"
              label-placement="vertical" :items="commonChannelStepsItems" />
<!--            <a-steps :current="current" v-if="" :percent="60" label-placement="vertical"-->
<!--              :items="commonChannelStepsItems" />-->
            <a-steps :current="current" v-if="PayChannelType.MQ == formData.channelType" :percent="60"
                     label-placement="vertical" :items="MQChannelStepsItems" />

            <a-card v-if="current == 0" :bordered="false">
              <!--<a-typography-text strong>1.基础信息</a-typography-text>-->
              <!-- <a-form-item label="渠道类型" name="channelType" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <a-radio-group @change="() => onChannelTypeChange(formData.channelType)" :disabled="formData.id != null" v-model:value="formData.channelType" default-value="false">
                    <a-radio v-for="(item) in PayChannelTypeSelectOption" :value="item.value">{{ item.title }}</a-radio>
                  </a-radio-group>
                </a-flex>
              </a-form-item> -->
              <!-- <a-form-item label="支付方式" name="payModes" class="mt-5" :rules="{ required: true, message: '请选择支付方式' }">
                <a-flex style="flex: 1" align="start" justify="start" vertical>
                  <a-flex style="flex: 1">
                    <a-checkbox-group v-model:value="formData.payModes">
                      <template v-for="(item) in payModes">
                        <a-checkbox :value="(item as PayModesItem).payMode">{{(item as PayModesItem).payModeName }}</a-checkbox>
                      </template>
                    </a-checkbox-group>
                  </a-flex>
                  <a-typography-text type="secondary">请选择渠道分组,用于派单</a-typography-text>
                </a-flex>
              </a-form-item> -->
<!--               <a-form-item label="产品类型" name="channelType" class="mt-5">-->
<!--               <a-flex style="flex: 1" vertical>-->
<!--                 <a-radio-group @change="() => onChannelTypeChange(formData.channelType)" :disabled="formData.id != null" v-model:value="formData.channelType" default-value="false">-->
<!--                   <a-radio v-for="(item) in PayChannelTypeSelectOption" :value="item.value">{{ item.title }}</a-radio>-->
<!--                 </a-radio-group>-->
<!--               </a-flex>-->
<!--             </a-form-item>-->
              <a-form-item label="产品代码" name="productCode" class="mt-5">
                <a-select v-model:value="formData.productCode"  @change="changeProduct" placeholder="请选择支付产品"
                  style="width: 320px;">
                  <a-select-option v-for="(item) in userStore.userInfo.products"  :value="item.productCode">{{ item.productName }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="渠道名称" name="name" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.name" placeholder="请输入渠道名称" style="width: 320px;" allow-clear></a-input>
                  <a-typography-text type="secondary">为了方便管理渠道</a-typography-text>
                </a-flex>
              </a-form-item>


              <!-- <a-form-item label="渠道组" name="groupCode" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <a-select v-model:value="formData.groupCode" show-search :filter-option="filterOption" style="width: 320px;" allowClear>
                    <a-select-option v-for="(item) in groups" :value="item.groupCode">{{ item.name }}</a-select-option>

                    <template #notFoundContent>
                      <a-flex align="center" vertical justify="center">
                        <a-empty :image="simpleImage"></a-empty>
                        <a-button style="margin-top: -30px;" @click="router.push({path:'/channel/group'})" type="link">去添加渠道分组</a-button>
                      </a-flex>
                    </template>
                  </a-select>
                  <a-typography-text type="secondary">请选择渠道分组,用于派单</a-typography-text>
                </a-flex>
              </a-form-item> -->
            </a-card>
            <a-card v-if="current == 1 && PayChannelType.MQ === formData.channelType" :bordered="false">

              <a-form-item label="账号" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <a-input :disabled="formData.id!=null" v-model:value="formData.channelConfig['loginName']"></a-input>
                  <a-typography-text type="secondary">请填写您在码钱注册的登录账号名称.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="密码" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <a-input :disabled="formData.id!=null" v-model:value="formData.channelConfig['password']"></a-input>
                  <a-typography-text type="secondary">请填写您在码钱注册的登录账号密码.</a-typography-text>
                </a-flex>
              </a-form-item>
            </a-card>
            <a-card v-if="current == 1 && PayChannelType.ALI === formData.channelType" :bordered="false">
              <!--<a-typography-text strong>2.渠道配制</a-typography-text>-->
              <a-form-item label="应用ID" name="alipayAppId" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['appId']" placeholder="请输入支付宝应用ID"
                    style="width: 320px;" allow-clear></a-input>
                  <a-typography-text type="secondary">支付宝平台申请的应用ID.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="PID" name="pid" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['pid']" placeholder="请输入支付宝合作伙伴Id"
                    style="width: 320px;" allow-clear></a-input>
                  <a-typography-text type="secondary">支付宝平台申请的合作伙伴Id.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="开发者私钥" name="alipayPrivateKey" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['privateKey']" placeholder="请输入支付宝开发者私钥"
                    style="width: 320px;" allow-clear></a-input>
                  <a-typography-text type="secondary">请输入支付宝开发者私钥</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="签名方式" name="isCert" class="mt-5">
                <a-radio-group v-model:value="formData.channelConfig['isCert']" default-value="false">
                  <a-radio :value="false">密钥</a-radio>
                  <a-radio :value="true">证书</a-radio>
                </a-radio-group>

              </a-form-item>
              <a-form-item v-if="!formData.channelConfig['isCert']" label="支付宝公钥" name="alipayPublicKey" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['alipayPublicKey']" placeholder="请输入支付宝公钥"
                    style="width: 320px;" allow-clear></a-input>
                  <a-typography-text type="secondary">支付宝平台下发的公钥证书.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item v-if="formData.channelConfig['isCert']" label="应用公钥证书" name="alipayAppCert" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <SingFileUpload :is-upload="false" :show-upload-list="true"
                    v-model:value="formData.channelConfig['appCert']">
                    <a-button>
                      <UploadOutlined />
                      upload
                    </a-button>
                  </SingFileUpload>
                  <a-typography-text type="secondary">支付宝平台下发的应用公钥证书.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item v-if="formData.channelConfig['isCert']" label="支付宝公钥证书" name="alipayPublicCert" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <SingFileUpload :is-upload="false" :show-upload-list="true"
                    v-model:value="formData.channelConfig['alipayPublicCert']">
                    <a-button>
                      <UploadOutlined />
                      upload
                    </a-button>
                  </SingFileUpload>
                  <a-typography-text type="secondary">支付宝平台下发的公钥证书.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item v-if="formData.channelConfig['isCert']" label="支付宝根证书" name="alipayRootCert" class="mt-5">
                <a-flex style="flex: 1" vertical>
                  <SingFileUpload :is-upload="false" :show-upload-list="true"
                    v-model:value="formData.channelConfig['alipayRootCert']">
                    <a-button>
                      <UploadOutlined />
                      upload
                    </a-button>
                  </SingFileUpload>
                  <a-typography-text type="secondary">支付宝平台下发的公钥证书.</a-typography-text>
                </a-flex>
              </a-form-item>
            </a-card>
<!--            <a-card v-if="current == 1 && PayChannelType.ALI_USER === formData.channelType" :bordered="false">-->
<!--              <a-form-item label="渠道" class="mt-5">-->
<!--                <a-flex style="flex: 1" vertical>-->
<!--                  <a-select v-model:value="formData.channelConfig['channelId']" placeholder="请选择支付宝渠道"-->
<!--                    style="width: 320px;">-->
<!--                    <a-select-option v-for="(item) in channels" :value="item.id">{{ item.name }}</a-select-option>-->
<!--                  </a-select>-->
<!--                  <a-typography-text type="secondary">随意选择一个支付宝渠道主要用于获取支付宝用户ID.</a-typography-text>-->
<!--                </a-flex>-->
<!--              </a-form-item>-->
<!--            </a-card>-->
<!--            <a-card v-if="current == 2 && PayChannelType.ALI_USER === formData.channelType" :bordered="false">-->
<!--              <a-flex vertical justify="center" align="center" :gap="10">-->
<!--                <vue-qrcode :color="{}" :quality="1" :value="oauthUrlCodeResult.data" :width="200"-->
<!--                  :margin="0"></vue-qrcode>-->
<!--                <a-typography-text type="secondary">打开手机浏览器扫一扫</a-typography-text>-->
<!--              </a-flex>-->
<!--              <a-form-item label="支付宝用户ID" name="alipayUserId">-->
<!--                <a-flex style="flex: 1" vertical>-->
<!--                  <a-input v-model:value="formData.channelConfig['userId']" placeholder="请扫码/手动填写支付宝用户ID"-->
<!--                    style="width: 320px;" allow-clear></a-input>-->
<!--                  <a-typography-text type="secondary">支持扫码获取用户ID以及手动填写用户ID.</a-typography-text>-->
<!--                </a-flex>-->
<!--              </a-form-item>-->
<!--              <a-form-item label="终端类型" name="alipayUserId">-->
<!--                <a-radio-group v-model:value="formData.channelConfig['clientType']" default="SERVICE">-->
<!--                  <a-radio value="SERVICE">服务器</a-radio>-->
<!--                  <a-radio value="CLIENT">客户端</a-radio>-->
<!--                </a-radio-group>-->
<!--              </a-form-item>-->
<!--              <a-form-item label="支付宝用户Cookie" v-if="'SERVICE' == formData.channelConfig['clientType']"-->
<!--                name="alipayUserCookie">-->
<!--                <a-flex style="flex: 1" vertical>-->
<!--                  <a-input v-model:value="formData.channelConfig['userCookie']" placeholder="请填写支付宝用户Cookie"-->
<!--                    style="width: 320px;" allow-clear></a-input>-->
<!--                  <a-flex :gap="5">-->
<!--                    <a-typography-text type="secondary">需要填写与用户ID一致的支付宝账号Cookie.</a-typography-text>-->
<!--                    <a-typography-link>怎么获取Cookie?</a-typography-link>-->
<!--                  </a-flex>-->
<!--                </a-flex>-->
<!--              </a-form-item>-->
<!--              <a-flex :gap="5" v-if="'CLIENT' == formData.channelConfig['clientType']">-->
<!--                <a-typography-text type="secondary">客户端模式需要下载客户端软件并运行.</a-typography-text>-->
<!--                <a-typography-link>下载客端</a-typography-link>-->
<!--              </a-flex>-->
<!--            </a-card>-->
            <a-card v-if="current==2 && PayChannelType.MQ===formData.channelType" :bordered="false">
                  <a-table :data-source="maqinQrCodes" :pagination="null" :columns="maqinTabcolumns" size="middle" :bordered="false">
                    <template #bodyCell="{ column , record}">
                      <template v-if="column.dataIndex==='isEnable'">
                        <a-flex align="center">
                          <a-switch @click="changeQrCodeEnable(record)" checked-children="是" un-checked-children="否" :checked="record.isEnable" :checked-value="true" :un-checked-value="false"></a-switch>
                        </a-flex>
                      </template>
                    </template>
                  </a-table>
            </a-card>
            <a-card v-if="
                (PayChannelType.ALI_USER == formData.channelType && current == alipayUserChannelStepsItems.length - 1)
                ||
                ( (PayChannelType.ALI == formData.channelType)&& current == commonChannelStepsItems.length - 1)
                ||
                ( (PayChannelType.MQ == formData.channelType)&& current == MQChannelStepsItems.length - 1)
              " :bordered="false">
              <a-flex vertical v-if="isSaveSuccess" justify="center" align="center" :gap="10">
                <CheckCircleOutlined style="font-size: 24px;color: green" />
                <a-typography-text type="success">配制成功</a-typography-text>
              </a-flex>
              <a-flex vertical v-if="!isSaveSuccess" justify="center" align="center" :gap="10">
                <CloseCircleOutlined style="font-size: 24px;color: red" />
                <a-typography-text type="danger">{{ errorMsg }}</a-typography-text>
              </a-flex>
            </a-card>
            <a-flex justify="center" align="center" :gap="30" class="mt-10">
              <a-button v-if="current == 0" @click="router.back()" style="width:100px">取消</a-button>
              <a-button v-if="current == 0" @click="next(1)" style="width:100px" type="primary">下一步</a-button>
              <a-button v-if="current == 1" @click="current = 0" style="width:100px">上一步</a-button>

              <a-button v-if="current == 1 && PayChannelType.MQ == formData.channelType " @click="getMQData"
                        style="width:100px" :loading="saveLoading" type="primary">同步数据</a-button>

              <a-button v-if="current == 1 && PayChannelType.MQ == formData.channelType && formData.id!=null" @click="next(2)"
                        style="width:100px" :loading="saveLoading" type="primary">下一步</a-button>

              <a-button v-if="current == 1 && (PayChannelType.ALI_USER != formData.channelType && PayChannelType.MQ != formData.channelType)" @click="onSubmit"
                style="width:100px" :loading="saveLoading" type="primary">保存</a-button>

              <a-button v-if="current == 1 && PayChannelType.ALI_USER == formData.channelType" @click="getChannelOauthCode"
                style="width:100px" :loading="saveLoading" type="primary">下一步</a-button>

              <a-button v-if="current == 2 && PayChannelType.ALI == formData.channelType" @click="current = 1"
                style="width:100px">上一步</a-button>

              <a-button v-if="current == 2 && PayChannelType.MQ == formData.channelType" @click="current = 1" style="width:100px">上一步</a-button>

              <a-button v-if="current == 2 && PayChannelType.MQ == formData.channelType" @click="onSubmit"
                        style="width:100px" :loading="saveLoading" type="primary">保存</a-button>


              <a-button v-if="current == 2 && PayChannelType.ALI_USER == formData.channelType" @click="onSubmit"
                style="width:100px" :loading="saveLoading" type="primary">保存</a-button>



              <a-button v-if="
                (PayChannelType.ALI == formData.channelType)
                && current == commonChannelStepsItems.length - 1 && !isSaveSuccess" @click="current = 1"
                style="width:100px" type="primary">上一步</a-button>
              <a-button v-if="
                (
                  (PayChannelType.ALI_USER == formData.channelType && current == alipayUserChannelStepsItems.length - 1)
                  ||
                  (
                    (PayChannelType.ALI == formData.channelType)
                    && current == commonChannelStepsItems.length - 1)
                )
                && isSaveSuccess" @click="newChannel" style="width:100px" type="primary">继续添加</a-button>

              <a-button v-if="
                (
                  (PayChannelType.ALI_USER == formData.channelType && current == alipayUserChannelStepsItems.length - 1)
                  ||
                  (
                    (PayChannelType.ALI == formData.channelType)
                    && current == commonChannelStepsItems.length - 1)
                )
              " @click="router.back()" style="width:100px">返回列表</a-button>
            </a-flex>
          </a-card>
        </a-flex>
      </a-form>
    </a-flex>
  </a-spin>
</template>

<style scoped lang="less"></style>