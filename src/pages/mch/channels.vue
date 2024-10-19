<script setup lang="ts">

import Trend from "~/pages/dashboard/analysis/trend.vue";
import ChartCard from "~/pages/dashboard/analysis/components/chart-card.vue";
import Field from "~/pages/dashboard/analysis/components/field.vue";
import {InfoCircleOutlined} from "@ant-design/icons-vue";
import {ColumnsType} from "ant-design-vue/es/table";
import {TinyArea, TinyColumn} from "@antv/g2plot";
const orderCountColumnContainer = ref()
const orderCountColumn = shallowRef()
const successCountColumnContainer = ref()
const successCountColumn = shallowRef()
const errorCountColumnContainer = ref()
const errorCountColumn = shallowRef()
const channelColumns:ColumnsType =[
  {
    title: '渠道名称',
    dataIndex: 'name',
    width:'150px',
    fixed: 'left'
  },
  {
    title: '商户信息',
    width:'150px',
    dataIndex: 'mchInfo',
    fixed: 'left',
  },
  {
    title: '渠道类型',
    width:'150px',
    fixed: 'left',
    dataIndex: 'channelType',
  },
  {
    title: '启用状态',
    width:'100px',
    fixed: 'left',
    className:'right-border',
    dataIndex: 'isEnable',
  },
  {
    title: '权重',
    className:'right-border',
    width:'130px',
    dataIndex: 'weight',
  },
  {
    title: '分组',
    width:'130px',
    className:'right-border',
    dataIndex: 'groupInfo',
  },
  {
    title: '交易总数',

    align:'center',
    dataIndex: 'successAmount',
  },
  {
    title: '交易总额',

    align:'center',
    dataIndex: 'successAmount',
  },
  {
    title: '成交总额',
    align:'center',
    dataIndex: 'successAmount',
  },
  {
    title: '成交订单',

    align:'center',
    dataIndex: 'successCount',
  },
  {
    title: '成功率',

    align:'center',
    className:'right-border',
    dataIndex: 'successRate',
  },
  {
    title:'创建时间',
    align:'left',
    dataIndex:'createTime'
  },
  {
    title:'操作',
    fixed:'right',
    width:'80px',
    dataIndex: 'action',
  },
]
const orderCountVisitData = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5,0, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5]
const successCountVisitData = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5,0, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5]
const errorCountVisitData = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5,0, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5]
onMounted(() => {
  orderCountColumn.value = new TinyColumn(orderCountColumnContainer.value, {
    height: 46,
    autoFit: true,
    data: orderCountVisitData,
  })
  orderCountColumn.value?.render()


  successCountColumn.value = new TinyArea(successCountColumnContainer.value, {
    height: 46,
    data: successCountVisitData,
    smooth: true,
    autoFit: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#d4bcf2 1:#975FE4',
    },
    line: {
      color: '#975FE4',
    },
  })

  successCountColumn.value?.render()


  errorCountColumn.value = new TinyArea(errorCountColumnContainer.value, {
    height: 46,
    data: errorCountVisitData,
    smooth: true,
    autoFit: true,
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#d4bcf2 1:#975FE4',
    },
    line: {
      color: '#975FE4',
    },
  })
  errorCountColumn.value?.render()
})
</script>

<template>
  <div >
    <a-card :body-style="{padding:'10px'}" title="商户指标数据">
      <a-row :gutter="24">
        <a-col :span="6">
          <ChartCard :bordered="false" title="总交易额" :loading="false" :content-height="46">
            <template #action>
              <a-tooltip title="指标说明">
                <InfoCircleOutlined />
              </a-tooltip>
            </template>
            <template #total>
              <span>{{ `¥100` }}</span>
            </template>
            <template #footer>
              <Field label="日销售额" value="￥12,423" />
            </template>
            <Trend flag="up" :style="{ marginRight: '16px' } ">
              周同比
              <span class="trendText">12%</span>
            </Trend>
            <Trend flag="down">
              日同比
              <span class="trendText">11%</span>
            </Trend>
          </ChartCard>
        </a-col>
        <a-col :span="6">
          <ChartCard :bordered="false" title="交易笔数" :loading="false" :content-height="46">
            <template #action>
              <a-tooltip title="指标说明">
                <InfoCircleOutlined />
              </a-tooltip>
            </template>
            <template #total>
              <span>{{ `411` }}</span>
            </template>
            <template #footer>
              <Field label="今日" value="60%" />
            </template>
            <div ref="orderCountColumnContainer" />
          </ChartCard>
        </a-col>
        <a-col :span="6">
          <ChartCard :bordered="false" title="成交笔数" :loading="false" :content-height="46">
            <template #action>
              <a-tooltip title="指标说明">
                <InfoCircleOutlined />
              </a-tooltip>
            </template>
            <template #total>
              <span>{{ `411` }}</span>
            </template>
            <template #footer>
              <Field label="今日" value="60%" />
            </template>
            <div ref="successCountColumnContainer" />
          </ChartCard>
        </a-col>
        <a-col :span="6">
          <ChartCard :bordered="false" title="失败笔数" :loading="false" :content-height="46">
            <template #action>
              <a-tooltip title="指标说明">
                <InfoCircleOutlined />
              </a-tooltip>
            </template>
            <template #total>
              <span>{{ `411` }}</span>
            </template>
            <template #footer>
              <Field label="今日" value="60%" />
            </template>
            <div ref="errorCountColumnContainer" />
          </ChartCard>
        </a-col>
      </a-row>

    </a-card>
    <a-card :body-style="{padding:'10px'}" title="商户渠道列表" class="mt-4">
      <template #extra>
        <a-button type="primary">导入商户渠道</a-button>
      </template>
      <a-table size="small" :columns="channelColumns"  ></a-table>
    </a-card>
  </div>
</template>

<style scoped lang="less">

</style>