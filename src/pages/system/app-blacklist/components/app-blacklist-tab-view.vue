<script setup lang="ts">
import {PropType} from "vue";
import { DownOutlined,AndroidOutlined,DeleteOutlined,CopyOutlined, AppleOutlined,MoreOutlined, SearchOutlined,DeleteFilled,FireFilled,PlusOutlined} from '@ant-design/icons-vue'
import {ClientPlatform, MediationNetworkType} from "~/utils/constant.ts";
import {ColumnsType} from "ant-design-vue/es/table";
import {ApplicationBlacklistInfo, ApplicationBlacklistSearch, fetchAppBlacklist, AddBlackAppRequset,addBlackApp } from "~/api/system/appBlacklist.ts";
import {PaginationProps, message} from "ant-design-vue";
import {ApplicationInfo} from "~/api/application.ts";

const props = defineProps({
  clientPlatform:{
    type: String as PropType<ClientPlatform>,
    required:true,
    default:():string | undefined => undefined
  }
})
const columns:ColumnsType =[
  {
    title: '应用',
    dataIndex: 'name',
  },
  {
    title:'包名',
    dataIndex: 'packageName'
  },
  {
    title:"操作",
    dataIndex: 'action',
  },
]
const search=reactive<ApplicationBlacklistSearch>(<ApplicationBlacklistSearch>{
  page:1,limit:10,clientPlatform:props.clientPlatform
})
const dataSource = shallowRef<ApplicationBlacklistInfo[]>([])
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
    loadData()
  },
})
const state=reactive<{
  tableLoad:boolean,
  isShowEditModal:boolean,
  isSaveLoading:boolean,
}>({
  tableLoad:false,
  isShowEditModal:false,
  isSaveLoading:false,
})

const form = ref<AddBlackAppRequset>({
    name: '',
    packageName: '',
    clientPlatform: ''
})

const doSearch=async ()=>{
  Object.assign(search,{
    page:1,limit:10,clientPlatform:props.clientPlatform
  })
  await loadData()
}
const loadData=async ()=> {
  if (state.tableLoad)
    return
  state.tableLoad = true
  try {
    const { data } = await fetchAppBlacklist({
      ...search,
      page: pagination.current,
      limit: pagination.pageSize,
    })
    dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
  }
  catch (e) {
    console.log(e)
  }
  finally {
    state.tableLoad = false
  }
}

const handleAddBlackApp = () => {
  state.isShowEditModal = true
  form.value= {
    name: '',
    packageName: '',
    clientPlatform: 'ANDROID'
  }

}

const btnSubmit = async ()=>{
  let { name, packageName} = form.value
  if (name == '' || packageName == '') {
    message.warn('请先完善信息再提交');
    return;
  }
  try {
    let res = await addBlackApp(form.value)
    state.isShowEditModal = false
    pagination.current = 1;
    loadData()
    message.success('操作成功')
  } catch (error) {
    message.warn(error.message)
  }
   
}

onMounted(()=>{
  loadData()
})
</script>

<template>
<a-flex vertical :gap="15">
 <a-modal @cancel="state.isShowEditModal = false"  @ok="btnSubmit" centered v-model:open="state.isShowEditModal" :width="540" :title="`添加黑名单应用`" destroy-on-close>
    <a-form ref="formRef" layout="vertical" :model="form" class="mt-2">
      <a-form-item :label="`所属平台`" name="clientPlatform">
        <a-radio-group v-model:value="form.clientPlatform" name="radioGroup">
          <a-radio value="ANDROID">安卓</a-radio>
          <a-radio value="IOS" disabled>IOS</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item has-feedback label="应用名称" name="name">
          <a-input v-model:value="form.name" type="text" />
        </a-form-item>
        <a-form-item has-feedback label="包名" name="packageName">
          <a-input v-model:value="form.packageName" type="text" />
        </a-form-item>
    </a-form>
  </a-modal>


    <a-card>
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-input v-model:value="search.name" placeholder="请输入应用名称/包名搜索" >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
        </a-row>
        <a-flex justify="flex-end" :gap="0">
          <a-button type="link">重置筛选</a-button>
          <a-button size="middle" @click="doSearch" type="primary" style="width: 80px">筛选</a-button>
        </a-flex>
      </a-flex>
    </a-card>
    <a-card :body-style="{'padding':'0px'}">
      <template #title>
        <a-button  @click="handleAddBlackApp" type="primary"><PlusOutlined/>新增</a-button>
      </template>
      <template #extra>

      </template>
      <a-table :scroll="{ x: 'max-content' }" :columns="columns" :loading="state.tableLoad" :pagination="pagination" :data-source="dataSource" size="middle" :bordered="false">
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex==='action'">
            <a-flex :gap="5">
              <a-dropdown :trigger="['click']" placement="bottomRight">
                <MoreOutlined/>
                <template #overlay>
                </template>
              </a-dropdown>
            </a-flex>
          </template>
          <template v-if="column.dataIndex==='name'">
            <a-space>
              <a-avatar shape="square" :src="`${`data:image/png;base64,${record['icon']}`}`"></a-avatar>
              <a-typography-text>{{record.name}}</a-typography-text>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>