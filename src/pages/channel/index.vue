<script setup lang="ts">
import { h, createVNode  } from 'vue';
import {ColumnsType} from "ant-design-vue/es/table";
import {AlipaySquareFilled, ExclamationCircleOutlined, FormOutlined, FundViewOutlined, ReloadOutlined,FileSearchOutlined,QuestionCircleOutlined } from "@ant-design/icons-vue"
import {PaginationProps,Modal,message} from "ant-design-vue";
import { ChannelGroupSimpleResponse, getChannelGroups} from '@/api/channel/group'

import {ChannelListResponse, ChannelSearch, searchChannel, getChannelWalletInfo, cloneChannel, CloneChannelFormData} from "~/api/channel/ChannelInterface.ts";
import {getPayChannelTypeText, PayChannelType, PayModeType, getPayModeTypeText, PayChannelTypeSelectOption} from "~/utils/constant.ts";
import { calcFloat } from '~/utils/calcFloat'
import { updateParamsToUrl, getParamsFromUrl} from '@/utils/tools'
import ChannelWithdrawDialog from '@/pages/channel/components/channel-withdraw-dialog.vue';
import ChannelAreaBlackDialog from '@/pages/channel/components/channel-area-black-dialog.vue';
const userStore = useUserStore()
const optsStore = useOptsStore()
const router=useRouter()
const columns:ColumnsType =[
  {
    title: '产品编码',
    dataIndex: 'productCode',
  },
  {
    title: '渠道名称',
    dataIndex: 'name',
  },
  // {
  //   title: '渠道类型',
  //   dataIndex: 'channelType',
  // },
  // {
  //   title: '支付方式',
  //   dataIndex: 'payModes',
  // },
  {
    title: '启用分账',
    dataIndex: 'isEnableRoyalty',
  },
  {
    title: '订单支付条数',
    dataIndex: 'successCount',
  },
  {
    title: '订单支付金额',
    dataIndex: 'successAmount',
  },
  {
    title: '成功率',
    dataIndex: 'successRate',
  },
  {
    title: '冻结金额',
    dataIndex: 'channelFreezeAmount',
  },
  {
    title: '可用金额',
    dataIndex: 'channelAmount',
  },
  {
    title: '提现金额',
    dataIndex: 'totalWithdrawAmount',
  },
  {
    title: '启用状态',
    dataIndex: 'isEnable',
  },
  {
    title:'创建日间',
    dataIndex:'createTime'
  },
  {
    title:'操作',
    width:180,
    dataIndex: 'action',
  },
]
const state=reactive({
  isShowCloneModal:false,
  isSaveLoading: false,
  dataSourceLoading:false,
  isPageLoading:false,
  showWithdrawDialog: false,
  showAreaBlackDialog: false,
  channelInfo: {}
})
const initSearchParams = ():ChannelSearch => {
  return {
    page:1,
    limit:10,
    isIgnoreDisable:false,
    channelTypes: [],
    groupCodes: []
  }
}
const searchParams=ref<ChannelSearch>(initSearchParams())
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
    searchParams.value.page = current
    searchParams.value.limit = pageSize
    router.replace({ query: {...JSON.parse(JSON.stringify(searchParams.value)), timestamp: new Date().getTime()}})
    // loadData()
  },
})
const dataSource=shallowRef<ChannelListResponse[]>([])
const channelGroups = ref<ChannelGroupSimpleResponse[]>([])

const changeEnable=async (record:ChannelListResponse)=>{
  // let tip = record.isEnable ? `确认关闭当前渠道【${record.name}】吗？` : `确认开启当前渠道【${record.name}】吗? ${record.isErrorAutoClose? '上次是因为【'+ record.closeReason +'】关闭。':''}`
  // Modal.confirm({
  //   title: '温馨提示',
  //   icon: createVNode(ExclamationCircleOutlined),
  //   content: tip,
  //   okText: '确认',
  //   cancelText: '取消',
  //   async onOk() {
  //     try {
  //       state.isPageLoading=true
  //       let res = await usePut(`/channel/change/${record.id}`)
  //       message.success('操作成功')
  //       await loadData()
  //       state.isPageLoading=false
  //     } catch {
        
  //     }
  //   },
  //   onCancel() {},
  // });
  try {
    let res = await usePut(`/channel/change/${record.id}`)
    message.success('操作成功')
    await loadData()
  } catch {

  }
  
}
const loadData=async ()=>{
  if (state.dataSourceLoading) return
  state.dataSourceLoading = true
  try {
    const { data } = await searchChannel({
      ...searchParams.value,
      page: pagination.current,
      limit: pagination.pageSize,
    })
    dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
    dataSource.value = dataSource.value.map(i => {
      return {
        ...i,
        isItemLoadSpinning: false
      }
    })
  }
  finally {
    state.dataSourceLoading = false
  }
}

