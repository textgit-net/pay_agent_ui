<script setup lang="ts">
import {MoreOutlined,DownOutlined, FireFilled, PlusOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {ColumnsType} from "ant-design-vue/es/table";
import {
  changeGameTaskEnable,
  fetchGamePlatform,
  GamePlatformResponse,
  GameTaskResponse,
  GameTaskSearch,
  getGameTaskPage
} from "~/api/task/gameTask.ts";
import {PaginationProps} from "ant-design-vue";
import {LeagueSpuSearch} from "~/api/league/leagueSpu.ts";
import {saveCompany} from "~/api/company.ts";
import {CommonEnable} from "~/utils/constant.ts";
const message=useMessage()
const messageKey="saveMessageKey"
const columns:ColumnsType =[
  {
    title: 'ID',
    dataIndex: 'id',
    fixed:'left',
    ellipsis:true,
  },
  {
    title: '任务',
    dataIndex: 'name',
    fixed:'left',
    ellipsis:true,
  },
  {
    title: '渠道',
    align:'left',
    dataIndex: 'platformInfo',
  },
  {
    title: '推广ID',
    align:'left',
    dataIndex: 'outTaskId',
  },
  {
    title: '推广价值',
    align:'left',
    dataIndex: 'reward',
  },
  {
    title: '会员佣金',
    align:'left',
    dataIndex: 'userReward',
  },
  {
    title: '是否合作',
    align:'left',
    dataIndex: 'isEnable',
  },
  {
    title: '发布日期',
    align:'left',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    align:'left',
    width:'120px',
    dataIndex: 'action',
  }
]
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
const dataSource=shallowRef<GameTaskResponse[]>([])
const search=reactive<GameTaskSearch>({
  page: 1,
  limit: 10,
})
const state=reactive({
  dataSourceLoading:false
})

const loadData=async ()=>{
  state.dataSourceLoading=true
  let {data}=await  getGameTaskPage({
    ...search,
    page: pagination.current,
    limit: pagination.pageSize,
  })
  dataSource.value = data?.rows ?? []
  pagination.total = data?.total ?? 0
  state.dataSourceLoading=false
}
const router=useRouter();

const changeTaskEnable =async (id:number) => {
  message.loading({content:"loading...",key:messageKey,duration:0})
  try {
    await changeGameTaskEnable(id)
    message.success({content:"修改成功",key:messageKey,duration:3})
    await loadData()
  } catch (e){
    message.error({content:`${e}`,key:messageKey,duration:3})
  }
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
        <a-typography-text>游戏GPL变现任务管理</a-typography-text>
      </a-flex>
    </a-card>

    <a-card :body-style="{'padding':'0px'}">
      <template #title>
        <a-flex justify="space-between" style="width: 100%;">
            <a-flex :gap="10">
              <a-input placeholder="根据ID/名称/推广号查询" />
              <a-button size="middle" type="default">重置</a-button>
              <a-button size="middle" type="primary">筛选</a-button>
            </a-flex>
            <a-button @click="router.push({path:'/game/task/edit'})"  size="middle" type="primary"><PlusOutlined/>添加任务</a-button>
        </a-flex>

      </template>
      <a-table  class="" :scroll="{x: 'max-content'}" :bordered="false" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" >
        <template #emptyText>
          <a-empty></a-empty>
          <a-button size="middle" @click="router.push({path:'/game/task/edit'})" type="primary"><PlusOutlined/>添加任务</a-button>
        </template>
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex === 'name'">
            <a-flex :gap="5" align="center">
              <a-avatar
                  shape="square"
                  :src="record.icon"
                  size="large"
              ></a-avatar>
              <a-flex :gap="0" vertical>
                <a-typography-text strong>{{
                    record.name
                  }}</a-typography-text>
                <a-typography-text type="secondary">{{
                    record.remark
                  }}</a-typography-text>
              </a-flex>
            </a-flex>
          </template>
          <template v-if="column.dataIndex === 'isEnable'">
            <a-switch  :checked="record.isEnable"  @click="changeTaskEnable(record.id)" :un-checked-value="CommonEnable.DISABLE"  :checked-value="CommonEnable.OPEN" ></a-switch>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-flex :gap="5">
              <a-button @click="router.push({path:'/game/task/edit',query:{id:record.id}})" type="link">编辑</a-button>
              <a-button type="link" >收益报表</a-button>
            </a-flex>
          </template>
          <template v-if="column.dataIndex === 'platformInfo'">
            <a-flex :gap="5">
              <a-typography-text strong>{{
                  record.platformInfo.name
                }}</a-typography-text>
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-card>

  </a-flex>
</template>

<style scoped lang="less">

</style>