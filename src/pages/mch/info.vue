<script setup lang="ts">
import {ContactWaySelectOption} from "~/utils/constant.ts";
import {ArrowLeftOutlined, InfoCircleOutlined} from "@ant-design/icons-vue";
import {ColumnsType} from "ant-design-vue/es/table";
import Trend from "~/pages/dashboard/analysis/trend.vue";
import ChartCard from "~/pages/dashboard/analysis/components/chart-card.vue";
import Field from "~/pages/dashboard/analysis/components/field.vue";
import {TinyArea, TinyColumn} from "@antv/g2plot";
import BasicInfo from "~/pages/mch/basicInfo.vue";
import Channels from "~/pages/mch/channels.vue";
import OrderData from "~/pages/mch/orderData.vue";
import RatesConfig from "~/pages/mch/ratesConfig.vue";
import RiskControl from "~/pages/mch/riskControl.vue";
const router=useRouter()
const state=reactive({
  isLoading:false,
  activeTabKey:'basicInfo'
})

const onTabClick=(key)=>{
 
  let query=router.currentRoute.value.query
  query['tabKey']=key
  router.replace({ query:query,replace:true})
}

</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'10px 10px 0px 10px'}">

      <a-page-header
        title="商户详情"
        class="site-page-header"
        sub-title="  "
        @back="() => router.go(-1)"
        style="padding: 0;"
      >
        <template #tags>
         
        </template>
        <a-flex justify="space-between" class="not_page_tabs">
          <a-tabs  v-model:activeKey="state.activeTabKey" @tabClick="onTabClick">
            <a-tab-pane key="basicInfo"  tab="商户信息"/>
            <a-tab-pane key="ratesConfig" tab="费率信息"/>
            <a-tab-pane key="channels" tab="渠道信息"/>
            <a-tab-pane key="orderData" tab="订单数据"/>
            <a-tab-pane key="riskControl" tab="风险监控"/>
          </a-tabs>
        </a-flex>
      </a-page-header>

    </a-card>
    <a-card :body-style="{padding:0}">
      <basic-info v-show="state.activeTabKey=='basicInfo'"/>
    </a-card>
    <channels v-show="state.activeTabKey=='channels'">
    </channels>
    <order-data v-show="state.activeTabKey=='orderData'"></order-data>
    <rates-config v-show="state.activeTabKey=='ratesConfig'"/>
    <risk-control v-show="state.activeTabKey=='riskControl'"/>
  </a-flex>

</template>

<style scoped lang="less">

</style>