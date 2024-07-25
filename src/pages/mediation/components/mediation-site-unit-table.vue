<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import dayjs from "dayjs";
import {
  createMediationUnit,
  CreateMediationUnitFrom,
  MediationUnitResponse,
  MediationUnitSearch,
  searchMediationUnit
} from "~/api/mediationSiteUnit.ts";
import {PaginationProps} from "ant-design-vue";
import {
  ClientPlatform,
  MediationSiteCodeType,
  MediationSiteCodeTypeSelectOption,
  MediationSiteStatus
} from "~/utils/constant.ts";
import {AndroidOutlined,NodeExpandOutlined,DownOutlined, AppleOutlined,CloseOutlined} from "@ant-design/icons-vue";
import {MediationSiteInfo} from "~/api/mediationSite.ts";

const props = defineProps({
  siteInfo: {
    type: Object,
    required: true
  }
})
const columns:ColumnsType =[
  {
    title: '广告位名称',
    showSorterTooltip:false,
    sorter:true,
    dataIndex: 'name',
  },
  {
    title: '广告位类型',
    sorter:true,
    showSorterTooltip:false,
    dataIndex: 'typeText',
  },
  {
    title:'状态',
    showSorterTooltip:false,
    dataIndex: 'status'
  },
  {
    title:'DAU',
    align:'right',
    sorter:true,
    showSorterTooltip:{
      title:'每天打开应用的独立用户数'
    },
    dataIndex: 'dau',
  },
  {
    title:'预估收益(¥)',
    sorter:true,
    align:'right',
    showSorterTooltip:{
      title: '标准代码位预估收益=SUM(瀑布流中设置的期望CPM*统计的展示/1000），竞价代码位预估收益=SUM(每次展示对应的实时价格)',
    },
    dataIndex: 'revenue',
  },
  {
    title:'ARPDAU',
    sorter:true,
    align:'right',
    showSorterTooltip:{
      title: '人均收益, ARPDAU=收益/DAU'
    },
    dataIndex: 'arPuDau',
  },
  {
    title:'展示/DAU',
    sorter:true,
    align:'right',
    showSorterTooltip:{
      title: '人均展示次数，IPU=展示/DAU'
    },
    dataIndex: 'apiIPU',
  },
  {
    title:'流量填充率',
    align:'right',
    showSorterTooltip:{
      title: '发送请求后，返回成功次数的占比'
    },
    sorter:true,
    dataIndex: 'waterfallSr',
  },
  {
    title:'渗透率',
    align:'right',
    showSorterTooltip:{
      title: '观看过广告的用户占比，渗透率=DEU/DAU'
    },
    sorter:true,
    dataIndex: 'appEngagementRate',
  },
  {
    title:'操作',
    dataIndex: 'action',
  }
]
type RangeValue = [dayjs.Dayjs, dayjs.Dayjs];
const dateRange = ref<RangeValue>([dayjs(),dayjs()]);
const rangePresets = ref([
  { label: '今日', value: [dayjs(), dayjs()] },
  { label: '昨日', value: [dayjs().add(-1,'d'), dayjs().add(-1,'d')] },
  { label: '近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '近30天', value: [dayjs().add(-30, 'd'), dayjs()] }
]);
const state=reactive({
  isLoading:false,
  isShowCreateModal:false,
  isSaveLoading:false
})
const search=reactive<MediationUnitSearch>(<MediationUnitSearch>{
  siteId: 0,
  page:1,
  limit:10,
  codeType:null
})
const pagination = reactive<PaginationProps>({
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30', '40'],
  current: 1,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: total => `总数据位：${total}`,
  onChange(current, pageSize) {
    pagination.pageSize = pageSize
    pagination.current = current
    getUnits()
  },
})
const dataSource=shallowRef<MediationUnitResponse[]>([])
const resetUnitSearchParams=()=>{
  Object.assign(search,{
    siteId: props.siteInfo?.id,
    page:1,
    limit:10,
    codeType:null
  })
}
const onCodeTypeChange=()=>{
  Object.assign(search,{
    page:1,
    limit:10,
  })
  getUnits()
}
const getUnits=async ()=>{
  if(props.siteInfo==null){
    resetUnitSearchParams()
    dataSource.value=[]
    return
  }
  state.isLoading=true
  let res=await searchMediationUnit(search)
  dataSource.value=res.data?.rows??[]
  pagination.total = res.data?.total ?? 0
  state.isLoading=false
}
const appTitle=computed(()=>{
  if(props.siteInfo.id==null){
    return ""
  }
  return `${props.siteInfo.applicationInfo?.name??""}_${props.siteInfo.clientPlatform?.toLowerCase()??""}`
})
const createFromList=ref<CreateMediationUnitFrom[]>([{
  isNeedServiceVerify:false
}])
const showCrateModal=()=>{
  createFromList.value=([{
    isNeedServiceVerify:false
  }])
  state.isShowCreateModal=true
}
const addUnit=()=>{
  let old=JSON.parse(JSON.stringify(createFromList.value))
  old.push({
    isNeedServiceVerify:false
  })
  createFromList.value=old
}
const saveUnit=async ()=>{
  try {
     state.isSaveLoading=true
     await createMediationUnit({
       siteId:props.siteInfo.id,
       units:unref(createFromList)
     })
     await getUnits()
     state.isSaveLoading=false
     state.isShowCreateModal=false;
     useMessage().success("添加成功")
  }catch (e){
    useMessage().error(e)
    state.isSaveLoading=false
  }
}
const removeUnit=(index:number)=>{
  let old=JSON.parse(JSON.stringify(createFromList.value))
  old.splice(index,1)
  createFromList.value=old
}
watch(()=>props.siteInfo,()=>{
  resetUnitSearchParams()
  getUnits()
})
onMounted(()=>{
  resetUnitSearchParams()
  getUnits()
})

</script>

<template>
<div>
  <!--表格头部--->
  <a-flex justify="space-between" class="mt-4">
    <a-flex :gap="10">
      <a-select style="width: 180px" @change="onCodeTypeChange" size="middle" v-model:value="search.codeType" placeholder="请选择广告位类型">
        <a-select-option :value="null">全部</a-select-option>
        <a-select-option :value="item.value" v-for="(item) in MediationSiteCodeTypeSelectOption">{{item.title}}</a-select-option>
      </a-select>
      <a-select size="middle" placeholder="请选择广告位操作类型"></a-select>
    </a-flex>
    <a-flex>
      <a-radio-group button-style="solid">
        <a-radio-button value="a">今日</a-radio-button>
        <a-radio-button value="b">昨日</a-radio-button>
      </a-radio-group>
      <a-range-picker
          class="ml-1"
          :value="dateRange"
          :presets="rangePresets"
          :placeholder="['Start month', 'End month']"
          format="YYYY-MM-DD"/>
      <a-button @click="showCrateModal" class="ml-2" type="primary"><PlusOutlined/>创建广告位</a-button>
      <a-dropdown :trigger="['click']">
        <template #overlay>
          <a-menu >
            <a-menu-item>自定义指标</a-menu-item>
            <a-menu-item>导出数据列表</a-menu-item>
            <a-menu-item>导出配制信息</a-menu-item>
          </a-menu>
        </template>
        <a-button style="width: 60px" class="ml-2">
          <NodeExpandOutlined />
          <DownOutlined />
        </a-button>
      </a-dropdown>
    </a-flex>
  </a-flex>
  <!--应用代码位表格--->
  <a-card :body-style="{padding:'0px'}" class="mt-4">
    <a-table :data-source="dataSource" :pagination="pagination" :loading="state.isLoading" size="small" :columns="columns">
      <template #bodyCell="{ column , record}">
        <template v-if="column.dataIndex=='name'">
          <a @click="$router
          .push({path:'/mediation/site/unit/mediationCodeEdit',query:{
            unitId:record.id,
            siteId:props.siteInfo?.id
          }})"
          >{{record.name}}</a>
          <span  style="display: block;">{{record.id}}</span>
        </template>
        <template v-if="column.dataIndex=='status'">
          <a-switch size="small" :checked-value="MediationSiteStatus.ENABLE" :un-checked-value="MediationSiteStatus.DISABLE" v-model:checked="record.status"/>
        </template>
      </template>
    </a-table>
  </a-card>

  <a-modal :width="960" v-model:open="state.isShowCreateModal" centered :closable="false" destroy-on-close :footer="null" :title="null">
    <a-flex vertical :gap="15" >
      <a-flex >
        <a-avatar size="large" shape="square" :src="(siteInfo as MediationSiteInfo).applicationInfo?.icon"></a-avatar>
        <a-flex vertical :gap="0">
          <span style="font-size: 14px;color: #333;font-weight: bold">{{appTitle}}</span>
          <a-flex :gap="10" style="font-size: 12px;color: #969aa0;">
            <div>
              <AndroidOutlined v-if="ClientPlatform.ANDROID==(siteInfo as MediationSiteInfo).clientPlatform"/>
              <AppleOutlined v-else/>
              <span >{{(siteInfo as MediationSiteInfo).id}}</span>
            </div>
          </a-flex>
        </a-flex>
      </a-flex>
      <a-typography-text  strong >新建广告位</a-typography-text>
      <div style="height: 450px;overflow-y: auto">
        <template v-for="(item,index) in createFromList">
          <a-form :model="item" layout="vertical" :class="{'mt-4':index>0}" >
            <a-flex :gap="10" align="center">
              <a-form-item name="type"  >
                <a-select v-model:value="item.type" placeholder="请选择广告位类型" size="middle" style="width: 240px">
                  <a-select-option  v-for="(v) in MediationSiteCodeTypeSelectOption" :value="v.value">{{v.title}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item  name="name" >
                <a-input v-model:value="item.name" placeholder="请选择广告位名称" size="middle" style="width: 400px"></a-input>
              </a-form-item>
              <a-form-item v-if="index>0">
                <CloseOutlined @click="removeUnit(index)"  style="color:#999;cursor: pointer"/>
              </a-form-item>

            </a-flex>
            <a-card :bordered="true" v-if="MediationSiteCodeType.REWARD==item.type" :body-style="{padding:'0px 10px'}">
              <a-checkbox  v-model:checked="item.isNeedServiceVerify" class="mt-4" :class="{'mb-4':!item.isNeedServiceVerify}">服务端激励回调</a-checkbox>
              <a-form-item class="mt-4" v-if="item.isNeedServiceVerify" style="border-bottom: 0px">
                <a-input v-model:value="item.securityKey" placeholder="请输入Security Key" size="middle" style="width: 400px"></a-input>
              </a-form-item>
            </a-card>

          </a-form>
        </template>
        <a-button @click="addUnit" style="width: 120px" class="mt-4">添加广告位</a-button>
      </div>
      <a-flex justify="flex-end" :gap="10">
        <a-button @click="state.isShowCreateModal=false" style="width: 120px" >取消</a-button>
        <a-button  :loading="state.isSaveLoading" style="width: 120px" @click="saveUnit" type="primary">保存</a-button>
      </a-flex>
    </a-flex>
  </a-modal>
</div>
</template>

<style scoped lang="less">

</style>