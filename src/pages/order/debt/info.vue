<script setup lang="ts">
import BasicInfo from "@/pages/order/debt/baseInfo.vue";
import OrderInfo from "@/pages/order/debt/orderInfo.vue";

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


const onTabClick=(key: string)=>{
  route.query['tabKey']=key
  router.replace({ query: {...route.query, timestamp: new Date().getTime()},replace:true})
}

</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'10px 10px 0px 10px'}">

      <a-page-header
        title="分账单详情"
        class="site-page-header"
        sub-title="  "
        @back="() => router.go(-1)"
        style="padding: 0;"
      >
        <template #tags>
         
        </template>
        <a-flex justify="space-between" class="not_page_tabs">
          <a-tabs  v-model:activeKey="state.activeTabKey" @tabClick="onTabClick">
            <a-tab-pane key="basicInfo" tab="分账单信息"/>
            <a-tab-pane key="orderInfo" tab="分账订单详细"/>
          </a-tabs>
        </a-flex>
      </a-page-header>

    </a-card>
    <basic-info v-if="state.activeTabKey=='basicInfo'"/>
    <order-info v-if="state.activeTabKey=='orderInfo'"></order-info>
  </a-flex>

</template>

<style scoped lang="less">

</style>