<script setup lang="ts">
import BasicInfo from "~/pages/account/center/basicInfo.vue";
import RatesConfig from "@/pages/account/center/ratesConfig.vue";
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
        title="个人中心"
        class="site-page-header"
        sub-title="  "
        style="padding: 0;"
      >
        <template #tags>
         
        </template>
        <a-flex justify="space-between" class="not_page_tabs">
          <a-tabs v-model:activeKey="state.activeTabKey" @tabClick="onTabClick">
            <a-tab-pane key="basicInfo"  tab="账号信息"/>
            <a-tab-pane key="ratesConfig" tab="支付产品"/>
          </a-tabs>
        </a-flex>
      </a-page-header>

    </a-card>
    <basic-info v-show="state.activeTabKey=='basicInfo'"/>
  
    <rates-config v-show="state.activeTabKey=='ratesConfig'">
    </rates-config>
  </a-flex>

</template>

<style scoped lang="less">

</style>