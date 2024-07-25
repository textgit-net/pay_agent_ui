<script setup lang="ts">

import {getMediationUnitInfo} from "~/api/mediationSiteUnit.ts";
import {getMediationUnitSegmentInfo} from "~/api/mediationUnitSegment.ts";
import {getMediationSiteInfo, MediationSite} from "~/api/mediationSite.ts";
import MediationCodeCreateNetworkItem
  from "~/pages/mediation/unitCode/components/mediation-code-create-network-from-item.vue";
import MediationCodeCreateNetworkFromItem
  from "~/pages/mediation/unitCode/components/mediation-code-create-network-from-item.vue";
import {ClientPlatform} from "~/utils/constant.ts";
import {AndroidOutlined, AppleOutlined, QuestionCircleOutlined} from "@ant-design/icons-vue";
import { CreateMediationUnitCodeRequest, saveMediationUnitCode } from "~@/api/mediationUnitCode";


const router=useRouter()
const loading = ref(false)

const siteInfo=reactive<MediationSite>({
  networks:[]
})
const getSiteInfo=async ()=>{
  let {siteId}=router.currentRoute.value.query
  let res= await getMediationSiteInfo(String(siteId))
  Object.assign(siteInfo,res.data??{})
}
const getUnitInfo=async ()=>{
  let {unitId}=router.currentRoute.value.query
  let res=await getMediationUnitInfo(String(unitId))

}

const formData=reactive<CreateMediationUnitCodeRequest>({
  isEnable: true
})
const onNetwordChange = (id: number)=>{
  formData.networkId = id
}

const saveForm = async () => {
  // let {unitId, segmentId, siteId, waterfallId }=router.currentRoute.value.query
  Object.assign(formData, router.currentRoute.value.query)
  loading.value = true

  try {
    await saveMediationUnitCode(unref(formData))
    useMessage().success('操作成功')
    await router.replace({path: '/mediation/site/unit/mediationCodeEdit', query: router.currentRoute.value.query})
  } catch (error) {

  } finally {
    loading.value = false
  }
}
onMounted(()=>{
  getSiteInfo()
})
</script>

<template>
  <a-flex justify="center" align="center">
    <div style="width: 800px;height: 100%;">
        <a-card style="height: 700px;overflow-y: auto;">
          <a-flex :gap="5" class="mb-4"  >
            <a-avatar size="large" shape=square :src="siteInfo?.applicationInfo?.icon"></a-avatar>
            <a-flex vertical >
              <a-typography-text>{{siteInfo.applicationInfo?.name}}</a-typography-text>
              <a-flex>
                <AndroidOutlined v-if="ClientPlatform.ANDROID==siteInfo?.clientPlatform" style="color: #999"/>
                <AppleOutlined v-if="ClientPlatform.IOS==siteInfo?.clientPlatform" style="color: #999"/>
                <a-typography-text type="secondary">{{siteInfo?.id}}</a-typography-text>
              </a-flex>
            </a-flex>
          </a-flex>
          <a-typography-text strong class="mt-4">添加代码位</a-typography-text  >
          <a-form layout="vertical" class="mt-4">
            <a-form-item label="广告网络" required>
              <MediationCodeCreateNetworkFromItem @on-network-change="onNetwordChange" :networks-list="siteInfo.networks" />
            </a-form-item>
            <a-form-item  required>
              <template #label>
                <a-tooltip title="SDK竞价代码位应该具备将每次展示的价格返回给聚合平台的能力。请与相应广告平台客户经理确认开通竞价功能后使用。">
                  <div>
                    <a-flex :gap="5">
                      <span>竟价类型</span>
                      <QuestionCircleOutlined/>
                    </a-flex>
                  </div>
                </a-tooltip>
              </template>
              <a-radio-group >
                <a-radio-button  style="width:100px;align-items: center;text-align: center" value="a">标准</a-radio-button>
                <a-radio-button  style="width:100px;align-items: center;text-align: center" value="b">服务端竟价</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item  required label="代码位ID">
              <a-input v-model:value="formData.code" placeholder="请输入代码位ID"/>
            </a-form-item>
            <a-form-item  v-model:value="formData.codeName"  required label="代码位名称" :rules="[{required:true,message:'内容不能为空'}]">
              <a-input placeholder="请输入代码位ID"/>
            </a-form-item>
            <a-form-item  required label="排序方式">
              <a-radio-group >
                <a-radio-button  style="width:100px;align-items: center;text-align: center" value="a">按价格</a-radio-button>
                <a-radio-button  style="width:100px;align-items: center;text-align: center" value="b">兜底</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item  required label="排序价格" :rules="[{required:true,message:'内容不能为空'}]">
              <a-input placeholder="请输入"/>
            </a-form-item>
            <a-form-item  label="排序方式">
              <template #label>
                <a-tooltip title="1.期望CPM设置后，填充率和收入将会受影响。2.每天只可设置1次期望CPM。">
                  <div>
                    <a-flex :gap="5">
                      <span>设置穿山甲期望CPM（即代码位底价）</span>
                      <QuestionCircleOutlined/>
                    </a-flex>
                  </div>
                </a-tooltip>
              </template>
              <a-radio-group >
                <a-radio-button  style="width:130px;align-items: center;text-align: center" value="a">不设置期望CPM</a-radio-button>
                <a-radio-button  style="width:130px;align-items: center;text-align: center" value="b">设置期望CPM</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item>
              <a-flex :gap="10" align="center">
                <a-input-number style="width: 260px;"></a-input-number>
                <span>人民币</span>
              </a-flex>
            </a-form-item>

            <a-form-item required>
              <template #label>
                <a-tooltip title="代码位需要满足已授权reporting API或上传API数据，且展示量超过500（无底价代码位需展示量超过1000）两个条件，否则Gromore仍会使用手动填写的代码位设价排序和计算收益">
                  <div>
                    <a-flex :gap="5">
                      <span>自动价格排序</span>
                      <QuestionCircleOutlined/>
                    </a-flex>
                  </div>
                </a-tooltip>
              </template>
              <a-switch/>
            </a-form-item>
            <a-form-item label="代码位状态">
              <a-radio-group >
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">禁用</a-radio>
              </a-radio-group>
            </a-form-item>

          </a-form>
        </a-card>
        <a-card  class="mt-4">

            <a-flex justify="flex-end" align="center" :gap="10">
              <a-button @click="router.back()"> 取消</a-button>
              <a-button :loading="loading" @click="saveForm">保存</a-button>
              <a-button type="primary">保存并继续添加</a-button>
            </a-flex>
        </a-card>
    </div>
  </a-flex>
</template>

<style scoped lang="less">

</style>