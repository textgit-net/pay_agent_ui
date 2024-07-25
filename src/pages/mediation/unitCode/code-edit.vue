<script setup lang="ts">
import CodeEditHead from "~/pages/mediation/unitCode/components/code-edit-head.vue";
import CodeGroupPanel from "~/pages/mediation/unitCode/components/code-group-panel.vue";
import {getMediationUnitInfo, MediationUnitInfoResponse} from "~/api/mediationSiteUnit.ts";

const unitId=ref(null)
const siteId=ref(null)
const networkId=ref(null)
const isLoadData=ref(false)
const isLoadUnitInfo=ref(false)
const mediationUnitInfo=reactive<MediationUnitInfoResponse>({
  segments:[]
})
const loadUnitInfo=async ()=>{
  isLoadUnitInfo.value=true
  let res=await getMediationUnitInfo(unref(unitId))
  Object.assign(mediationUnitInfo,res.data??{})
  isLoadUnitInfo.value=false
}
const onSiteChange=(v:any)=>{
  siteId.value=v
}
const onNetworkChange=(v:any)=>{
  networkId.value=v
}
const onUnitChange=(v:any)=>{
  unitId.value=v
  loadUnitInfo()
}

onMounted(()=>{
})
</script>

<template>

  <a-flex vertical style="width: 100%;height: 100%">
    <a-flex v-show="!isLoadData"  style="width: 100%;height: 100%" justify="center" align="center">
      <a-spin/>
    </a-flex>
    <div v-show="isLoadData" vertical style="width: 100%">
      <CodeEditHead
          @on-site-change="onSiteChange"
          @on-network-change="onNetworkChange"
          @on-unit-change="onUnitChange"
          @on-data-load-end="isLoadData=true"/>
      <router-view/>
<!--      <a-spin :spinning="isLoadUnitInfo">-->
<!--        <div class="card-container" >-->
<!--          <a-tabs type="card" class="mt-4" :tab-bar-gutter="0">-->
<!--            <a-tab-pane  :key="item.id"  v-for="(item) in mediationUnitInfo?.segments??[]" :closable="false" >-->
<!--              <template #tab>-->
<!--                <div style="width: 132px;">-->
<!--                  <span>{{item.name}}</span>-->
<!--                </div>-->
<!--              </template>-->
<!--              <CodeGroupPanel :unit-id="unitId" :segment-id="networkId" :segmentId="item.id" />-->
<!--            </a-tab-pane>-->

<!--          </a-tabs>-->
<!--        </div>-->
<!--      </a-spin>-->
    </div>
  </a-flex>

</template>

<style scoped lang="less">



</style>