const showPayModelDialog = (record: ChannelListResponse) => {
  let domArr = []
  if (record.payModes.length) {
    record.payModes.map((item: PayModeType, index: number) => {
      domArr.push(h('p', `${index + 1}、${ optsStore.getPayModesText(item)}`))
    })
  
  }
  Modal.info({
    title: '支持的支付方式',
    content: h('div', {}, domArr),
    onOk() {
      console.log('ok');
    },
  });
}



const handleRefreshAmount = async (record: ChannelListResponse) => {
  let data  = JSON.parse(JSON.stringify(dataSource.value))
  record.isItemLoadSpinning = true
  let index = data.findIndex(item => item.id == record.id)
  data[index].isItemLoadSpinning = true
  dataSource.value = data

  try {
    let res = await getChannelWalletInfo(record.id)
    dataSource.value[index].channelAmount = res.data.amount
    dataSource.value[index].channelFreezeAmount = res.data.freezeAmount 
  } catch (error) {
    
  } finally {
    dataSource.value[index].isItemLoadSpinning = false
    dataSource.value = JSON.parse(JSON.stringify(dataSource.value))
  }
}

const handleWithdraw = async (record: ChannelListResponse) => {
  
  state.channelInfo =record
  state.showWithdrawDialog = true
}

const onWithdrawSuccess = async () => {
  
  await loadData()
  let timer = setTimeout(() => {
    clearTimeout(timer);
    timer = null;
    handleRefreshAmount(state.channelInfo)
  }, 600)
}

// watch(()=> searchParams.value.isIgnoreDisable, () => {
//   filterSearch()
// })
const changeIsIgnoreDisable= () => {
  filterSearch()
}


const fetchChanelGroups = async () => {
  let res = await getChannelGroups()
  channelGroups.value = res.data
}

const resetSearch=()=>{
  searchParams.value = initSearchParams();
  filterSearch()
}

const filterSearch=()=>{
  
  pagination.onChange(1, pagination.pageSize)
}

const cloneFormRef = ref()
const cloneFormData = ref<CloneChannelFormData>({

})

const handleShowClone = (record: ChannelListResponse) => {
  const uniqueId = Math.random().toString(36).substr(2, 6);
  state.isShowCloneModal = true
  nextTick().then(_=> {
    optsStore.initOpts()
    cloneFormRef.value.resetFields()
    cloneFormData.value.id = record.id
    cloneFormData.value.groupCode = record.group?.groupCode
    cloneFormData.value.name = `${record.name}-${uniqueId}`
  })
}

const onCloneSubmit = () => {
  cloneFormRef.value.validate().then(async()=> {
    state.isSaveLoading=true
    try {
     await cloneChannel(cloneFormData.value)
     filterSearch()
     state.isShowCloneModal=false
    }finally {
      state.isSaveLoading=false
    }
  })
}
const isDisAbledCloneChannelForm = computed(() => {
  return !cloneFormData.value.name || state.isSaveLoading
})

const handleAddAreaBlackList = (record: ChannelListResponse) => {
  state.channelInfo =record
  state.showAreaBlackDialog = true
}

onMounted(()=>{
  if (getParamsFromUrl()) {
    searchParams.value = Object.assign(searchParams.value, getParamsFromUrl())
  }
  if (searchParams.value.page) {
    pagination.current = searchParams.value.page
    pagination.pageSize = searchParams.value.limit
  }
  loadData()

  fetchChanelGroups()
  
})
</script>

