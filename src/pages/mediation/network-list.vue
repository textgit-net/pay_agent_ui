<script setup lang="ts">
import {DeleteFilled, MoreOutlined,DownOutlined, FireFilled, PlusOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {ColumnsType} from "ant-design-vue/es/table";
import {onMounted} from "vue";
import {useUserStore} from "~/stores/user.ts";
import {NetworkInfo, NetworkResponse, NetworkSearch, searchNetwork} from "~/api/network.ts";
import NetworkEditModal from "~/pages/mediation/components/network-edit-modal.vue";
import NetworkItem from "~/pages/mediation/components/network-item.vue";
import {CompanySearch} from "~/api/company.ts";
import {PaginationProps} from "ant-design-vue";

const columns:ColumnsType =[
  {
    title: '账户名称',
    dataIndex: 'name',
  },
  {
    title: '企业',
    dataIndex: 'company',
  },
  {
    title: '广告网络',
    dataIndex: 'networkName',
  },
  {
    title: '状态',
    dataIndex: 'isEnable',
  },
  {
    title: '币种',
    dataIndex: 'currency',
  },
  {
    title:'操作',
    dataIndex: 'action',
  },
]
const state=reactive({
  isShowEditModal:false,
  dataSourceLoading:false,
  currentRow:null
})

const searchParams=reactive<NetworkSearch>({
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
    loadData()
  },
})
const dataSource=shallowRef<NetworkInfo[]>([])


const openEditModal=(row?:NetworkInfo)=>{
  state.currentRow=row
  state.isShowEditModal=true
}

const onEditModalClose=(isSuccess:boolean)=>{
  state.isShowEditModal=false
  if(isSuccess){
    loadData()
  }
}

const loadData=async ()=>{
  let res=await searchNetwork({
    ...searchParams,
    page: pagination.current,
    limit: pagination.pageSize,
  })
  dataSource.value=res.data?.rows??[]
  pagination.total = res.data?.total ?? 0
}
onMounted(()=>{
  loadData()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>广告网络</a-typography-text>
      </a-flex>
    </a-card>
    <a-card :body-style="{'padding':'0px'}">

      <a-card style="border: none" :body-style="{padding:'15px'}">
        <a-flex justify="space-between" align="center"  class="report-warp ">
          <a-flex vertical  style="flex: 1" >
            <a-typography-text style="color: rgb(51, 51, 51)">管理广告网络流程</a-typography-text>
            <a-typography-text type="secondary" class="mt-2" style="font-size: 12px;">第 1 步：您可前往 DMPlatform 或其他您有权使用的数据存储平台，完成注册并获取相应的技术服务</a-typography-text>
            <a-typography-text type="secondary" style="font-size: 12px;">第 2 步：通过DMPlatform或其他平台认可的API Key、Token等方式授权GroMore平台获取相关数据（授权可能会有15min左右延迟）</a-typography-text>
            <a-typography-text type="secondary" style="font-size: 12px;">第 3 步：通过DMPlatform或其他平台的技术服务同步各广告网络的报表数据</a-typography-text>
          </a-flex>
          <a-button @click="openEditModal(null)" type="primary">绑定广告网络</a-button>
        </a-flex>
      </a-card>
      <a-table ref="tableRef" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
          <template #emptyText>
              <a-empty></a-empty>
              <a-button @click="openEditModal(null)" type="primary">绑定广告网络</a-button>
          </template>
          <template #bodyCell="{ column , record}">
              <NetworkItem :value="record.type" v-if="column.dataIndex==='networkName'"/>
              <a-switch v-model:checked="record.isEnable" v-if="column.dataIndex==='isEnable'"></a-switch>
              <span v-if="column.dataIndex==='company'">{{record["company"]["name"]??""}}</span>
              <template v-if="column.dataIndex==='name'">
                <a-flex vertical >
                  <a-typography-text>{{record.name}}</a-typography-text>
                  <a-typography-text type="secondary">{{record.id}}</a-typography-text>
                </a-flex>
              </template>
              <template v-if="column.dataIndex==='action'">
                  <a-flex :gap="5">
                    <a  @click="openEditModal(record as NetworkInfo)">编辑</a>
                    <a-dropdown>
                      <a ><MoreOutlined /></a>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item>
                            <a style="color: red">删除</a>
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </a-flex>
              </template>
          </template>
      </a-table>
    </a-card>

    <a-modal v-model:open="state.isShowEditModal" destroy-on-close :footer="null"  centered :width="450" :title="`${state.currentRow?'编辑广告网络':'添加广告网络'}`">
      <NetworkEditModal @onClose="onEditModalClose"  :value="state.currentRow"/>
    </a-modal>
  </a-flex>

</template>

<style scoped lang="less">

</style>