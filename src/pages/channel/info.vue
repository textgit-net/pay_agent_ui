<script setup lang="ts">
import BasicInfo from "~/pages/channel/basicInfo.vue";
import DebtAccountInfo from "~/pages/channel/debtAccountInfo.vue";
import orderInfo from "~/pages/channel/orderInfo.vue";
const router=useRouter()
const route= useRoute()
const state=reactive({
  isLoading:false,
  activeTabKey:'basicInfo'
})

const onTabClick=(key: string)=>{
  route.query['tabKey']=key
  console.log('route.query', route.query, route.path, router)
  router.replace({ path: route.path,query: route.query,replace:true})
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
            <a-tab-pane key="basicInfo"  tab="渠道信息"/>
            <a-tab-pane key="channelAccountInfo" tab="渠道分账信息"/>
            <a-tab-pane key="orderInfo" tab="渠道订单信息"/>
          </a-tabs>
        </a-flex>
      </a-page-header>

    </a-card>
    <basic-info v-if="state.activeTabKey=='basicInfo'"/>
  
    <debt-account-info v-show="state.activeTabKey=='channelAccountInfo'">
    </debt-account-info>

    <order-info v-show="state.activeTabKey=='orderInfo'"></order-info>
  </a-flex>

</template>

<style scoped lang="less">

</style>