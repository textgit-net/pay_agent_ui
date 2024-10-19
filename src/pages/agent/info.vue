<script setup lang="ts">
import BasicInfo from "~/pages/agent/basicInfo.vue";
import MerchantInfo from "~/pages/agent/merchantInfo.vue";
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
        title="代理商详情"
        class="site-page-header"
        sub-title="  "
        @back="() => router.go(-1)"
        style="padding: 0;"
      >
        <template #tags>
         
        </template>
        <a-flex justify="space-between" class="not_page_tabs">
          <a-tabs  v-model:activeKey="state.activeTabKey" @tabClick="onTabClick">
            <a-tab-pane key="basicInfo"  tab="代理商信息"/>
            <a-tab-pane key="merchantInfo" tab="商户信息"/>
          </a-tabs>
        </a-flex>
      </a-page-header>

    </a-card>
    <basic-info v-show="state.activeTabKey=='basicInfo'"/>
  
    <merchant-info v-show="state.activeTabKey=='merchantInfo'">
    </merchant-info>
  </a-flex>

</template>

<style scoped lang="less">

</style>