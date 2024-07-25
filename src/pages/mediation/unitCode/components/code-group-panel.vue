<script  setup lang="ts">

import {
  DownOutlined,
  NodeExpandOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  CloudDownloadOutlined,
  UpOutlined
} from "@ant-design/icons-vue";
import IconSummary from "~/components/icons/icon-summary.vue";
import {ColumnsType} from "ant-design-vue/es/table";
import {PropType} from "vue";
import {getMediationUnitSegmentInfo, MediationUnitSegmentInfoResponse} from "~/api/mediationUnitSegment.ts";
import {MediationNetworkType} from "~/utils/constant.ts";
import {MediationCodeSortType} from "~/api/mediationUnitCode.ts";
import CodeTable from "~/pages/mediation/unitCode/components/code-table.vue";
import dayjs from "dayjs";
import {getMediationSiteInfo, MediationSite} from "~/api/mediationSite.ts";

const emits = defineEmits(["onDataLoadEnd"])
const router=useRouter()
const props = defineProps({
  segmentId:{
    type:Number,
    required:false,
    default:():Number | undefined => undefined
  },
  unitId:{
    type:Number,
    required:false,
    default:():Number | undefined => undefined
  },
  network:{
    type:Number as PropType<MediationNetworkType>,
    required:false,
    default:():MediationNetworkType | undefined => undefined
  }
})
const summaryColumns:ColumnsType =[
  {
    title: '顺序',
    fixed:'left',
    align:'center',
    width:"80px",
    dataIndex: 'storeNo',
  },
  {
    title: '今日启用中代码位数量',
    align:'center',
    width:"350px",
    fixed:'left',
    dataIndex: 'codeCount',
  },
  {
    title: '命中用户数',
    align:'center',
    fixed:'left',
    width:"100px",
    dataIndex: 'hitUserCount',
  },

  {
    title:'',
    align:'right',
    fixed:'left',
    width:"190px",
    className:'right-border',
    dataIndex: 'action',
  },
  {
    title:'eCPM API (¥)',
    align:'right',
    dataIndex: 'apiEcPm',
  },
  {
    title:'流量请求量',
    align:'right',
    dataIndex: 'waterfallReqCnt',
  },
  {
    title:'流量填充率',
    align:'right',
    dataIndex: 'waterfallSr',
  },
  {
    title:'填充耗时(s)',
    align:'right',
    dataIndex: 'action',
  },
  {
    title:'展示数',
    align:'right',
    dataIndex: 'ipmCnt',
  },
  {
    title:'展示率',
    align:'right',
    dataIndex: 'mediaMSsr',
  },
  {
    title:'预估收益(¥)',
    align:'right',
    dataIndex: 'revenue',
  },
  {
    title:'收益API (¥)',
    align:'right',
    dataIndex: 'apiRevenue'
  }
]

