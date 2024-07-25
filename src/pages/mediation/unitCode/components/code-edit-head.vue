<script  setup lang="ts">
import {AndroidOutlined,CopyOutlined, AppleOutlined,SearchOutlined, AppstoreFilled, ArrowLeftOutlined, DownOutlined} from "@ant-design/icons-vue";
import {getSiteList, MediationSite, MediationSiteSearch} from "~/api/mediationSite.ts";
import {getMediationUnitList, MediationUnitListResponse, MediationUnitSearch} from "~/api/mediationSiteUnit.ts";
import {getMediationSiteNetworkList, MediationSiteNetworkListResponse} from "~/api/mediatonSiteNetwork.ts";
import {ClientPlatform} from "~/utils/constant.ts";
import SiteSelectItem from "~/pages/mediation/components/site-select-item.vue";
import useClipboard from 'vue-clipboard3'
import {ColumnsType} from "ant-design-vue/es/table";
const columns:ColumnsType =[
  {
    title: 'app',
    dataIndex: 'app',
  }
]
const emits = defineEmits(["onUnitChange","onSiteChange","onNetworkChange","onDataLoadEnd"])
const router=useRouter()
const siteList=shallowRef<MediationSite[]>([])
const siteSearch=reactive<MediationSiteSearch>({})
const unitList=shallowRef<MediationUnitListResponse[]>([])
const unitSearch=reactive<MediationUnitSearch>({})
const networkList=shallowRef<MediationSiteNetworkListResponse[]>([])
const currentSiteId=ref<number>(null)
const currentUnitId=ref<number>(null)
const currentNetworkId=ref<number>(null)
const { toClipboard } = useClipboard()

const copy = async (data:string) => {
  try {
    await toClipboard(data)
    useMessage().success("复制成功")
  } catch (e) {
    useMessage().error("复制失败")
  }
}
const loadSiteData=async ()=>{
  let res=await getSiteList(siteSearch)
  siteList.value=res.data??[]
  let sitesUnRef=unref(siteList)
  if(currentSiteId.value==null && sitesUnRef.length>0){
    currentSiteId.value=sitesUnRef[0].id
  }

}

const loadUnitData=async ()=>{
  unitSearch.siteId=unref(currentSiteId)
  let res=await getMediationUnitList(unitSearch)
  unitList.value=res.data??[]
  if(currentUnitId.value==null){
    currentUnitId.value=unref(unitList)[0].id
  }

}

const loadNetworkData=async ()=>{
  let res=await getMediationSiteNetworkList(unref(currentSiteId))
  networkList.value=res.data??[]
  currentNetworkId.value=null


}

const siteMenuIsVisible=ref(false)
const siteUnitIsVisible=ref(false)
const networkIsVisible=ref(false)
const currentSite=computed(()=>unref(siteList).find(v=>v.id==currentSiteId.value))

const currentUnit=computed(()=>unref(unitList).find(v=>v.id==currentUnitId.value))

const currentNetWork=computed(()=>unref(networkList).find(v=>v.id==currentNetworkId.value))


const onSiteItemClick=async (v:MediationSite)=>{
  currentSiteId.value=v.id
  siteMenuIsVisible.value=false
  currentUnitId.value=null
  currentNetworkId.value=null
  await loadUnitData()
  await loadNetworkData()
  let query={
    "siteId": unref(currentSiteId),
    "unitId": unref(currentUnitId),
  }
  await router.replace({path: router.currentRoute.value.path, query: query})

}
const onUnitItemClick=async (v:MediationUnitListResponse)=>{
  currentUnitId.value=v.id
  siteUnitIsVisible.value=false
  currentNetworkId.value=null
  await loadNetworkData()
  let query={
    "siteId": unref(currentSiteId),
    "unitId": unref(currentUnitId)
  }
  await router.replace({path: router.currentRoute.value.path, query: query})

}
const onNetworkItemClick=(v:MediationSiteNetworkListResponse)=>{
  currentNetworkId.value=v.id
  networkIsVisible.value=false
  let query={
    "siteId": unref(currentSiteId),
    "unitId": unref(currentUnitId)
  }
  if(currentNetworkId.value!=null){
    query["networkId"]= unref(currentNetworkId)
  }
  router.replace({path: router.currentRoute.value.path, query: query})
  // emits("onNetworkChange",unref(currentNetworkId))
}

const loadData=async (isReplace:boolean)=>{
    await loadSiteData()
    await loadUnitData()
    await loadNetworkData()
    if(isReplace){
      let query={
        "siteId": unref(currentSiteId),
        "unitId": unref(currentUnitId)
      }
      if(currentNetworkId.value!=null){
        query["networkId"]= unref(currentNetworkId)
      }
      await router.replace({path: router.currentRoute.value.path, query: query})
    }
    emits("onDataLoadEnd")
    // emits("onSiteChange",unref(currentSiteId))
    // emits("onUnitChange",unref(currentUnitId))
    // emits("onNetworkChange",unref(currentNetworkId))
}
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
    loadData(false);
  }else {
    loadData(true);
  }

})
</script>

