<script setup lang="ts">

import CodeGroupPanel from "~/pages/mediation/unitCode/components/code-group-panel.vue";
import {getMediationUnitInfo, MediationUnitInfoResponse} from "~/api/mediationSiteUnit.ts";
const router=useRouter()
const isLoadUnitInfo=ref(true)
const currentUnitId=ref(null)
const currentSiteId=ref(null)
const currentNetworkId=ref<number>(null)
const mediationUnitInfo=reactive<MediationUnitInfoResponse>({
  segments:[]
})
const loadUnitInfo=async ()=>{
  isLoadUnitInfo.value=true
  let res=await getMediationUnitInfo(unref(currentUnitId))
  Object.assign(mediationUnitInfo,res.data??{})
  isLoadUnitInfo.value=false
}
watch(router.currentRoute, (route) => {
  let {unitId,siteId,networkId} = router.currentRoute?.value?.query
  let oldParams=`${currentUnitId.value}:${currentSiteId.value}:${currentNetworkId.value}`
  if(unitId){
    currentUnitId.value=Number.parseInt(`${unitId}`)
  }
  if(siteId){
    currentSiteId.value=Number.parseInt(`${siteId}`)
  }
  if(networkId){
    currentNetworkId.value=Number.parseInt(`${networkId}`)
  }
  let newParams=`${currentUnitId.value}:${currentSiteId.value}:${currentNetworkId.value}`
  if(unitId && siteId && oldParams!=newParams){
    loadUnitInfo()
  }
})
onMounted(()=>{
  let {unitId,siteId,networkId} = router.currentRoute?.value?.query
  if(unitId){
    currentUnitId.value=Number.parseInt(`${unitId}`)
  }
  if(siteId){
    currentSiteId.value=Number.parseInt(`${siteId}`)
  }
  if(networkId){
    currentNetworkId.value=Number.parseInt(`${networkId}`)
  }
  if(unitId && siteId){
    loadUnitInfo()
  }
})
</script>

<template>
  <a-spin :spinning="isLoadUnitInfo" style="min-height: 600px">
    <div class="card-container" >
      <a-tabs type="card" class="mt-4" :tab-bar-gutter="0">
        <a-tab-pane  :key="item.id"  v-for="(item) in mediationUnitInfo.segments" :closable="false" >
          <template #tab>
            <div style="width: 132px;">
              <span>{{item.name}}</span>
            </div>
          </template>
          <CodeGroupPanel :unit-id="currentUnitId" :segment-id="item.id" :network="currentNetworkId"  />
        </a-tab-pane>

      </a-tabs>
    </div>
  </a-spin>
</template>

<style scoped lang="less">

</style>