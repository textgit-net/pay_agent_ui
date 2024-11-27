<script setup lang="ts">
import eventsSub from "~/pages/system/bot/eventsSub.vue";

const router=useRouter()
const route= useRoute()


const state=reactive({
  isLoading:false,
  activeTabKey:'eventsSub'
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
        title="机器人"
        class="site-page-header"
        sub-title="  "
        style="padding: 0;"
      >
        <template #tags>
         
        </template>
        <a-flex justify="space-between" class="not_page_tabs">
          <a-tabs  v-model:activeKey="state.activeTabKey" @tabClick="onTabClick">
            <a-tab-pane key="eventsSub" tab="Telegram群组&渠道消息订阅"/>
          </a-tabs>
        </a-flex>
      </a-page-header>

    </a-card>
    <eventsSub v-if="state.activeTabKey=='eventsSub'"></eventsSub>
  </a-flex>

</template>

<style scoped lang="less">

</style>