<template>
  <a-spin :spinning="state.isPageLoading">
    <a-modal
        v-model:open="state.isShowCloneModal"
        :mask-closable="false" centered :width="420" title="克隆渠道"
      >
      <template #footer>
        <a-button key="submit" type="primary" :loading="state.isSaveLoading" :disabled="isDisAbledCloneChannelForm" @click="onCloneSubmit" style="width: 100%;">提 交</a-button>
      </template>
      <a-form ref="cloneFormRef" :model="cloneFormData" layout="vertical"  style="padding: 20px 0;">
        <a-form-item name="name" :rules="{required:true,message:'请输入渠道名称'}"  label="渠道名称" >
          <a-input placeholder="请输入渠道名称" v-model:value="cloneFormData.name" allow-clear></a-input>
        </a-form-item>
        <!-- <a-form-item name="groupCode" :rules="{required:false,message:'请选择支付产品'}" label="所属支付产品">
          <a-select
            v-model:value="cloneFormData.groupCode"
            style="width: 100%"
            placeholder="请选择"
            allow-clea
          >
            <a-select-option v-for="item in userStore.userInfo.products" :value="item.productCode">{{ item.productName }}</a-select-option>
          </a-select>
        </a-form-item> -->
      </a-form>
    </a-modal>


    <channel-withdraw-dialog v-model:visible="state.showWithdrawDialog" :chnnel-info="state.channelInfo" @on-success="onWithdrawSuccess" />
    <ChannelAreaBlackDialog v-model:visible="state.showAreaBlackDialog" :chnnel-info="state.channelInfo" />
    <a-flex vertical :gap="10" style="width: 100%;height: 100%">
      <!--头部-->
      <a-card :body-style="{padding:'15px'}">
        <a-flex justify="space-between">
          <a-typography-text>支付渠道</a-typography-text>
        </a-flex>
      </a-card>

      <a-card style="border: none" :body-style="{padding:'15px'}">
        <a-flex vertical :gap="15">
          <a-row :gutter="16">
            <a-col class="gutter-row" :span="4">
              <a-select
                v-model:value="searchParams.groupCodes"
                mode="multiple"
                style="width: 100%"
                placeholder="按支付产品查询"
                allow-clear
                :max-tag-count="2"
              >
                <a-select-option v-for="item in userStore.userInfo.products" :value="item.productCode">{{ item.productName }}</a-select-option>
              </a-select>
            </a-col>

            <!-- <a-col class="gutter-row" :span="4">
              <a-select
                v-model:value="searchParams.channelTypes"
                mode="multiple"
                :max-tag-count="2"
                style="width: 100%"
                placeholder="按渠道类型查询"
                allow-clear
              >
                <a-select-option v-for="item in PayChannelTypeSelectOption" :value="item.value">{{ item.title }}</a-select-option>
              </a-select>
            </a-col> -->
            <a-col class="gutter-row" :span="4">
              <a-input v-model:value="searchParams.keyword" allow-clear  placeholder="按ID/名称查询" ></a-input>
            </a-col>
          </a-row>

          <a-flex  :gap="0" justify="start">
            <a-button type="link" style="padding-left: 0" @click="resetSearch">重置筛选</a-button>
            <a-button  size="small"  @click="filterSearch"  type="primary"  style="width: 80px;height:28px"  >
              <template #icon>
                <FileSearchOutlined />
              </template>
              筛选
            </a-button>
            
             
            <a-space style="padding-left: 20px;">
              <a-typography-text type="secondary">是否忽略禁用的渠道</a-typography-text>
              <a-tooltip>
                <template #title>默认为不开启忽略禁用，若只查看开启的请进行勾选筛选</template>
                <a-checkbox v-model:checked="searchParams.isIgnoreDisable" @change="changeIsIgnoreDisable"></a-checkbox>
              </a-tooltip>
            </a-space>
            
          </a-flex>
        </a-flex>
      </a-card>

      <a-card :body-style="{'padding':'0px'}" >

        <a-card style="border: none" :body-style="{padding:'15px'}">
          <a-button @click="router.push({path:'/channel/edit'})" type="primary">添加渠道</a-button>
        </a-card>
        <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading && !state.isPageLoading"  :columns="columns" size="middle" :bordered="false">
          <!--        <template #emptyText>-->
          <!--          <a-empty></a-empty>-->
          <!--          <a-button @click="router.push({path:'/channel/edit'})" type="primary">添加渠道</a-button>-->
          <!--        </template>-->
          <template #bodyCell="{ column , record}">

            <template v-if="column.dataIndex==='successCount'">
              <a-flex :gap="5" align="center" justify="start">
                <a-tooltip>
                  <template #title>成功条数</template>
                  <a-typography-text type="success" strong>  {{ record.successCount }}</a-typography-text>
                </a-tooltip> / 
                <a-tooltip>
                  <template #title>总条数</template>
                  <a-typography-text type="danger" strong> {{ record.totalCount }}</a-typography-text>
                </a-tooltip>
               
                <a-tooltip>
                  <template #title>查看当前渠道订单信息</template>
                  <FundViewOutlined @click="router.push({path:'/channel/info',query:{id:record.id, tabKey: 'orderInfo'}})" style="color: #1677ff;padding-left: 3px" />
                </a-tooltip>
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='successAmount'">
              <a-flex :gap="5" align="center" justify="start">
                <a-tooltip>
                  <template #title>成功金额</template>
                  <a-typography-text type="success" strong>   ￥{{ record.successAmount }}</a-typography-text>
                </a-tooltip> / 
                <a-tooltip>
                  <template #title>总金额</template>
                  <a-typography-text type="danger" strong>  ￥{{ record.totalAmount }}</a-typography-text>
                </a-tooltip>
                
                <a-tooltip>
                  <template #title>查看当前渠道订单信息</template>
                  <FundViewOutlined @click="router.push({path:'/channel/info',query:{id:record.id, tabKey: 'orderInfo'}})" style="color: #1677ff;padding-left: 3px" />
                </a-tooltip>
              </a-flex>
            </template>

            <template v-if="column.dataIndex==='successRate'">
              <a-flex :gap="5" align="center">
                <a-typography-text v-if="record.totalCount" type="success" strong>  {{ (calcFloat.div(record.successCount, record.totalCount) * 100).toFixed(2) }}%</a-typography-text>
                <a-typography-text v-else type="success" strong> /</a-typography-text>
               
              </a-flex>
            </template>

            <template v-if="column.dataIndex==='group'">
              <a-typography-text v-if="!record.group" type="secondary">/</a-typography-text>
              <a-flex v-else vertical :gap="5" align="start">
                
                <!-- <a-tooltip>
                  <template #title>查看渠道组【{{(record.group as ChannelGroupSimpleResponse).name}}】详情</template>
                  <a-button style="padding-left: 0" type="link" @click="router.push({path:'/channel/group-info',query:{groupCode:record.group.groupCode}})">{{(record.group as ChannelGroupSimpleResponse).name}}</a-button>
                </a-tooltip> -->
                <a-typography-text type="secondary">{{(record.group as ChannelGroupSimpleResponse).name}}</a-typography-text>
                <a-typography-text type="secondary">编号:{{(record.group as ChannelGroupSimpleResponse).groupCode}}</a-typography-text>
              </a-flex>
            </template>



            <template v-if="column.dataIndex==='name'">
              <a-flex vertical :gap="5" align="start">
                <a-tooltip>
                  <template #title>查看渠道【{{record.name}}】详情</template>
                  <a-button style="padding-left: 0" type="link" @click="router.push({path:'/channel/info',query:{id:record.id}})">{{record.name}}</a-button>
                </a-tooltip>
                
                <a-typography-text type="secondary">渠道ID:{{record.id}}</a-typography-text>
              </a-flex>
            </template>

            <!-- <template v-if="column.dataIndex==='payModes'">
              <a-flex vertical :gap="5" align="start">
                <a-tooltip>
                    <template #title>查看支付方式</template>
                    <a @click="showPayModelDialog(record as ChannelListResponse)">{{record.payModes.length}}个</a>
                </a-tooltip>
                
              </a-flex>
            </template> -->

            <template v-if="column.dataIndex==='isEnableRoyalty'">
              <a-flex align="center" justify="start">
                <a-tag v-if="record.isEnableRoyalty" :bordered="false" color="success">已配制</a-tag>
                <a-tag v-else :bordered="false" color="processing">未配制</a-tag>

                <a-tooltip>
                  <template #title>编辑渠道分账信息</template>
                  <FormOutlined @click="router.push({path:'/channel/info',query:{id:record.id, tabKey: 'channelAccountInfo'}})" style="color: #1677ff;" />
                </a-tooltip>
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='channelFreezeAmount'">
              <a-flex>
                <a-spin :spinning="(record as ChannelListResponse).isItemLoadSpinning">
                  <a-typography-text> ￥{{ (record as ChannelListResponse).channelFreezeAmount }}</a-typography-text>
                  <a-tooltip>
                    <template #title>刷新冻结金额数据</template>
                    <ReloadOutlined @click="handleRefreshAmount(record)" style="color: rgb(22, 119, 255); font-weight: bold; padding-left: 5px;" />
                  </a-tooltip>
                </a-spin>
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='channelAmount'">
              <a-flex>
                <a-spin :spinning="record.isItemLoadSpinning">
                  <a-typography-text> ￥{{ (record as ChannelListResponse).channelAmount }}</a-typography-text>
                  <a-tooltip>
                    <template #title>刷新可用金额数据</template>
                    <ReloadOutlined @click="handleRefreshAmount(record)" style="color: rgb(22, 119, 255); font-weight: bold; padding-left: 5px;" />
                  </a-tooltip>
                </a-spin>
              </a-flex>
            </template>

            <template v-if="column.dataIndex==='totalWithdrawAmount'">
              <a-flex>
                <a-tooltip>
                  <template #title>点击查看渠道提现记录</template>
                  <a-typography-link type="danger" strong @click="router.push({path:'/channel/info',query:{id:record.id, tabKey: 'withdrawInfo'}})">￥{{ record.totalWithdrawAmount }}</a-typography-link>
                </a-tooltip>
              </a-flex>
            </template>

            
            <template v-if="column.dataIndex==='amount'">
              {{record['totalAmount']||'/'}}
            </template>
            <template v-if="column.dataIndex==='isEnable'">
              <a-flex align="center">
                <a-switch @change="changeEnable(record)" checked-children="是" un-checked-children="否" :checked="record.isEnable" :checked-value="true" :un-checked-value="false"></a-switch>
                <a-tooltip v-if="!record.isEnable">
                  <template #title>{{record.isErrorAutoClose ? (record as ChannelListResponse).closeReason?? '渠道已关闭' : '渠道已关闭' }}</template>
                  <QuestionCircleOutlined style="color: red; margin-left: 3px;" />
                </a-tooltip>
              </a-flex>
              <!-- <a-flex :gap="5"  justify="space-between" align="center" >
                <a-flex v-if="record['isEnable']" align="center"  justify="center">
                  <a-tag :bordered="false" color="success">已开启</a-tag>
                  <a-tooltip>
                    <template #title>关闭渠道</template>
                    <FormOutlined @click="changeEnable(record)" style="color: #1677ff;" />
                  </a-tooltip>
                  
                </a-flex>
                
                <a-flex v-else align="center"  justify="center">
                  <a-tooltip >
                    <template #title>{{(record as ChannelListResponse).closeReason?? '渠道已关闭' }}</template>
                    <a-tag :bordered="false" color="error">
                      <span>已关闭<QuestionCircleOutlined /></span>
                    </a-tag>
                  </a-tooltip>
                  <a-tooltip >
                    <template #title>开启渠道</template>
                    <FormOutlined @click="changeEnable(record)" style="color: #1677ff;" />
                   
                  </a-tooltip>
                </a-flex>
                
              </a-flex> -->
            </template>
            <template v-if="column.dataIndex==='groupInfo'">
              <a-flex :gap="10"  justify="space-between" align="center" >
                <a-typography-text  v-if="record['groupCode']" >{{record['groupName']}}</a-typography-text>
                <a-typography-text  v-else>/</a-typography-text>
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='channelType'">
              <a-flex :gap="5" >
                <AlipaySquareFilled v-if="[PayChannelType.ALI,PayChannelType.ALI_USER].indexOf(record['channelType'])>=0" style="color: dodgerblue;font-size: 18px"/>
                <a-typography-text strong  style="font-size: 12px">{{getPayChannelTypeText(record['channelType'])}}</a-typography-text >
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='test'">
              
            </template>
            <template v-if="column.dataIndex==='action'">
              <a-flex :gap="10">

                <a-dropdown :trigger="['click']">
                  <a class="ant-dropdown-link" @click.prevent>
                    更多操作
                    <DownOutlined />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="0">
                        <a-button style="padding-left: 0" type="link" @click="router.push({path:'/channel/info',query:{id:record.id}})">查看详情</a-button>
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="clone">
                        <a-button style="padding-left: 0" type="link" @click="handleShowClone(record)">克隆渠道</a-button>
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item v-if="!record.isEnable" key="1">
                        <a-button type="link" @click="router.push({path:'/channel/edit',query:{id:record['id']}})" style="padding-left: 0">编辑渠道</a-button>
                      </a-menu-item>
                      <a-menu-divider v-if="!record.isEnable" />
                      <a-menu-item key="2">
                        <a-button @click="handleWithdraw(record)" type="link" style="padding-left: 0">渠道提现</a-button>
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="areaBlackList">
                        <a-button style="padding-left: 0" type="link" @click="handleAddAreaBlackList(record)">渠道地区权限</a-button>
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-divider v-if="record.isEnable" />
                      <a-menu-item v-if="record.isEnable" key="3">
                        <a-button type="primary" size="small" :disabled="!record.isEnable" @click="router.push({path:'/channel/test',query:{id:record.id}})" style="padding: 0 10px" >渠道测试</a-button>
                      </a-menu-item>
                      
                    </a-menu>
                  </template>
                </a-dropdown>
                
              </a-flex>
            </template>
          </template>
        </a-table>
      </a-card>


    </a-flex>
  </a-spin>
</template>

<style scoped lang="less">

</style>