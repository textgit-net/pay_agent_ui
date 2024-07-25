<script setup lang="ts">
import {PropType} from "vue";
import {
  MediationCodeSortType,
  MediationUnitCodeResponse, updateMediationUnitCode,
  UpdateMediationUnitCodeRequest
} from "~/api/mediationUnitCode.ts";
import {ColumnsType} from "ant-design-vue/es/table";
import {
  MoreOutlined,
  HolderOutlined,
  SearchOutlined,
  AppleOutlined,
  AndroidOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons-vue";
import {ClientPlatform, getMediationSiteCodeTypeText} from "~/utils/constant.ts";
import {useTableHeadResizable} from "~/utils/useTableHeadResizable.ts";
import ApplicationTransferItem from "~/pages/application/components/application-transfer-item.vue";
import {MediationSite} from "~/api/mediationSite.ts";

const props = defineProps({
  isNotUse:{
    type:Boolean,
    required:false,
    default:()=>false
  },
  siteInfo:{
    type:Object as PropType<MediationSite>,
    required:true
  },
  codeList:{
    type:Array as PropType<MediationUnitCodeResponse[]>,
    required:false,
    default: () => []
  },
  sortType:{
    type:Number,
    required:false,
    default:():Number | undefined => undefined
  }
})
const router=useRouter()
const baseMediationCodeColumns:ColumnsType=[
  {
    title: '广告网络',
    align:'left',
    fixed:'left',
    width:"100px",
    dataIndex: 'networkTypeText',
  },
  {
    title: '代码位名称/ID',
    align:'left',
    fixed:'left',
    width:"190px",
    dataIndex: 'codeName',
  },

  {
    title:'操作',
    fixed:'left',
    align:'left',
    width:"100px",
    dataIndex: 'action',
  },
  {
    title:'代码位类型',
    align:'left',
    fixed:'left',
    width:"80px",
    dataIndex: 'codeType',
  },
  {
    title:'排序价格（¥）',
    align:'right',
    width:"160px",
    fixed:'left',
    dataIndex: 'sortPrice',
    className:'right-border'
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
    dataIndex: 'waterfallFillDuration',
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
const bindPriceMediationCodeColumns =[...<ColumnsType>[{
  title: '顺序',
  align:'center',
  fixed:'left',
  width:"90px",
  dataIndex: 'storeNo',
  className:"left-border5 light-blue-border"
}],...baseMediationCodeColumns]
const priceStoreMediationCodeColumns =[...<ColumnsType>[{
  title: '顺序',
  align:'center',
  fixed:'left',
  width:"90px",
  dataIndex: 'storeNo',
  className:"left-border5 light-yellow-border"
}],...baseMediationCodeColumns]
const bottomUpMediationCodeColumns=[...<ColumnsType>[{
  title: '顺序',
  fixed:'left',
  align:'center',
  width:"90px",
  dataIndex: 'storeNo',
  className:"left-border5 light-purple-border"
}],...baseMediationCodeColumns]
const noUseMediationCodeColumns=[...<ColumnsType>[{
  title: '顺序',
  fixed:'left',
  align:'center',
  width:"90px",
  dataIndex: 'storeNo',
  className:"left-border5 grey-border"
}],...baseMediationCodeColumns]

const tableColumns=computed(()=>{
  if(props.isNotUse){
    return noUseMediationCodeColumns
  }
  switch (props.sortType){
    case MediationCodeSortType.BID:
      return bindPriceMediationCodeColumns
    case MediationCodeSortType.BOTTOM_UP:
      return bottomUpMediationCodeColumns
    case MediationCodeSortType.PRICE:
      return priceStoreMediationCodeColumns
  }
})

const removeStyle = () => {
  // document.getElementsByClassName('ant-table-tbody').forEach(parent => {
  //   parent.getElementsByTagName('tr').forEach(child => {
  //     child.removeAttribute('style')
  //   })
  // })
}
const customRow = (record, index) => {
  return {
    style: {
      cursor: 'grab'
    },
    // 鼠标移入
    onMouseenter: event => {
      // 兼容IE
      var ev = event || window.event
      ev.target.draggable = true
    },
    // 开始拖拽
    onDragstart: event => {
      // 兼容IE
      var ev = event || window.event
      // 阻止冒泡
      ev.stopPropagation()
    },
    // 拖动元素经过的元素
    onDragover: event => {
      // 兼容 IE
      var ev = event || window.event
      // 阻止默认行为
      ev.preventDefault()
      console.log('ant-table-tbody元素个数', document.getElementsByClassName('ant-table-tbody'))
      console.log('拖动元素经过的元素索引', index)
      console.log(
          '表格子元素',
          document.getElementsByClassName('ant-table-tbody')[0].getElementsByTagName('tr')[index]
      )

      //表格右侧操作栏使用了fixed固定定位，因此ant-table-tbody有两个
      // document.getElementsByClassName('ant-table-tbody').forEach(parent => {
      //   parent.getElementsByTagName('tr').forEach((item, i) => {
      //     if (i === index) {
      //       item.style.borderBottom = '2px solid #1677ff'
      //     } else {
      //       item.removeAttribute('style')
      //     }
      //   })
      // })
    },
    // 鼠标松开
    onDrop: event => {
      // 兼容IE
      var ev = event || window.event
      // 阻止冒泡
      ev.stopPropagation()
      // 得到目标数据

      //松开鼠标后，清除底部拖拽样式
      removeStyle()
    },
    //鼠标移出
    onMouseleave: event => {
      // 兼容IE
      var ev = event || window.event
      //鼠标移出拖拽范围禁止拖拽并清除拖拽效果
      ev.target.draggable = false
      removeStyle()

    }
  }
}

const state=reactive<{
  isShowEditModal:boolean,
  isSaveLoading:boolean,
  selectItem?:MediationUnitCodeResponse,
  updateFormData:UpdateMediationUnitCodeRequest
}>({
    isShowEditModal:false,
    isSaveLoading:false,
    selectItem:null,
    updateFormData:{}
})
const openEditModal=(record:MediationUnitCodeResponse)=>{
  state.isShowEditModal=true
  let item={}
  Object.assign(item,record)
  state.selectItem=item as MediationUnitCodeResponse
  // debugger;
  Object.assign(state.updateFormData, {
    id:record.id,
    code:record.codeId,
    codeName:record.name,
    isEnable:record.isEnable
  })
}
const doUpdate=async ()=>{
  state.isSaveLoading=true
  try {
    await updateMediationUnitCode(state.updateFormData)
    state.isSaveLoading=false
    state.isShowEditModal=false
    let query={}
    Object.assign(query,router.currentRoute.value.query)
    query["ts"]=new Date().getTime()
    await router.replace({path:router.currentRoute.value.path,query:query})
    useMessage().success("操作成功",2)
  }catch (e){
    useMessage().error(`${e}`,2)
  }finally {
     state.isSaveLoading=false
  }

}
</script>

<template>
  <div>
    <a-table :custom-row="customRow" :scroll="{x: 'max-content'}" :data-source="codeList" size="middle" :pagination="false"  :columns="tableColumns" class="mt-2 ant-table-hide-empty">
      <template #emptyText></template>
      <template #bodyCell="{ column , record}">
        <template v-if="column.dataIndex==='action'">
          <a-flex justify="space-between" align="center">
            <a-flex :gap="5" align="center">
              <a-switch size="small" v-model:checked="record.isEnable"></a-switch>
              <a @click="openEditModal(record as MediationUnitCodeResponse)">编辑</a>
            </a-flex>
            <a-dropdown :trigger="['click']">
              <MoreOutlined />
              <template  #overlay>
                <a-menu>
                  <a-menu-item>诊断分析</a-menu-item>
                  <a-menu-item>删除代码位</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-flex>

        </template>
        <template v-if="column.dataIndex=='codeType'">
          <span>{{getMediationSiteCodeTypeText(record.codeType)}}</span>
        </template>
        <template v-if="column.dataIndex==='storeNo'">
          <a-flex style="width: 100%;">
            <HolderOutlined/>
            <div style="flex: 1;">{{record['storeNo']}}</div>
          </a-flex>
        </template>
        <template v-if="column.dataIndex=='codeName'">
          <a-tooltip color="white">
            <template #title>
              <div >
                <a-flex :gap="5">
                  <a-typography-text type="secondary">代码位名称:</a-typography-text>
                  <a-typography-text>{{record.name}}</a-typography-text>
                </a-flex>
                <a-flex :gap="5">
                  <a-typography-text type="secondary">代码位ID:</a-typography-text>
                  <a-typography-text>{{record.id}}</a-typography-text>
                </a-flex>
                <div style="display: flex; justify-content: flex-end">
                  <a-button style="align-items: flex-end" type="link">复制</a-button>
                </div>
              </div>
            </template>
            <span style="font-size: 12px;color: #333;cursor: pointer">{{record.name}}</span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex=='sortPrice'">
          <span v-if="record.sortType===MediationCodeSortType.PRICE" >
              {{record.sortPrice==0?"-":record.sortPrice}}
          </span>
        </template>
      </template>
    </a-table>
    <a-modal wrap-class-name="no-padding" destroy-on-close :footer="null" centered title="更新代码位" :closable="false" v-model:open="state.isShowEditModal" :width="600" >
      <a-flex vertical style="height: 550px;width: 100%">
        <div style="padding: 0 24px">
          <a-flex :gap="5" class="mb-4"  >
            <a-avatar size="large" shape=square :src="(siteInfo as MediationSite)?.applicationInfo?.icon"></a-avatar>
            <a-flex vertical >
              <a-typography-text>{{(siteInfo as MediationSite)?.applicationInfo?.name}}</a-typography-text>
              <a-flex>
                <AndroidOutlined v-if="ClientPlatform.ANDROID==(siteInfo as MediationSite)?.clientPlatform" style="color: #999"/>
                <AppleOutlined v-if="ClientPlatform.IOS==(siteInfo as MediationSite)?.clientPlatform" style="color: #999"/>
                <a-typography-text type="secondary">{{(siteInfo as MediationSite)?.id}}</a-typography-text>
              </a-flex>
            </a-flex>
          </a-flex>
        </div>
        <a-form :model="state.updateFormData" size="middle" style="flex: 1;overflow-y: auto;padding: 0 24px" layout="vertical">
            <a-form-item label="广告网络" :required="true">
                <span>{{ state.selectItem.networkTypeText}}</span>
            </a-form-item>
            <a-form-item  required>
              <template #label>
                <a-tooltip title="SDK竞价代码位应该具备将每次展示的价格返回给聚合平台的能力。请与相应广告平台客户经理确认开通竞价功能后使用。">
                  <div>
                    <a-flex :gap="5">
                      <span>竟价类型</span>
                      <QuestionCircleOutlined/>
                    </a-flex>
                  </div>
                </a-tooltip>
              </template>
              <a-radio-group >
                <a-radio-button  style="width:100px;align-items: center;text-align: center" value="a">标准</a-radio-button>
                <a-radio-button  style="width:100px;align-items: center;text-align: center" value="b">服务端竟价</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item  required label="代码位ID">
              <a-input v-model:value="state.updateFormData.code" placeholder="请输入代码位ID"/>
            </a-form-item>
            <a-form-item  v-model:value="state.updateFormData.codeName"  required label="代码位名称" :rules="[{required:true,message:'内容不能为空'}]">
              <a-input v-model:value="state.updateFormData.codeName" placeholder="请输入代码位名称"/>
            </a-form-item>
            <a-form-item label="是否使用模板渲染" :required="true">
                <span>模板渲染</span>
            </a-form-item>
            <a-form-item label="代码位状态" required>
              <a-radio-group v-model:value="state.updateFormData.isEnable">
                <a-radio :value="true">启用</a-radio>
                <a-radio :value="false">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
        </a-form>
        <a-flex justify="flex-end" :gap="15" style="padding:15px 24px">
          <a-button style="width: 100px" @click="state.isShowEditModal=false">取消</a-button>
          <a-button style="width:100px" :loading="state.isSaveLoading"  @click="doUpdate" type="primary">保存</a-button>
        </a-flex>
      </a-flex>
    </a-modal>
  </div>

</template>

<style scoped lang="less">

</style>