<template>
<div>
  <a-card :body-style="{padding:'15px 15px'}">
    <a-flex>
      <a  @click="router.back()"   style="font-size: 16px;font-weight: 600;color: #333"><ArrowLeftOutlined class="mr-1"/> 瀑布流管理</a>
    </a-flex>
  </a-card>
  <a-card class="mt-4" :body-style="{padding:'15px 15px'}">
    <a-flex :gap="10" align="center" >
      <a-tooltip color="white">
        <template #title >
          <a-flex vertical>
              <a-flex :gap="5">
                <a-typography-text type="secondary">App Id：</a-typography-text>
                <a-typography-text >{{ currentSite?.applicationInfo?.id}}</a-typography-text>
                <CopyOutlined style="color:blue;" @click="copy(`${currentSite?.applicationInfo?.id}`)"></CopyOutlined>
              </a-flex>
             <a-typography-text >{{ currentSite?.name }} | {{currentSite?.id}}</a-typography-text>
          </a-flex>
        </template>
        <a-dropdown @click="siteMenuIsVisible=true" :visible="siteMenuIsVisible" :trigger="['click']">
          <div>
            <a-flex :gap="5" style="cursor: pointer; width: 247px;background:#f8f8f9;border: none;border-radius: 4px;padding-bottom: 4px;padding-top: 4px;padding-left: 12px;padding-right: 12px;">
              <a-typography-text strong>应用:</a-typography-text>
              <AndroidOutlined v-if="ClientPlatform.ANDROID==currentSite?.clientPlatform" style="color: #999"/>
              <AppleOutlined v-if="ClientPlatform.IOS==currentSite?.clientPlatform" style="color: #999"/>
              <a-flex :gap="5" style="flex: 1">
                <a-typography-text type="secondary" style="max-width: 75px" :ellipsis="true" :content="currentSite?.name"></a-typography-text>
                <a-typography-text type="secondary">| {{currentSite?.id}}</a-typography-text>
              </a-flex>
              <DownOutlined style="font-size: 10px;color: #999"/>
            </a-flex>
          </div>
          <template #overlay>
            <div style="background: white;" :body-style="{padding:'0'}">
              <a-input :bordered="false" placeholder="请输入">
                <template #prefix><SearchOutlined /></template>
              </a-input>
              <a-divider style="margin: 0"/>

              <a-menu  class="card-select-menu" style="height: 247px;overflow-y: auto;overflow-x: auto" >
                <a-menu-item v-for="(item) in siteList"   @click="onSiteItemClick(item)" :key="item.id">
                  <SiteSelectItem    :value="item" :is-select="item.id==currentSite?.id"/>
                </a-menu-item>
              </a-menu>
            </div>
          </template>
        </a-dropdown>
      </a-tooltip>
      <a-tooltip >
        <template #title>
          <span>{{ currentUnit?.name }} | {{currentUnit?.id}}</span>
        </template>
        <div>
          <a-flex :gap="5" style="cursor: pointer; width: 247px;background:#f8f8f9;border: none;border-radius: 4px;padding-bottom: 4px;padding-top: 4px;padding-left: 12px;padding-right: 12px;">
            <a-typography-text strong>广告位:</a-typography-text>
            <a-flex :gap="5" style="flex: 1">
              <a-typography-text strong  style="max-width: 75px"  :ellipsis="true" :content="currentUnit?.name"></a-typography-text>
              <a-typography-text type="secondary">| {{currentUnit?.id}}</a-typography-text>
            </a-flex>
            <DownOutlined style="font-size: 10px;color: #999"/>
          </a-flex>
        </div>
      </a-tooltip>
      <a-tooltip >
        <template #title>
          <span>1| 6575545</span>
        </template>
        <div>
          <a-flex :gap="5" style="cursor: pointer; width: 247px;background:#f8f8f9;border: none;border-radius: 4px;padding-bottom: 4px;padding-top: 4px;padding-left: 12px;padding-right: 12px;">
            <a-typography-text strong>广告网络:</a-typography-text>
            <a-flex :gap="5" style="flex: 1">
              <AppstoreFilled style="color: #2a55e5"/>
              <a-typography-text type="secondary"  style="max-width: 75px"  :ellipsis="true" content="全部"></a-typography-text>
            </a-flex>
            <DownOutlined style="font-size: 10px;color: #999"/>
          </a-flex>
        </div>
      </a-tooltip>
      <a-tooltip >
        <template #title>
          <span>禁用广告位</span>
        </template>
        <a-switch></a-switch>
      </a-tooltip>
      <a-button style="height: 32px">高级工具  <DownOutlined style="font-size: 10px;"/></a-button>
      <a-button style="height: 32px" >更多操作  <DownOutlined style="font-size: 10px;"/></a-button>
    </a-flex>
  </a-card>
</div>
</template>

<style scoped lang="less">

</style>