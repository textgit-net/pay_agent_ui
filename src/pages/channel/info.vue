<script setup lang="ts">
import BasicInfo from "~/pages/channel/basicInfo.vue";
import DebtAccountInfo from "~/pages/channel/debtAccountInfo.vue";
import orderInfo from "~/pages/channel/orderInfo.vue";
import withdrawInfo from "~/pages/channel/withdrawInfo.vue";
import areaBlackList from "~/pages/channel/areaBlackList.vue";
import eventsSub from "~/pages/channel/eventsSub.vue";

const router=useRouter()
const route= useRoute()


const state=reactive({
  isLoading:false,
  activeTabKey:'basicInfo'
})

let  { tabKey } = route.query
if (tabKey) {
  state.activeTabKey = tabKey as string;
}


const initSearchParams = () => {
  delete route.query.page
  delete route.query.limit
  delete route.query.dateType
  delete route.query.startDate
  delete route.query.endDate
}

const onTabClick=(key: string)=>{
  console.log('key', key, state.activeTabKey)
  if (key != state.activeTabKey) {
    initSearchParams()
  }
  route.query['tabKey']=key

  router.replace({ query: {...route.query, timestamp: new Date().getTime()},replace:true})
}

</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'10px 10px 0px 10px'}">

      <a-page-header
        title="渠道详情"
        class="site-page-header"
        sub-title="  "
        @back="() => router.go(-1)"
        style="padding: 0;"
      >
        <template #tags>
         
        </template>
        <a-flex justify="space-between" class="not_page_tabs">
          <a-tabs  v-model:activeKey="state.activeTabKey" @tabClick="onTabClick">
            <a-tab-pane key="basicInfo" tab="渠道信息"/>
            <a-tab-pane key="channelAccountInfo" tab="渠道分账信息"/>
            <a-tab-pane key="orderInfo" tab="渠道订单信息"/>
            <a-tab-pane key="withdrawInfo" tab="渠道提现信息"/>
            <a-tab-pane key="areaBlackList" tab="渠道地区权限"/>
            <!-- <a-tab-pane key="eventsSub" tab="渠道事件订阅"/> -->
          </a-tabs>
        </a-flex>
      </a-page-header>

    </a-card>
    <basic-info v-if="state.activeTabKey=='basicInfo'"/>
  
    <debt-account-info v-if="state.activeTabKey=='channelAccountInfo'">
    </debt-account-info>

    <order-info v-if="state.activeTabKey=='orderInfo'"></order-info>
    <withdraw-info v-if="state.activeTabKey=='withdrawInfo'"></withdraw-info>
    <areaBlackList v-if="state.activeTabKey=='areaBlackList'"></areaBlackList>
    <!-- <eventsSub v-if="state.activeTabKey=='eventsSub'"></eventsSub> -->
  </a-flex>

</template>

<style scoped lang="less">

</style>