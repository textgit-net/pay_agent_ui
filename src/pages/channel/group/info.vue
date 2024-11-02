<script setup lang="ts">
import BasicInfo from "~/pages/channel/group/basicInfo.vue";
import channelsInfo from "~/pages/channel/group/channelsInfo.vue";
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
        title="渠道组详情"
        class="site-page-header"
        sub-title="  "
        @back="() => router.go(-1)"
        style="padding: 0;"
      >
        <template #tags>
         
        </template>
        <a-flex justify="space-between" class="not_page_tabs">
          <a-tabs  v-model:activeKey="state.activeTabKey" @tabClick="onTabClick">
            <a-tab-pane key="basicInfo"  tab="渠道组信息"/>
            <a-tab-pane key="channelsInfo" tab="渠道信息"/>
          </a-tabs>
        </a-flex>
      </a-page-header>

    </a-card>
    <basic-info v-if="state.activeTabKey=='basicInfo'"/>
  
    <channels-info v-if="state.activeTabKey=='channelsInfo'" />
  </a-flex>

</template>

<style scoped lang="less">

</style>