<script setup lang="ts">
import {AlipayOutlined,FormOutlined,ExclamationCircleOutlined,QuestionCircleOutlined } from "@ant-design/icons-vue"
import type { Rule } from 'ant-design-vue/es/form';
import { createVNode} from 'vue'
import {PayModeType} from "~/utils/constant.ts";
import {PaginationProps,Modal,message} from "ant-design-vue";
import CopyTextBtn from '~/components/copy-text-btn/index.vue'

import {ColumnsType} from "ant-design-vue/es/table";
import {getMerchantInfo, MerchantInfo, ProductRateItem} from '~/api/merchant'
import { switchProduct, PayModeRatesRequest, updateProductRates } from '~@/api/merchant/rates'
const route = useRoute()
const router = useRouter()
const {id}= route.query

const state = reactive<{
  isLoading:boolean;
  showRateDialog: boolean;
  dialogBtnLoading: boolean;
  isShowDisabledTabel: boolean;
}>({
  isLoading: false,
  showRateDialog: false,
  dialogBtnLoading: false,
  isShowDisabledTabel: true
})

const info=ref<MerchantInfo>({
  products: []
})

const isOPenPayModeRates = ref<ProductRateItem[]>([])
const isClosePayModeRates = ref<ProductRateItem[]>([])

const selectPayModeRateItem = ref<ProductRateItem>({})

const initFormData = ():PayModeRatesRequest => {
  return {
    mchId: id as string,
    rates: '',
  }
} 
const formData = ref<PayModeRatesRequest>(initFormData())


const getInfo=async ()=>{
  state.isLoading=true
  const {data} =await getMerchantInfo(id as string)
  isOPenPayModeRates.value = data.products

  info.value = data
  
  state.isLoading=false
}

const handleFixRates = async (item:ProductRateItem)=>{
  selectPayModeRateItem.value = item;
  formData.value = Object.assign(formData.value, item)
  state.showRateDialog = true
}

const validateRate =  async (_rule: Rule, value: string) => {
  if (Number(value) > 100) {
    return Promise.reject(`最高费率不能超过100%`);
  } else if(value == null || value == undefined || value == '') {
    return Promise.reject(`请输入费率`);
  } else {
    return Promise.resolve();
  }
};

const changeEnable=async (item:ProductRateItem)=>{
  formData.value = Object.assign(formData.value, item)
  let content = item.isEnable ? '确认关闭当前支付产品吗？' : '确认开启当前支付产品吗？'
  Modal.confirm({
    title: '温馨提示',
    icon: item.isEnable? createVNode(ExclamationCircleOutlined): null,
    content: content,
    okText: '确认',
    centered: false,
    cancelText: '取消',
    async onOk() {
      try {
        let res = await switchProduct(formData.value)
        message.success('操作成功')
        await getInfo()
      } catch {
        
      }
    },
    onCancel() {},
  });
}

const handleBaseInfoOk = async () => {
  state.dialogBtnLoading = true
  
  try {
    let res = await updateProductRates(formData.value)
    message.success('操作成功')
    state.showRateDialog = false
    await getInfo()
  } catch {
    
  } finally {
    state.dialogBtnLoading = false
  }
}

getInfo()


