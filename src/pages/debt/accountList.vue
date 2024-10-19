<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import { PayChannelType, getPayChannelTypeText} from "~/utils/constant.ts";


import {DebtAccountInfo, DebtAccountRequset, modifyDebtAccount, getDebtAccountList } from '~/api/debt/account'
import { changeChannel } from "~@/api/channel/ChannelInterface";

const router=useRouter()
const route = useRoute()

const columns:ColumnsType =[

  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
  },
  {
    title: '分账账户',
    dataIndex: 'accountNo',
  },
  {
    title: '渠道类型',
    dataIndex: 'channelType',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title:'更新时间',
    dataIndex:'updateTime'
  },
  {
    title:'操作',
    dataIndex: 'action',
  },
]
const state=reactive({
  dataSourceLoading:false,
  isSaveLoading:false,
  isShowEditModal: false
})
const formRef=ref()
const initFormData = ():DebtAccountInfo => {
  return {
    realName: '',
    accountNo:'',
    channelType: PayChannelType.ALI
  }
}
const formData=ref<DebtAccountInfo>(initFormData())
const isDisAbledChannelGroupForm = computed(() => {
  return !formData.value.realName || !formData.value.accountNo || !formData.value.channelType || state.isSaveLoading
})


const searchParams = reactive<DebtAccountRequset>({
  page:1,
  limit:10,
  channelType: null
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
    searchParams.page=pagination.current
    searchParams.limit=pagination.pageSize
    router.replace({query: searchParams})
  },
})
const dataSource=ref<DebtAccountInfo[]>([])
const resetSearch=()=>{
  Object.assign(searchParams,{
    keyword:null,
    page:1,
    limit:10
  })
  router.replace({query: searchParams})
}
const filterSearch=()=>{
  // Object.assign(searchParams,{
  //   page:1,
  //   limit:10
  // })
  // await loadData()

  router.push({query: searchParams})
}
const loadData=async  ()=> {
  if (state.dataSourceLoading)
    return
  state.dataSourceLoading = true
  try {
    const { data } = await getDebtAccountList({
      ...searchParams,
      page: pagination.current,
      limit: pagination.pageSize,
    })
    dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
  }
  finally {
    state.dataSourceLoading = false
  }
}

const handleAddAccount = async (item?: DebtAccountInfo) => {
  state.isShowEditModal = true
  console.log('item', item, !item)
  nextTick(() => { formRef.value.resetFields()}).then(_ => {
    if (!item) {
 
      formData.value = initFormData()
    } else {

      formData.value = JSON.parse(JSON.stringify(item))
    }
  })
 
 
}
const onSubmit = async () => {
  formRef.value.validate().then(async()=> {
    state.isSaveLoading=true
    try {
     await modifyDebtAccount(formData.value)
     await loadData()
     state.isShowEditModal=false
    }finally {
      state.isSaveLoading=false
    }
  })
}
const changeChannelType = () => {
  pagination.current=1
  loadData()
}

onMounted(()=>{
  Object.assign(searchParams,route.query??{page:1,limit:1})
  pagination.current=searchParams.page
  pagination.pageSize=searchParams.limit
  loadData()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <a-modal
      v-model:open="state.isShowEditModal"
      :mask-closable="false"
      :closable="false" centered :width="420" :title="formData.id?'编辑分账账户':'创建分账账户'"
    >
    <template #footer>
      <a-button key="back" @click="state.isShowEditModal =false">取 消</a-button>
      <a-button key="submit" type="primary" :loading="state.isSaveLoading" :disabled="isDisAbledChannelGroupForm" @click="onSubmit">确 认</a-button>
    </template>
    <a-form ref="formRef" :model="formData" layout="vertical">
      <a-form-item name="realName" :rules="{required:true,message:'请输入真实姓名'}"  label="真实姓名" >
        <a-input placeholder="请输入真实姓名" v-model:value="formData.realName" allow-clear></a-input>
      </a-form-item>
      <a-form-item name="accountNo" :rules="{required:true,message:'请输入分账账户'}" label="分账账户">
        <a-input placeholder="请输入分账账户" v-model:value="formData.accountNo" allow-clear></a-input>
      </a-form-item>
      <a-form-item name="channelType" :rules="{required:true,message:'请选择渠道类型'}" label="渠道类型">
        <a-radio-group :disabled="!formData.channelType" v-model:value="formData.channelType">
          <a-radio :value="PayChannelType.ALI">{{ getPayChannelTypeText(PayChannelType.ALI) }}</a-radio>
          <a-radio :value="PayChannelType.ALI_USER">{{ getPayChannelTypeText(PayChannelType.ALI_USER) }}</a-radio>
        </a-radio-group>
      </a-form-item>
     
      
    </a-form>
   </a-modal>


    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>分账账户</a-typography-text>
      </a-flex>
    </a-card>
    <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">

          <a-col class="gutter-row" :span="4">
            <a-input v-model:value="searchParams.realName" allow-clear  placeholder="真实姓名" ></a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input v-model:value="searchParams.accountNo" allow-clear  placeholder="分账账号" ></a-input>
          </a-col>
        </a-row>

        <a-flex  :gap="0"  justify="flex-end">
          <a-button type="link" style="padding-left: 0" @click="resetSearch">重置筛选</a-button>
          <a-button  size="small"   @click="filterSearch"  type="primary"  style="width: 80px;height:28px"  >筛选</a-button>
        </a-flex>
      </a-flex>
    </a-card>
    <a-card :body-style="{'padding':'0px'}">
      <template #title>
        <a-radio-group v-model:value="searchParams.channelType" @change="changeChannelType">
          <a-radio :value="null">全部</a-radio>
          <a-radio :value="PayChannelType.ALI">{{ getPayChannelTypeText(PayChannelType.ALI) }}</a-radio>
          <a-radio :value="PayChannelType.ALI_USER">{{ getPayChannelTypeText(PayChannelType.ALI_USER) }}</a-radio>
        </a-radio-group>
        <a-button @click="handleAddAccount(null)" type="primary" style="margin-left: 30px;">添加账户</a-button>
      </template>
      <template #extra>
     
      </template>
      <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
          <a-button v-if="searchParams.page==1" type="primary" @click="handleAddAccount(null)" >添加账户</a-button>
        </template>
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex==='name'">

            <a-flex vertical :gap="5" align="start">
              <a-button style="padding-left: 0" type="link" @click="router.push({path:'/agent/info',query:{id:record.id}})">{{record.name}}</a-button>
              <a-typography-text type="secondary">ID:{{record.id}}</a-typography-text>
            </a-flex>
          </template>
          <template v-if="column.dataIndex==='channelType'">
            <a-flex :gap="5">
              {{ getPayChannelTypeText(record.channelType) }}
            </a-flex>
          </template>
          <template v-if="column.dataIndex==='action'">
            <a-flex :gap="5">
              <a-button style="padding-left: 0" type="link" @click="handleAddAccount(record)">编辑</a-button>
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>