const summaryData=shallowRef<any[]>([
  {
    storeNo:'汇总',
    codeCount:2,
    hitUserCount:"-",
    apiEcPm:"-",
    waterfallReqCnt:"-",
    waterfallSr:"-",
    ipmCnt:'-',
    mediaMSsr:'-',
    revenue:"-",
    apiRevenue:"-"
  }
])
const segmentInfo=reactive<MediationUnitSegmentInfoResponse>(<MediationUnitSegmentInfoResponse>{
  codeList: []
})
const isExpand=ref(false)
const isLoading=ref(false)
type RangeValue = [dayjs.Dayjs, dayjs.Dayjs];
const dateRange = ref<RangeValue>([dayjs(),dayjs()]);
const rangePresets = ref([
  { label: '今日', value: [dayjs(), dayjs()] },
  { label: '昨日', value: [dayjs().add(-1,'d'), dayjs().add(-1,'d')] },
  { label: '近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '近30天', value: [dayjs().add(-30, 'd'), dayjs()] }
]);
const bindTableDataSource=computed(()=>segmentInfo?.codeList?.filter(v=>v.sortType==MediationCodeSortType.BID && v.isEnable)??[])
const priceStoreTableDataSource=computed(()=>segmentInfo?.codeList?.filter(v=>v.sortType==MediationCodeSortType.PRICE && v.isEnable)??[])
const bottomUpTableDataSource=computed(()=>segmentInfo?.codeList?.filter(v=>v.sortType==MediationCodeSortType.BOTTOM_UP && v.isEnable)??[])
const notUseTableDataSource=computed(()=>segmentInfo?.codeList?.filter(v=>!v.isEnable)??[])
const enableCodeCount=computed(()=>segmentInfo.codeList.filter(v=>v.isEnable).length)

const siteInfo=reactive<MediationSite>({})
const loadData=async ()=>{
  isLoading.value=true
  let res=await getMediationUnitSegmentInfo(props.network,props.segmentId)
  let summary={
    storeNo:'汇总',
    hitUserCount:"-",
  }
  Object.assign(summary,res.data.summaryReport??{})
  summaryData.value=[summary]
  Object.assign(segmentInfo,res.data??{})

  let siteRes= await getMediationSiteInfo(String(segmentInfo.siteId))
  Object.assign(siteInfo,siteRes.data??{})
  isLoading.value=false
}

watch(()=>props.network,(__,_)=>{
  loadData()
})
watch(router.currentRoute, (route) => {
  loadData()
})
onMounted(()=>{
  loadData()
})
</script>

<template>
  <a-spin :spinning="isLoading">
    <a-flex justify="space-between" align="center" class="ml-4 mr-4">
      <a-flex :gap="10" >
        <a-dropdown>
          <div>
            <a-button type="primary">添加广告位  <DownOutlined style="font-size: 10px;"/></a-button>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="router.push({path:'/media/union/mediationCodeCreate',query:{
                segmentId:props.segmentId,
                unitId:props.unitId,
                siteId:segmentInfo.siteId,
                waterfallId:segmentInfo.waterfall.id
              }})">
                <a>添加单个代码位</a>
              </a-menu-item>
              <a-menu-item>
                <a>批量添加代码位</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button ><SettingOutlined /> 瀑布流属性设置</a-button>
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
        <a-tooltip title="自定义指标">
          <a-button  class="ml-2">
            <NodeExpandOutlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="导出数据列表或配置信息">
          <a-button  class="ml-2">
            <CloudDownloadOutlined />
          </a-button>
        </a-tooltip>

      </a-flex>
    </a-flex>

    <!--汇总-->
    <a-flex :gap="10" class="mt-4 ml-4">
      <a-flex :gap="5" align="center">
        <IconSummary />
        <a-typography-text strong>汇总 </a-typography-text>
        <a-tooltip placement="bottomLeft"  :overlay-style="{'max-width':'380px'}" >
          <template #title>
            <span style="display: block;font-size: 12px">瀑布流维度汇总数据。开启的代码位数量展示的是当前的，其他数据指标为所选日期范围对应的数据。请注意，“命中用户数”指标为小时级更新。</span>
          </template>
          <QuestionCircleOutlined class="ml-1" style="color: #999"/>
        </a-tooltip>
      </a-flex>
      <a-flex :gap="5"  align="center">
        <IconAccelerators />
        <a-typography-text type="secondary">请求加速器 2</a-typography-text>
        <a-tooltip placement="top"  :overlay-style="{'max-width':'380px'}" >
          <template #title>
            <span style="display: block;font-size: 12px">请求加速器已解除Beta标识，全量上线，新建广告位将默认启用请求加速器，可前往帮助文档查看更多使用建议</span>
          </template>
          <QuestionCircleOutlined class="ml-1" style="color: #999"/>
        </a-tooltip>
      </a-flex>
      <a-button type="link" style="font-size: 12px">了解更多</a-button>
    </a-flex>
    <a-table  :scroll="{x: 'max-content'}" :bordered="false" size="middle" :pagination="false"  class="ant-table-hide-empty" :data-source="summaryData" :columns="summaryColumns" >
      <template #bodyCell="{ column , record}">
        <template v-if="column.dataIndex==='action'">
          <a>诊断分析</a>
        </template>
        <template v-if="column.dataIndex==='codeCount'">
          <span>{{enableCodeCount==0?'-':enableCodeCount}}</span>
        </template>
      </template>
    </a-table>

    <!--竞价-->
    <div v-if="bindTableDataSource.length>0">
      <a-flex  class="mt-4 ml-4" :gap="5">
        <a-typography-text strong>竞价  </a-typography-text>
        <a-tooltip placement="bottomLeft"  :overlay-style="{'max-width':'380px'}" >
          <template #title>
            <span style="display: block;font-size: 12px">竞价代码位将在每次请求广告时获取实时价格，再根据价格参与瀑布流动态排序</span>
          </template>
          <QuestionCircleOutlined class="ml-1" style="color: #999"/>
        </a-tooltip>
      </a-flex>
      <CodeTable :site-info="siteInfo" :sort-type="MediationCodeSortType.BID" :code-list="bindTableDataSource"/>
    </div>
    <!--按价格-->
    <div v-if="priceStoreTableDataSource.length>0">
      <a-flex  class="mt-4 ml-4" :gap="5">
        <a-typography-text strong>按价格  </a-typography-text>
        <a-tooltip placement="bottomLeft"  :overlay-style="{'max-width':'380px'}" >
          <template #title>
            <span style="display: block;font-size: 12px">代码位将根据您设置的价格高低排序</span>
          </template>
          <QuestionCircleOutlined class="ml-1" style="color: #999"/>
        </a-tooltip>
      </a-flex>
      <CodeTable :site-info="siteInfo" :sort-type="MediationCodeSortType.PRICE" :code-list="priceStoreTableDataSource"/>
    </div>
    <!--兜底-->
    <div v-if="bottomUpTableDataSource.length>0">
      <a-flex  class="mt-4 ml-4" :gap="5">
        <a-typography-text strong>兜底  </a-typography-text>
        <a-tooltip placement="bottomLeft"  :overlay-style="{'max-width':'380px'}" >
          <template #title>
            <span style="display: block;font-size: 12px">兜底代码位将在瀑布流的最后请求，建议设置无底价的代码位</span>
          </template>
          <QuestionCircleOutlined class="ml-1" style="color: #999"/>
        </a-tooltip>
      </a-flex>
      <CodeTable :site-info="siteInfo" :sort-type="MediationCodeSortType.BOTTOM_UP" :code-list="bottomUpTableDataSource"/>
    </div>
    <!--未启用代码位-->
    <div  class="mt-4 ml-4" >
      <a-typography-text strong>未启用代码位  </a-typography-text>
      <a-tooltip placement="bottomLeft"  :overlay-style="{'max-width':'380px'}" >
        <template #title>
          <span style="display: block;font-size: 12px">同广告位下所有瀑布流的代码位ID可共用，将作为未启用代码位收纳于此</span>
        </template>
        <QuestionCircleOutlined class="ml-1" style="color: #999"/>
      </a-tooltip>
      <a-divider type="vertical" style="background: rgb(51, 51, 51)" ></a-divider>
      <a-typography-text style="color: rgb(51, 51, 51)">({{notUseTableDataSource.length}})</a-typography-text>
      <a-button type="link" @click="isExpand=true" v-if="!isExpand">展开 <DownOutlined /></a-button>
      <a-button type="link"  @click="isExpand=false" v-if="isExpand" >收起 <UpOutlined /></a-button>
    </div>
    <CodeTable :site-info="siteInfo" :is-not-use="true" v-if="isExpand"  :code-list="notUseTableDataSource"/>
  </a-spin>
</template>

<style scoped lang="less">

</style>