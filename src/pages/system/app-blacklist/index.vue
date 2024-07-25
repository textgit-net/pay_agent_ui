<script setup lang="ts">
import AppBlacklistTabView from "~/pages/system/app-blacklist/components/app-blacklist-tab-view.vue";
import {ClientPlatform} from "~/utils/constant.ts";

onMounted(()=>{

})
</script>

<template>
  <PageContainer>
    <a-tabs>
      <a-tab-pane key="andorid" tab="ANDROID黑名单" >
        <app-blacklist-tab-view :client-platform="ClientPlatform.ANDROID" />
      </a-tab-pane >
      <a-tab-pane key="ios"  tab="IOS黑名单">
        <app-blacklist-tab-view :client-platform="ClientPlatform.IOS" />
      </a-tab-pane>
    </a-tabs>


  </PageContainer>
</template>

<style scoped lang="less">

</style>