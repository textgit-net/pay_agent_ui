<script setup lang="ts">
import {AlipayOutlined,WechatOutlined } from "@ant-design/icons-vue"
import {getPayModeTypeText, PayModeTypeSelectOption} from "~/utils/constant.ts";
import {ColumnsType} from "ant-design-vue/es/table";
const columns:ColumnsType =[
  {
    title: '产品名称',
    dataIndex: 'payModeName',
  },
  {
    title: '产品代码',
    dataIndex: 'payModeCode',
  },
  {
    title: '产品权限',
    dataIndex: 'isOpen',
  },
  {
    title:'产品费率',
    dataIndex:'rates'
  }
]
</script>

<template>
  <a-card  >
    <a-flex vertical>
      <a-typography-text style="color: darkblue"><AlipayOutlined/> 支付宝</a-typography-text>
      <a-table bordered size="small" :columns="columns" class="mt-4">

      </a-table>
      <a-typography-text style="color: darkgreen" class="mt-4"><WechatOutlined/> 微信</a-typography-text>
      <a-table bordered size="small" :columns="columns" class="mt-4">

      </a-table>
    </a-flex>

  </a-card>
</template>

<style scoped lang="less">

</style>