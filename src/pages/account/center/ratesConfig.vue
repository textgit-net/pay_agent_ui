<script setup lang="ts">
import {AlipayOutlined,FormOutlined,ExclamationCircleOutlined,QuestionCircleOutlined } from "@ant-design/icons-vue"
import CopyTextBtn from '@/components/copy-text-btn/index.vue'
import {ColumnsType} from "ant-design-vue/es/table";
import { AgentInfo, getAgentInfo, changeAgentProducts} from '~/api/agent/index'
import type { ProductItem} from '@/api/channel/group'
import addProductRateDialog from '@/pages/channel/components/add-product-rate-dialog.vue';
import { message } from "ant-design-vue";
const userStore = useUserStore()
const route = useRoute()
const {id}= route.query
const state = reactive({
  isLoading: false,
  isShowRate: false
})

const productRateList = computed(()=> {
  let list:ProductItem[] = []
  if (userStore.userInfo) {
    list = userStore.userInfo.products
  }
  return productRateList
})


onMounted(async ()=>{
  
  
})


const columns:ColumnsType =[
  // {
  //   title: '产品名称',
  //   dataIndex: 'productName',
  //   width: '25%'
  // },
  {
    title: '产品代码',
    dataIndex: 'productCode',
    width: '25%'
  },
  {
    title: '产品权限',
    dataIndex: 'isEnable',
    width: '25%'
  },
  {
    title:'产品费率',
    dataIndex:'rates'
  }
]
</script>

<template>
  <a-card :loading="state.isLoading" :bodyStyle="{padding: '30px 20px '}">
    <!-- <addProductRateDialog v-model:visible="state.isShowRate" :products="productRateList" @on-success="onSuccess"></addProductRateDialog> -->
    <a-flex vertical>
      <a-space>
        <a-typography-text strong>
          支付产品 
        </a-typography-text>
        <!-- <a-button @click="handleAddProduct" type="link">调整</a-button> -->
      </a-space>
      
      <a-table :loading="state.isLoading" bordered size="small" :columns="columns" :data-source="userStore.userInfo.products" class="mt-4" :pagination="false">
        <!-- <template #emptyText>
          <a-empty></a-empty>
          <a-button type="primary" @click="router.push({path:'/mch/edit'})" >添加商户</a-button>
        </template> -->
        <template #bodyCell="{ column , record}">

          <template v-if="column.dataIndex==='productName'">
            <a-tooltip>
              <template #title >支付产品</template>
             <a-typography-text>{{ record.productName ?? '/' }}</a-typography-text>
            </a-tooltip>
          </template>

          <template v-if="column.dataIndex==='productCode'">
            <a-typography-text>{{ record.productCode ?? '/' }}</a-typography-text>
            <CopyTextBtn :copytext="record.productCode" style="padding-left: 10px;"></CopyTextBtn>
          </template>

          <template v-if="column.dataIndex=='isEnable'">
            <a-flex align="center"  justify="start">
              <a-tag v-if="record.isEnable" :bordered="false" color="success">已开启</a-tag>
              <a-tag v-else :bordered="false" color="error">已关闭</a-tag>
            </a-flex>
            
          </template>
          <template v-if="column.dataIndex==='rates'">
            <a-typography-text>{{ record.freeRate ? `${(record.freeRate * 100).toFixed(1)}%` : '0%' }}</a-typography-text>
          </template>
        </template>
      </a-table>

    </a-flex>

  </a-card>
</template>

<style lang="less">
.tttt .table-striped td {
  background-color: rgba(255, 77, 79, .03);
}
.tttt .table-striped td {
  background-color: rgba(255, 77, 79, .03);
}

.tttt .ant-table-tbody tr.ant-table-row:hover td, .tttt .ant-table-tbody tr td.ant-table-cell-row-hover{
  background: rgba(255, 77, 79, .03) !important;
}

// .tttt .ant-table-row-hover,.tttt .ant-table-tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td,
// .tttt .ant-table-row-hover.ant-table-row-selected > td {
//   background: rgba(255, 77, 79, .01) !important;
// }
</style>