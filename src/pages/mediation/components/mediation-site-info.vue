<script setup lang="ts">
import {
  AndroidOutlined, ArrowUpOutlined, DownOutlined,
  FieldTimeOutlined,
  AppleOutlined,
  MoreOutlined,
  NodeExpandOutlined,
  PlusOutlined, QuestionCircleOutlined
} from "@ant-design/icons-vue";
import {getMediationSiteInfo, MediationSiteInfo} from "~/api/mediationSite.ts";
import {ColumnsType} from "ant-design-vue/es/table";
import {ClientPlatform, MediationNetworkType, MediationSiteStatus} from "~/utils/constant.ts";
import MediationSiteNetworkItem from "~/pages/mediation/components/mediation-site-network-item.vue";
import MediationSiteUnitTable from "~/pages/mediation/components/mediation-site-unit-table.vue";
const props = defineProps({
  appId: {
    type: Number,
    required: false,
    default:null
  }
})
const state=reactive({
  isLoading:false,
  isShowAddNetworkModal:false,
})
const mediationSiteInfo=reactive<MediationSiteInfo>({})


const getInfo=async (appId:number)=>{
  state.isLoading=true
  let res=await  getMediationSiteInfo(appId)
  Object.assign(mediationSiteInfo,res.data??[])
  state.isLoading=false
}

watch(()=>props.appId,(newValue,oldValue)=>{
  getInfo(newValue)
})

const csjSiteNetwork=computed(()=> mediationSiteInfo.networks?.find(v=>v.network.type==MediationNetworkType.CSJ))
const gdtSiteNetwork=computed(()=> mediationSiteInfo.networks?.find(v=>v.network.type==MediationNetworkType.GDT))
const sigMobSiteNetwork=computed(()=> mediationSiteInfo.networks?.find(v=>v.network.type==MediationNetworkType.SIG_MOB))
const baiduSiteNetwork=computed(()=> mediationSiteInfo.networks?.find(v=>v.network.type==MediationNetworkType.BAIDU_MOB))
const klevinSiteNetwork=computed(()=> mediationSiteInfo.networks?.find(v=>v.network.type==MediationNetworkType.K_LEVIN))
const unitySiteNetwork=computed(()=> mediationSiteInfo.networks?.find(v=>v.network.type==MediationNetworkType.UNITY))
const adMobSiteNetwork=computed(()=> mediationSiteInfo.networks?.find(v=>v.network.type==MediationNetworkType.AD_MOB))
const adScopeMobSiteNetwork=computed(()=> mediationSiteInfo.networks?.find(v=>v.network.type==MediationNetworkType.AD_SCOPE))
onMounted(()=>{
  getInfo(props.appId)
})
const appTitle=computed(()=>{
  if(mediationSiteInfo.id==null){
    return ""
  }
  return `${mediationSiteInfo.applicationInfo?.name??""}_${mediationSiteInfo.clientPlatform?.toLowerCase()??""}`
})
</script>

