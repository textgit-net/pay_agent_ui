<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import { DownOutlined,DeleteFilled,EditFilled,FireFilled,PlusOutlined} from '@ant-design/icons-vue'
import {PaginationProps} from "ant-design-vue";
import {CompanyFormInfo, CompanyInfo, CompanySearch, saveCompany, searchCompany} from "~/api/company.ts";
const router=useRouter()
const columns:ColumnsType =[
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: 'left',
  },
  {
    title: '企业名称',
    dataIndex: 'name',
    fixed: 'left',
  },
  {
    title: '法人',
    dataIndex: 'legalPerson',
  },
  {
    title:'手机号码',
    dataIndex: 'phone'
  },
  {
    title:'创建时间',
    dataIndex: 'createTime',
  },
  {
    title: "余额",
    dataIndex: "balanceAmount",
  },
  {
    title: "保证金",
    dataIndex: "earnestAmount",
  },
  {
    title: "佣金",
    dataIndex: "commissionAmount",
  },
  {
    title:'操作',
    fixed: 'right',
    width:"180px",
    dataIndex: 'action',
  },
]
const tableRef=shallowRef()
const tableSize = useElementSize(tableRef)
const dataSource = shallowRef<CompanyInfo[]>([])

const initSearchParams=():Partial<CompanySearch>=>{
  return {
    page: 1, 
    limit: 10,
    name:""
  }
}

const searchParams = ref<Partial<CompanySearch>>(initSearchParams())
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
  isUpdate:boolean,
  isSaveLoading:boolean,
}>({
  tableLoad:false,
  isShowEditModal:false,
  isSaveLoading:false,
  isUpdate:false,

})

const loadData=async ()=>{
  if (state.tableLoad)
    return
  state.tableLoad = true
  try {
    const { data } = await searchCompany({
      ...searchParams.value,
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

const doSearch =async ()=>{
try{
  const {data}=await  searchCompany({
    ...searchParams.value,
    page:pagination.current,
    limit:pagination.pageSize
  })
  dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
}catch(e){
console.log(e);
}
}

const resetSearch = () => {
  searchParams.value=initSearchParams()
  loadData();
};

onMounted(()=>{
  loadData()
})

</script>

<template>
  <PageContainer>
    <a-card>
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="5">
            <a-input
              v-model:value="searchParams.name"
              placeholder="请输入企业名称查询"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
        </a-row>

        <a-flex justify="flex-end" :gap="0">
          <a-button type="link" @click="resetSearch">重置筛选</a-button>
          <a-button
            size="middle"
            @click="doSearch"
            type="primary"
            style="width: 80px"
            >筛选</a-button
          >
        </a-flex>
      </a-flex>
    </a-card>


    <a-card :body-style="{'padding':'0px'}">
      <template #title>
        <a-button @click="router.push({path:'/company/edit'})" type="primary" ><PlusOutlined/>新增企业</a-button>
      </template>
      <template #extra>
        <a-space>

          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <a style="color: red;">
                    <DeleteFilled />
                    删除企业
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              批量操作
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </a-space>
      </template>
      <a-table ref="tableRef" :scroll="{ x: tableSize.width.value }" :pagination="pagination" :data-source="dataSource" :columns="columns" size="middle" :bordered="false" :loading="state.tableLoad">
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex==='action'">
            <a-flex :gap="5">
              <a-button size="small" type="link" @click="router.push({path:'/company/edit',query:{id:record.id}})">编辑</a-button>
              <a-button size="small" type="link" target="_blank" :href="`/application/list?businessId=${record.id}`">查看应用</a-button>
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<style scoped lang="less">

</style>