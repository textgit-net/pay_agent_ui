<script setup lang="ts">
import {MoreOutlined,DownOutlined, FireFilled, PlusOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {NetworkInfo} from "~/api/network.ts";
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import {getLeagueSpuChannelText, LeagueSpuSearch} from "~/api/league/leagueSpu.ts";
import {MediationUnitCodeResponse} from "~/api/mediationUnitCode.ts";
const columns:ColumnsType =[
  {
    title: '商品名称',
    dataIndex: 'name',
    fixed:'left',
    ellipsis:true,
    maxWidth:'300px',
    minWidth:'300px',
    width:'300px'
  },
  {
    title: '分类',
    align:'left',
    width:"120px",
    dataIndex: 'categoryPathName',
  },
  {
    title: '渠道价格',
    align:'center',
    dataIndex: 'channelSpuPrice',
  },
  {
    title: '价格',
    align:'center',
    dataIndex: 'price',
  },
  {
    title: '佣金',
    align:'center',
    dataIndex: 'commission',
  },
  {
    title: '累积销量',
    align:'center',
    dataIndex: 'saleCount',
  },
  {
    title: '渠道',
    align:'center',
    dataIndex: 'channelTypeText',
  },
  {
    title: '添加日期',
    align:'left',
    width:"120px",
    dataIndex: 'createTime',
  },
  {
    title:'操作',
    align:'left',
    fixed:'right',
    width:"150px",
    dataIndex: 'action',
  },
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
const dataSource=shallowRef<NetworkInfo[]>([])
const state=reactive({
  dataSourceLoading:false
})
const search=reactive<LeagueSpuSearch>({
  channelType:null,
  saleStatus:null,
  priceRangeType:1,
  priceRange:{
    min:0,
    max:0,
  }
})
const loadData=async ()=>{
  state.dataSourceLoading=true
  let {data}=await  useGet<any[]>("/league/product/page",{
    ...search,
    page: pagination.current,
    limit: pagination.pageSize,
  })
  dataSource.value = data?.rows ?? []
  pagination.total = data?.total ?? 0
  state.dataSourceLoading=false
}
const router=useRouter();

onMounted(()=>{
  loadData()
})

</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>商品管理</a-typography-text>
      </a-flex>
    </a-card>
    <a-card :body-style="{padding:'15px'}">
      <a-row :gutter="[16,16]">
        <a-col :span="8">
          <a-input v-model:value="search.keyword" placeholder="请输入商品ID/名称进行搜索">
            <template #prefix>
              <SearchOutlined style="color:#bfc1c5"/>
            </template>
          </a-input>
        </a-col>
        <a-col :span="8">
          <a-select style="width: 100%" v-model:value="search.channel">
            <a-select-option :value="null" label="不限">供应链渠道: 不限</a-select-option>
            <a-select-option :value="1" label="代发兔">供应链渠道: 代发兔</a-select-option>
            <template #option="{ value: val, label, icon }">
              {{label}}
            </template>

          </a-select>
        </a-col>
        <a-col :span="8">
          <a-select style="width: 100%" v-model:value="search.saleStatus">
            <a-select-option :value="null" label="不限">销售状态: 不限</a-select-option>
            <a-select-option :value="1" label="上架">销售状态: 上架</a-select-option>
            <a-select-option :value="2" label="下架">销售状态: 下架</a-select-option>
            <template #option="{ value: val, label, icon }">
              {{label}}
            </template>

          </a-select>
        </a-col>
<!--        <a-col :span="6">-->
<!--        <a-col style="width: 100%" >-->
<!--          <a-input-group compact>-->
<!--            <a-select v-model:value="search.priceRangeType">-->
<!--              <a-select-option :value="1">佣金比例</a-select-option>-->
<!--              <a-select-option :value="2">商品原价</a-select-option>-->
<!--            </a-select>-->
<!--            <a-input-number-->
<!--                v-if="search.priceRangeType==1"-->
<!--                :min="0"-->
<!--                :parser="value => value.replace('%', '')"-->
<!--                :max="100"-->
<!--                :formatter="value => `${value}%`"-->
<!--                v-model:value="search.priceRange.min"-->
<!--                style="width: 100px; text-align: center"-->
<!--                placeholder="Minimum"-->
<!--            />-->
<!--            <a-input-number-->
<!--                v-if="search.priceRangeType==2"-->
<!--                :min="0"-->
<!--                :max="99999"-->
<!--                v-model:value="search.priceRange.min"-->
<!--                style="width: 100px; text-align: center"-->
<!--                placeholder="Minimum"-->
<!--            />-->
<!--            <a-input-->
<!--                class="site-input-split"-->
<!--                style="width: 30px; border-left: 0; pointer-events: none"-->
<!--                placeholder="~"-->
<!--                disabled-->
<!--            />-->
<!--            <a-input-number-->
<!--                v-if="search.priceRangeType==1"-->
<!--                v-model:value="search.priceRange.max"-->
<!--                class="site-input-right"-->
<!--                style="width: 100px; text-align: center"-->
<!--                placeholder="Maximum"-->
<!--                :min="search.priceRange.min"-->
<!--                :parser="value => value.replace('%', '')"-->
<!--                :max="100"-->
<!--                :formatter="value => `${value}%`"-->
<!--            />-->
<!--            <a-input-number-->
<!--                v-if="search.priceRangeType==2"-->
<!--                v-model:value="search.priceRange.max"-->
<!--                class="site-input-right"-->
<!--                style="width: 100px; text-align: center"-->
<!--                placeholder="Maximum"-->
<!--                :min="search.priceRange.min"-->
<!--                :max="99999"-->
<!--            />-->
<!--          </a-input-group>-->
<!--        </a-col>-->
<!--        </a-col>-->
      </a-row>
      <a-flex justify="flex-end" class="mt-4">
        <a-button type="link" size="middle"> 重置筛选</a-button>
        <a-button type="primary" size="middle"  style="width: 80px;"> 筛选</a-button>
      </a-flex>
    </a-card>
    <a-card :body-style="{'padding':'0px'}">
      <template #title>
        <a-button size="middle"  @click="router.push({path:'/league/product/market'})" type="primary"><PlusOutlined/>添加商品</a-button>
      </template>
      <a-table  class="" :scroll="{x: 'max-content'}" :bordered="false" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" >
        <template #emptyText>
          <a-empty></a-empty>
          <a-button size="middle"  @click="" type="primary"><PlusOutlined/>添加商品</a-button>
        </template>
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex==='action'">
            <a-flex justify="space-between"  align="center">
              <a-flex :gap="5" align="center">
                <a-switch :checked-value="1"
                          :un-checked-value="0"
                          :checked="record.saleStatus"
                          checked-children="上架"
                          un-checked-children="下架" />
                <a @click="openEditModal(record as MediationUnitCodeResponse)">编辑</a>
              </a-flex>
              <a-dropdown :trigger="['click']">
                <MoreOutlined />
                <template  #overlay>
                  <a-menu>
                    <a-menu-item>商品分析</a-menu-item>
                    <a-menu-item>订单查询</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-flex>
          </template>

          <template v-if="column.dataIndex==='name'">
            <a-flex :gap="10" style="width: 300px">
              <a-image style="width: 50px;height: 50px" :src="record['displayPicture']"></a-image>
              <a-flex vertical>
                <a-typography-text type="secondary">ID:{{record['id']}}</a-typography-text>
                <a-typography-text ellipsis strong>{{record['name']}}</a-typography-text>
                <a-typography-text ellipsis type="secondary">{{record['subName']}}</a-typography-text>
              </a-flex>
            </a-flex>
          </template>

        </template>
      </a-table>
    </a-card>

  </a-flex>
</template>

<style scoped lang="less">

</style>