<template>
  <a-skeleton :loading="state.isLoading">
    <a-flex vertical v-if="mediationSiteInfo.id!=null" >
      <!--应用信息-->
      <a-card>
        <a-flex  :gap="10" align="center" justify="space-between">
          <a-flex :gap="10">
            <a-avatar size="large" shape="square" :src="mediationSiteInfo.applicationInfo?.icon"></a-avatar>
            <a-flex vertical :gap="0">
              <span style="font-size: 14px;color: #333;font-weight: bold">{{appTitle}}</span>
              <a-flex :gap="10" style="font-size: 12px;color: #969aa0;">
                <div>
                  <AndroidOutlined v-if="ClientPlatform.ANDROID==mediationSiteInfo.clientPlatform"/>
                  <AppleOutlined v-else/>
                  <span >{{mediationSiteInfo.applicationInfo?.id}}</span>
                </div>
                <span>创建时间: {{mediationSiteInfo.createTime}}</span>
                <span>下方只展示昨日数据，可前往数据报表查看更多数据</span>
              </a-flex>
            </a-flex>
          </a-flex>
          <MoreOutlined />
        </a-flex>
        <!--报表数据汇总-->
        <a-flex   class="report-warp mt-4">
          <a-flex vertical style="flex: 1" :gap="20">
            <a-flex vertical>
              <div><span class="des-text">DAU</span> <QuestionCircleOutlined  class="des-text ml-2"/></div>
              <a-typography-text strong>13</a-typography-text>
              <div>
                <span class="data-text up"><ArrowUpOutlined/> 333.33%</span>
                <span class="des-text ml-2" >环比</span>
              </div>
            </a-flex>
            <a-flex vertical>
              <div><span class="des-text">展示/DAU</span> <QuestionCircleOutlined  class="des-text ml-2"/></div>
              <a-typography-text strong>13</a-typography-text>
              <div>
                <span class="data-text up"><ArrowUpOutlined/> 333.33%</span>
                <span class="des-text ml-2" >环比</span>
              </div>
            </a-flex>
          </a-flex>
          <a-flex vertical style="flex: 1" :gap="20">
            <a-flex vertical>
              <div><span class="des-text">预估收益(¥)</span> <QuestionCircleOutlined  class="des-text ml-2"/></div>
              <a-typography-text strong>13</a-typography-text>
              <div>
                <span class="data-text up"><ArrowUpOutlined/> 333.33%</span>
                <span class="des-text ml-2" >环比</span>
              </div>
            </a-flex>
            <a-flex vertical>
              <div><span class="des-text">流量填充率</span> <QuestionCircleOutlined  class="des-text ml-2"/></div>
              <a-typography-text strong>13</a-typography-text>
              <div>
                <span class="data-text up"><ArrowUpOutlined/> 333.33%</span>
                <span class="des-text ml-2" >环比</span>
              </div>
            </a-flex>
          </a-flex>
          <a-flex vertical style="flex: 1" :gap="20">
            <a-flex vertical>
              <div><span class="des-text">ARPDAU</span> <QuestionCircleOutlined  class="des-text ml-2"/></div>
              <a-typography-text strong>13</a-typography-text>
              <div>
                <span class="data-text up"><ArrowUpOutlined/> 333.33%</span>
                <span class="des-text ml-2" >环比</span>
              </div>
            </a-flex>
            <a-flex vertical>
              <div><span class="des-text">渗透率</span> <QuestionCircleOutlined  class="des-text ml-2"/></div>
              <a-typography-text strong>13</a-typography-text>
              <div>
                <span class="data-text down"><ArrowUpOutlined/> 333.33%</span>
                <span class="des-text ml-2" >环比</span>
              </div>
            </a-flex>
          </a-flex>
          <a-flex justify="flex-end" style="flex: 1" :gap="20">
            <a-button type="link"><FieldTimeOutlined/>查看更多数据指标</a-button>
          </a-flex>
        </a-flex>
        <!--应用广告网络-->
        <a-flex  vertical class="report-warp mt-4">
          <a-flex justify="space-between">
            <a-typography-text>广告网络 &nbsp;&nbsp;({{mediationSiteInfo.networks.length}})</a-typography-text>

          </a-flex>
          <a-flex :gap="10">
            <MediationSiteNetworkItem
                @ok="getInfo(appId)"
                :site-id="mediationSiteInfo.id"
                :network-type="MediationNetworkType.CSJ"
                :company-id="mediationSiteInfo.applicationInfo?.company?.id"
                :value="csjSiteNetwork"/>
            <MediationSiteNetworkItem
                @ok="getInfo(appId)"
                :site-id="mediationSiteInfo.id"
                :network-type="MediationNetworkType.GDT"
                :company-id="mediationSiteInfo.applicationInfo?.company?.id"
                :value="gdtSiteNetwork"/>
            <MediationSiteNetworkItem
                @ok="getInfo(appId)"
                :site-id="mediationSiteInfo.id"
                :network-type="MediationNetworkType.SIG_MOB"
                :company-id="mediationSiteInfo.applicationInfo?.company?.id"
                :value="sigMobSiteNetwork"/>
            <MediationSiteNetworkItem
                @ok="getInfo(appId)"
                :site-id="mediationSiteInfo.id"
                :network-type="MediationNetworkType.BAIDU_MOB"
                :company-id="mediationSiteInfo.applicationInfo?.company?.id"
                :value="baiduSiteNetwork"/>
            <MediationSiteNetworkItem
                @ok="getInfo(appId)"
                :site-id="mediationSiteInfo.id"
                :network-type="MediationNetworkType.UNITY"
                :company-id="mediationSiteInfo.applicationInfo?.company?.id"
                :value="unitySiteNetwork"/>
            <MediationSiteNetworkItem
                @ok="getInfo(appId)"
                :site-id="mediationSiteInfo.id"
                :network-type="MediationNetworkType.AD_MOB"
                :company-id="mediationSiteInfo.applicationInfo?.company?.id"
                :value="adMobSiteNetwork"/>
          </a-flex>
        </a-flex>
      </a-card>
      <MediationSiteUnitTable v-if="mediationSiteInfo.id" :site-info="mediationSiteInfo"/>
    </a-flex>
  </a-skeleton>

</template>

<style scoped lang="less">

</style>