<script setup lang="ts">
import {MoreOutlined,DownOutlined, FireFilled, PlusOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {ColumnsType} from "ant-design-vue/es/table";
import {fetchGamePlatform, GamePlatformResponse, OpenGamePlatform} from "~/api/task/gameTask.ts";
import {CommonEnable} from "~/utils/constant.ts";
const columns:ColumnsType =[
  {
    title: '名称',
    dataIndex: 'name',
    align:'left',
    fixed:'left',
    ellipsis:true,
  },
  {
    title: '佣金费率',
    align:'left',
    dataIndex: 'commissionRates',
  },
  {
    title: '应用信息',
    align:'left',
    width:'350px',
    dataIndex: 'appInfo',
  },
  {
    title: '是否合作',
    align:'center',
    dataIndex: 'isEnable',
  }
]

const dataSource=shallowRef<GamePlatformResponse[]>([])
const state=reactive<{
  dataSourceLoading:boolean,
  isShowOpenGamePlatform:boolean,
  currentRecord?:GamePlatformResponse
}
  >({
  dataSourceLoading:false,
  isShowOpenGamePlatform:false,
  currentRecord:null
})

const openGamePlatformFromData=reactive<OpenGamePlatform>(<OpenGamePlatform>{})
const loadData=async ()=>{
   state.dataSourceLoading=true
   let result=await fetchGamePlatform()
   dataSource.value=result.data??[]
   state.dataSourceLoading=false

}

const router=useRouter();

onMounted(()=>{
  loadData()
})

</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>游戏GPL变现渠道管理</a-typography-text>
      </a-flex>
    </a-card>

    <a-card :body-style="{'padding':'0px'}">

      <a-table  class="" :scroll="{x: 'max-content'}" :bordered="false" :data-source="dataSource" :pagination="false" :loading="state.dataSourceLoading"  :columns="columns" size="middle" >
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex==='commissionRates'">
            <a-typography-text v-if="record.isEnable===CommonEnable.DISABLE">--</a-typography-text>
            <a-typography-text v-if="record.isEnable===CommonEnable.OPEN">{{record.commissionRates}}</a-typography-text>
          </template>
          <template v-if="column.dataIndex==='appInfo'">
            <template  v-if="record.isEnable===CommonEnable.OPEN">
              <a-flex  :gap="10"  justify="flex-start">
                <a-flex :gap="5">
                  <a-typography-text >APPID:</a-typography-text>
                  <a-typography-text type="secondary">{{record.appId}}</a-typography-text>
                </a-flex>
                <a-flex :gap="5">
                  <a-typography-text >APP_KEY:</a-typography-text>
                  <a-typography-text type="secondary">{{record.appKey}}</a-typography-text>
                </a-flex>
              </a-flex>
            </template>
            <a-typography-text v-if="record.isEnable===CommonEnable.DISABLE">--</a-typography-text>
          </template>
          <template v-if="column.dataIndex === 'isEnable'">
            <a-switch  :checked="record.isEnable"  :un-checked-value="CommonEnable.DISABLE"  :checked-value="CommonEnable.OPEN" ></a-switch>
          </template>

        </template>
      </a-table>
    </a-card>
    <a-modal centered :title="`启用（${state.currentRecord?.name}）`" v-model:open="state.isShowOpenGamePlatform">
      <a-form :model="openGamePlatformFromData">
          <a-form-item name="appId" title="APP ID" required>
            <a-input v-model:vaule="openGamePlatformFromData.appId" placeholder="请输入appId"></a-input>
          </a-form-item>
        <a-form-item name="appKey" title="APP KEY" required>
          <a-input v-model:vaule="openGamePlatformFromData.appKey" placeholder="请输入app key"></a-input>
        </a-form-item>
        <a-form-item name="appKey" title="APP KEY" required>
          <a-input-number v-model:vaule="openGamePlatformFromData.appKey" placeholder="请输入佣金比率"   :step="1"></a-input-number>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-flex>
</template>

<style scoped lang="less">

</style>