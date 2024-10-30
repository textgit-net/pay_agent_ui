<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import {PlusOutlined} from "@ant-design/icons-vue"
import {
  changeChannelGroupEnable, ChannelGroupFormData,
  ChannelGroupListResponse, ChannelGroupSearch, saveChannelGroup, searchChannelGroup
} from "~/api/channel/group.ts";

const router = useRouter()

const columns:ColumnsType =[
  {
    title: '分组',
    dataIndex: 'name',
  },

  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '渠道数量',
    dataIndex: 'channelCount',
  },
  {
    title: '启用状态',
    dataIndex: 'isEnable',
  },
  {
    title:'创建时间',
    dataIndex:'createTime'
  },
  {
    title:'操作',
    fixed:'right',
    width:'80px ',
    dataIndex: 'action',
  },
]

const state=reactive({
  isShowEditModal:false,
  commonSpinning:false,
  isSaveLoading:false,
  dataSourceLoading:false,

})
const formRef=ref()
const initChannelGroupFormData = ():ChannelGroupFormData => {
  return {
    isEnable:true,
    description: '',
    groupCode: '',
    name: '',
  }
}
const formData=ref<ChannelGroupFormData>(initChannelGroupFormData())
const isDisAbledChannelGroupForm = computed(() => {
  return !formData.value.description || !formData.value.name || !formData.value.groupCode || state.isSaveLoading
})

const searchParams=reactive<ChannelGroupSearch>({
  page:1,
  limit:10
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

  },
})
const dataSource=shallowRef<ChannelGroupListResponse[]>([])

const loadData=async (showTableLoading:boolean=true)=>{
  if(showTableLoading){
    if (state.dataSourceLoading)
      return
    state.dataSourceLoading = true
  }
  try {
    const { data } = await searchChannelGroup({
      ...searchParams,
      page: pagination.current,
      limit: pagination.pageSize,
    })
    dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
  }
  finally {
    if(showTableLoading){
      state.dataSourceLoading = false
    }
  }
}
const resetSearch=async ()=>{
  searchParams.keyword=null
  pagination.current=1
  loadData().then(_ => {})
}
const changeEnableStatus=async (record: ChannelGroupListResponse) => {
    state.commonSpinning=true
    try{
        await changeChannelGroupEnable(record.groupCode)
        await loadData(false)
    }finally {
       state.commonSpinning = false
    }
}

const openEditModel=(record?:ChannelGroupListResponse)=>{
  
   state.isShowEditModal=true
   nextTick(() => {
    formRef.value.resetFields()
   }).then(_=> {
    if(record){
      formData.value = Object.assign(formData.value, record)
    } else {
      formData.value = initChannelGroupFormData();
    }
   })
   
}

const onsubmit=async ()=>{
  formRef.value.validate().then(async()=> {
    state.isSaveLoading=true
    try {
     await saveChannelGroup(formData.value)
     await loadData(false)
     state.isShowEditModal=false
    }finally {
      state.isSaveLoading=false
    }
  })
}
onMounted(()=>{
  loadData()
})
</script>

<template>
 <a-spin :spinning="state.commonSpinning">
   <a-flex vertical :gap="10" style="width: 100%;height: 100%">
     <!--头部-->
     <a-card :body-style="{padding:'15px'}">
       <a-flex justify="space-between">
         <a-typography-text>渠道组</a-typography-text>
       </a-flex>
     </a-card>

     <a-card :body-style="{padding:'0px'}">
       <template #title>
         <a-flex  :gap="15">
           <a-input v-model:value="searchParams.keyword" style="width: 250px" placeholder="支持ID/名称查询" />
           <a-button type="link" style="padding-left: 0px" @click="resetSearch" >重置筛选</a-button>
           <a-button type="primary" style="width: 80px"  @click="loadData(true)">筛选</a-button>
           <a-button @click="openEditModel(null)" type="primary" style="width: 80px">添加分组</a-button>
         </a-flex>
       </template>
       <template #extra>
       </template>
       <a-table  ref="tableRef" :scroll="{x: 1200}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
         <template #emptyText>
           <a-empty></a-empty>
           <a-button @click="openEditModel(null)" type="primary" ><PlusOutlined/>添加分组</a-button>
         </template>
         <template #bodyCell="{ column , record}">


          <template v-if="column.dataIndex=='name'">
            <a-flex vertical :gap="5" align="start">
              <a-button style="padding-left: 0" type="link" @click="router.push({path:'/agent/info',query:{id:record.agentInfo.id}})">{{record.name}}</a-button>
              <a-typography-text type="secondary">编号:{{record['groupCode']}}</a-typography-text>
            </a-flex>
          </template>
           <template v-if="column.dataIndex==='channelCount'">
             <a-typography-link v-if="record['channelCount']>0">{{record['channelCount']}}</a-typography-link>
             <a-typography-text v-else>/</a-typography-text>
           </template>
           <template v-if="column.dataIndex==='isEnable'">
             <a-switch :checked="record['isEnable']" @click="changeEnableStatus(record as ChannelGroupListResponse)"></a-switch>
           </template>

           <template v-if="column.dataIndex==='action'">
             <a-flex :gap="10">
               <a-button @click="openEditModel(record as ChannelGroupListResponse)"  type="link" style="padding-left: 0px">编辑</a-button>
             </a-flex>
           </template>
         </template>
       </a-table>
     </a-card>
   </a-flex>

   <a-modal
      v-model:open="state.isShowEditModal"
      :mask-closable="false"
      :closable="true" centered :width="420" :title="formData.id?'编辑分组':'创建分组'"
    >
    <template #footer>
      <a-button key="back" @click="state.isShowEditModal =false">取 消</a-button>
      <a-button key="submit" type="primary" :loading="state.isSaveLoading" :disabled="isDisAbledChannelGroupForm" @click="onsubmit">确 认</a-button>
    </template>
    <a-form ref="formRef" :model="formData" layout="vertical">
      <a-form-item name="groupCode" :rules="{required:true,message:'请输入分组编号'}" label="分组编号">
          <a-input placeholder="请输入分组编号" :disabled="!!formData.id" v-model:value="formData.groupCode" allow-clear></a-input>
      </a-form-item>
      <a-form-item name="name" :rules="{required:true,message:'请输入分组名称'}"  label="分组名称" >
        <a-input placeholder="请输入分组名称" v-model:value="formData.name" allow-clear></a-input>
      </a-form-item>
      <a-form-item name="description" :rules="{required:true,message:'请输入分组描述'}"  label="分组描述">
        <a-textarea  allow-clear placeholder="请输入分组名称" v-model:value="formData.description" :rows="2"></a-textarea >
      </a-form-item>
    </a-form>
   </a-modal>
 </a-spin>
</template>

<style scoped lang="less">

</style>