const columns:ColumnsType =[
  {
    title: '产品名称',
    dataIndex: 'productName',
    width: '25%'
  },
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
  <a-card  >
    <a-modal v-model:open="state.showRateDialog" title="设置产品费率">
      <template #footer>
        <a-button key="back" @click="state.showRateDialog = false">取 消</a-button>
        <a-button key="submit" :disabled="formData.rates === '' || formData.rates == undefined" type="primary" :loading="state.dialogBtnLoading" @click="handleBaseInfoOk">保 存</a-button>
      </template>
      <a-form
        ref="formRef"
        style="padding: 30px 0;"
        :model="formData"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item
          label="当前支付产品"
        >
          {{ selectPayModeRateItem.productName }} | {{ selectPayModeRateItem.productCode }}
        </a-form-item>
        <a-form-item
          label="产品费率"
          name="rates"
          :rules="[{ required: false, validator: validateRate }]"
        >
          <a-input v-model:value="formData.rates" style="width: 120px;"  />%
        </a-form-item>
      </a-form>
    </a-modal>

    <a-flex vertical>
      <a-typography-text style="color: darkblue"><AlipayOutlined/> 支付宝</a-typography-text>
      <a-table :loading="state.isLoading" bordered size="small" :columns="columns" :data-source="isOPenPayModeRates" class="mt-4" :pagination="false">
        <!-- <template #emptyText>
          <a-empty></a-empty>
          <a-button type="primary" @click="router.push({path:'/mch/edit'})" >添加商户</a-button>
        </template> -->
        <template #bodyCell="{ column , record}">

          <template v-if="column.dataIndex==='payModeName'">
            <a-tooltip v-if="record.isDisable">
              <template #title >当前支付产品已被禁用</template>
              <QuestionCircleOutlined style="color: red;" /><a-typography-text type="danger">{{ record.payModeName ?? '/' }}</a-typography-text>
            </a-tooltip>
            <a-tooltip v-else>
              <template #title>支付产品</template>
              <a-typography-text>{{ record.payModeName ?? '/' }}</a-typography-text>
            </a-tooltip>
          </template>

          <template v-if="column.dataIndex==='payMode'">
            <a-typography-text>{{ record.payMode ?? '/' }}</a-typography-text>
            <CopyTextBtn :copytext="record.payMode" style="padding-left: 10px;"></CopyTextBtn>
          </template>

          <template v-if="column.dataIndex=='isEnable'">
            <a-flex align="center"  justify="start">

           

              <a-flex v-if="record.isEnable" align="center"  justify="start">
                <a-tag :bordered="false" color="success">已开启</a-tag>
                <a-tooltip v-if="!record.isDisable">
                  <template #title>关闭当前支付产品</template>
                  <FormOutlined @click="changeEnable(record)" style="color: #1677ff;" />
                </a-tooltip>
                    
              </a-flex>
              <a-flex v-else align="center"  justify="start">
                <a-tooltip>
                  <template #title>当前支付产品已关闭</template>
                  <a-tag :bordered="false" color="error">
                    已关闭
                  </a-tag>
                </a-tooltip>
                <a-tooltip v-if="!record.isDisable">
                  <template #title>开启当前支付产品</template>
                  <FormOutlined @click="changeEnable(record)" style="color: #1677ff;" />
                </a-tooltip>
              </a-flex>

              <a-tooltip v-if="record.isDisable">
                <template #title >当前支付产品已被禁用</template>
                <QuestionCircleOutlined style="color: red;" />
              </a-tooltip>
            </a-flex>
            
          </template>
         
          <template v-if="column.dataIndex==='rates'">
            <a-typography-text>{{ record.rates>=0 ? `${record.rates}%` : '/' }}</a-typography-text>
            <a-button :disabled="!record.isEnable" @click="handleFixRates(record)" type="link">修改</a-button>
            <a-tooltip v-if="!record.isEnable">
              <template #title >请开启产品权限后再进行修改</template>
              <QuestionCircleOutlined style="color: red;" />
            </a-tooltip>
          </template>
        </template>
      </a-table>
      <a-flex v-if="isClosePayModeRates.length">
        <a-button @click="state.isShowDisabledTabel = !state.isShowDisabledTabel" type="link" style="padding-left: 0; padding-bottom: 0;">【{{isClosePayModeRates.length}}个支付产品被禁用】{{ state.isShowDisabledTabel? '收起《': '展开》' }}</a-button>
      </a-flex>
      <a-table 
        v-if="isClosePayModeRates.length && state.isShowDisabledTabel"
        :loading="state.isLoading"
        bordered
        size="small"
        :columns="columns"
        :data-source="isClosePayModeRates"
        class="mt-4 tttt"
        :pagination="false"
        :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : 'table-striped')"
      >
        <!-- <template #emptyText>
          <a-empty></a-empty>
          <a-button type="primary" @click="router.push({path:'/mch/edit'})" >添加商户</a-button>
        </template> -->
        <template #bodyCell="{ column , record}">

          <template v-if="column.dataIndex==='payModeName'">
            <a-tooltip>
              <template #title >当前支付产品已被禁用</template>
              <QuestionCircleOutlined style="color: red;" /><a-typography-text type="danger">{{ record.payModeName ?? '/' }}</a-typography-text>
            </a-tooltip>
          </template>

          <template v-if="column.dataIndex==='payMode'">
            <a-tooltip>
              <template #title >当前支付产品已被禁用</template>
              <QuestionCircleOutlined style="color: red;" /> <a-typography-text  style="color: red;">{{ record.payMode ?? '/' }}</a-typography-text>
            </a-tooltip>
           
            <CopyTextBtn :copytext="record.payMode" style="padding-left: 10px;"></CopyTextBtn>
          </template>

          <template v-if="column.dataIndex=='isEnable'">
            <a-flex align="center"  justify="start">

           

              <a-flex v-if="record.isEnable" align="center"  justify="start">
                <a-tag :bordered="false" color="success">已开启</a-tag>
                <a-tooltip v-if="!record.isDisable">
                  <template #title>关闭当前支付产品</template>
                  <FormOutlined @click="changeEnable(record)" style="color: #1677ff;" />
                </a-tooltip>
                    
              </a-flex>
              <a-flex v-else align="center"  justify="start">
                <a-tooltip>
                  <template #title>当前支付产品已关闭</template>
                  <a-tag :bordered="false" color="error">
                    已关闭
                  </a-tag>
                </a-tooltip>
                <a-tooltip v-if="!record.isDisable">
                  <template #title>开启当前支付产品</template>
                  <FormOutlined @click="changeEnable(record)" style="color: #1677ff;" />
                </a-tooltip>
              </a-flex>

              <a-tooltip>
                <template #title >当前支付产品已被禁用</template>
                <QuestionCircleOutlined style="color: red;" />
              </a-tooltip>
            </a-flex>
            
          </template>
         
          <template v-if="column.dataIndex==='rates'">
            <a-typography-text style="color: red;">{{ record.rates>=0 ? `${record.rates}%` : '/' }}</a-typography-text>
          
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