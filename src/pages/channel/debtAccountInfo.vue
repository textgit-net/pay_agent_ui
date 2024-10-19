<script setup lang="ts">

import { reactive} from 'vue';
import { createVNode } from 'vue';
import { cloneDeep } from 'lodash-es';
import type { Rule } from 'ant-design-vue/es/form';
import { Modal, message, Empty } from 'ant-design-vue';
import {QuestionCircleFilled,ExclamationCircleOutlined } from "@ant-design/icons-vue"
import {ContactWay, ContactWaySelectOption,getContactWayText} from "~/utils/constant.ts";
import { getChannelInfo, ChannelInfo, saveChannel,ChannelFormData } from '~/api/channel/ChannelInterface'

import { getAllDebtAccountList,DebtAccountInfo} from '~/api/debt/account'

import { 
  DebtModeEnum,
  DebtStrategyEnum,
  getDebtModeEnumText,
  getDebtStrategyEnumText,
  ChannelDebtAccountRequest,
  ChannelDebtAccountConfig,
  modifyChannelDebtAccount,
  ChannelDebtConfigInfo,
  delChannelDebtAccount,
  getChannelDebtAccountConfig,
  updateChannelDebtAccountConfig,
  AccountInfoItem
} from '~/api/channel/debt'

import { calcFloat } from '~/utils/calcFloat'

import {getPayChannelTypeText, PayChannelType} from "~/utils/constant.ts";
// import {MerchantInfo, modifyMerchant, getMerchantInfo, resetMerchantPwd,MerchantResetPwdRequset } from '~/api/merchant'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const route = useRoute()
const router = useRouter()
const state = reactive<{
  showBaseInfoDialog: boolean;
  showAccountRateDialog: boolean;
  dialogBtnLoading: boolean;
  ShowSettingPwdDialog: boolean;
  isLoading:boolean;
  isOnEditPay:boolean;
  isOnEditChildAgent: boolean;
}>({
  showBaseInfoDialog: false,
  showAccountRateDialog: false,
  dialogBtnLoading: false,
  ShowSettingPwdDialog: false,
  isLoading: false,
  isOnEditPay: false,
  isOnEditChildAgent: false

})
const formRef = ref();
const reteFormRef = ref();
const {id}= route.query

const ininForm = ():ChannelDebtAccountConfig => {
    return {
      
    }
}
const ininRateForm = ():ChannelDebtAccountRequest => {
    return {
      
    }
}
const formData=ref<ChannelDebtAccountConfig>(ininRateForm())
const AccountRateForm = ref<ChannelDebtAccountRequest>(ininForm())
const info = ref<ChannelDebtConfigInfo>({})

const handleBaseInfoOk = async () => {
  submit()
}

const submit = async () => {
    state.dialogBtnLoading = true
    try {
      let data:ChannelDebtAccountConfig = JSON.parse(JSON.stringify(formData.value));
      data.channelId = `${id}`;
      let res = await updateChannelDebtAccountConfig(data)
      message.success('操作成功')
      await getInfo(id as string)
      // initPayChannelConfig()
    } catch (error) {
      formData.value.isEnableRoyalty =  !formData.value.isEnableRoyalty
      console.log(error)
        // message.error(`${error}`)
    } finally {
      state.dialogBtnLoading = false
      state.showBaseInfoDialog = false
      state.showAccountRateDialog = false
    }
}

const handleShowAccountRateInfo = (item?: AccountInfoItem) => {
  state.showAccountRateDialog = true;
  nextTick(() => {
    reteFormRef.value.resetFields();
    if (item) {
      AccountRateForm.value = JSON.parse(JSON.stringify(item))
      AccountRateForm.value.accountId = item.accountInfo.id
      AccountRateForm.value.id = item.itemId
    } else {
      AccountRateForm.value = ininRateForm()
    }
    canAddRate.value = calcCanAddRate(item);
  })
}
const handleDel = (item?: AccountInfoItem) => {
  Modal.confirm({
    title: '温馨提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确认删除当前的分账账户？`,
    okText: '确认',
    centered: true,
    cancelText: '取消',
    async onOk() {
      try {
        let res = await delChannelDebtAccount({channelId: `${id}`, itemIds: item.itemId})
        message.success('操作成功')
        getInfo(id as string)
      } catch {
        
      }
    },
    onCancel() {},
  });
}

const handleAccountOk = () => {
  reteFormRef.value.validate().then(() => {
    
    submitAccount()
  }).catch(error  => {
      message.warning('请完善信息再提交')
  })
}

const validateRate =  async (_rule: Rule, value: string) => {
  if (Number(value) > canAddRate.value) {
    return Promise.reject(`可分配${canAddRate.value}%,当前已超过可分配比例，请调整后再编辑`);
  } else {
    return Promise.resolve();
  }
};

const canAddRate = ref(0)
const calcCanAddRate = (item?: AccountInfoItem) => {
  let rate = 100;
  if (info.value.royaltyMode == DebtModeEnum.FIXED_RATIO) {
    if (info.value.accounts.length > 0) {
      info.value.accounts.map(i=> {
        rate = calcFloat.sub(rate, i.rate)
      })
    }
  }
  if (item) {
    rate = calcFloat.add(rate, item.rate)
  }
  console.log('rate', rate)
  return rate
}

const reteFormTip = computed(() => {
  let text = ' 最多可分配分账比率为0';

  if (info.value.royaltyMode == DebtModeEnum.POLLING) {
    text = '';
  } else {
    text = canAddRate.value > 0 ? `最多可分配分账比率为${canAddRate.value}%`: text
  }
  return text
})

const submitAccount = async () => {
  state.dialogBtnLoading = true
    try {
      AccountRateForm.value.channelId = `${id}`;
      let res = await modifyChannelDebtAccount(AccountRateForm.value)
      message.success('操作成功')
      await getInfo(id as string)
    } catch (error) {
      console.log(error)
        // message.error(`${error}`)
    } finally {
      state.dialogBtnLoading = false
      state.showAccountRateDialog = false
    }
}

const getInfo = async (id:string)=>{
  state.isLoading=true
  const {data} =await getChannelDebtAccountConfig(id)
  info.value = data
  formData.value = JSON.parse(JSON.stringify(data))
  state.isLoading=false
}

const handleShowConfig = async () => {
 
  state.showBaseInfoDialog = true
  formData.value = JSON.parse(JSON.stringify(info.value))

}

const changeStatus = () => {
  submit()
}


onMounted(async ()=>{
  fetchAccountList()
  if(id){
    
    await getInfo(id as string)
  }
  
})

const accountOpts = ref<DebtAccountInfo[]>([])

const fetchAccountList = async () => {
  let res = await getAllDebtAccountList()
  accountOpts.value = res.data
}

const columns = [
  {
    title: '分账账号',
    dataIndex: 'accountId',
    width: '35%',
  },
  {
    title: '分账比率(%)',
    dataIndex: 'rate',
    width: '20%',
  },
  {
    title: '排序序号(降序)',
    dataIndex: 'orderNo',
    width: '20%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];


const setTableRateText = (text: string) => {
  return info.value.royaltyMode == DebtModeEnum.FIXED_RATIO ? `${text}%`: '--'
}

const filterOption = (input: string, option: any) => {
  return option.accountNo.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
</script>

<template>
  <div>

    <a-modal v-model:open="state.showBaseInfoDialog" title="设置分账配置">
      <template #footer>
        <a-button key="back" @click="state.showBaseInfoDialog = false">取 消</a-button>
        <a-button key="submit" type="primary" :loading="state.dialogBtnLoading" @click="handleBaseInfoOk">保 存</a-button>
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
          label="分账比率"
          name="royaltyRate"
          :rules="[{ required: false, message: '请输入分账比率!' }]"
        >
          <a-input v-model:value="formData.royaltyRate" style="width: 120px;"  />%
        </a-form-item>
        <a-form-item
          label="分账方式"
          name="royaltyMode"
          :rules="[{ required: false, message: '分账方式' }]"
        >
          <a-radio-group v-model:value="formData.royaltyMode">
            <a-radio :value="DebtModeEnum.FIXED_RATIO">
              <a-tooltip>
                <template #title>需手动配置分账账户的分账比率</template>
                {{ getDebtModeEnumText(DebtModeEnum.FIXED_RATIO) }}<QuestionCircleFilled style="margin-left: 2px;" />
              </a-tooltip>
              
             
            </a-radio>
            <a-radio :value="DebtModeEnum.POLLING">
              <a-tooltip>
                <template #title>无需配置分账账户的分账比率</template>
                 {{ getDebtModeEnumText(DebtModeEnum.POLLING) }}<QuestionCircleFilled style="margin-left: 2px;" />
              </a-tooltip>
             
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          label="分账策略"
          name="royaltyMode"
          :rules="[{ required: false, message: '分账策略!' }]"
        >
          <a-radio-group v-model:value="formData.royaltyStrategy">
            <a-radio :value="DebtStrategyEnum.API">{{ getDebtStrategyEnumText(DebtStrategyEnum.API) }}</a-radio>
            <a-radio :value="DebtStrategyEnum.TRANSFER">{{ getDebtStrategyEnumText(DebtStrategyEnum.TRANSFER) }}</a-radio>
            <a-radio :value="DebtStrategyEnum.API_OR_TRANSFER">{{ getDebtStrategyEnumText(DebtStrategyEnum.API_OR_TRANSFER) }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:open="state.showAccountRateDialog" title="设置分账账号">
      <template #footer>

        <a-button key="back" @click="state.showAccountRateDialog = false">取 消</a-button>
        <a-button key="submit" type="primary" :loading="state.dialogBtnLoading" @click="handleAccountOk">保 存</a-button>
      </template>
      <a-form
        ref="reteFormRef"
        style="padding: 30px 0;"
        :model="AccountRateForm"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item
          label="分账账号"
          name="accountId"
          :rules="[{ required: true, message: '请选择分账账号' }]"
        >
          <a-select
            v-model:value="AccountRateForm.accountId"
            show-search
            placeholder="请选择分账账号"
            :options="accountOpts"
            :fieldNames="{label: 'accountNo', value: 'id'}"
            :filter-option="filterOption"
            style="margin: -5px 0; width: 80%;"
          >
            <template #notFoundContent>
              <a-flex align="center" vertical justify="center">
                <a-empty :image="simpleImage"></a-empty>
                <a-button style="margin-top: -30px;" @click="router.push({path:'/debt/account-list'})" type="link">去添加分账账号</a-button>
              </a-flex>
            </template>
          </a-select>
        </a-form-item>

        <a-form-item
          v-if="info.royaltyMode == DebtModeEnum.FIXED_RATIO"
          label="分账比率"
          name="rate"
          :rules="[
            { required: true, message: '请输入分账比率!' }, 
            { required: true, validator: validateRate }
          ]"
        >
          <a-input-number
            v-model:value="AccountRateForm.rate"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
             style="width: 80%;"
          />
          <a-alert v-show="reteFormTip" :message="reteFormTip" type="info" show-icon style="width: 80%; margin-top: 3px" />
        </a-form-item>
       
        <a-form-item
          label="排序号(降序)"
          name="rate"
          :rules="[{ required: false, message: '请输入排序号!' }]"
        >
          <a-input v-model:value="AccountRateForm.orderNo" style="width:  80%;"  />
        </a-form-item>
      </a-form>
    
     
    </a-modal>

    <a-card :body-style="{padding: '15px',}">
      <a-descriptions layout="vertical" :column="4">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>是否开启分账</a-typography-text>
          </a-flex>
        </template>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="">
          <a-checkbox v-model:checked="formData.isEnableRoyalty" @change="changeStatus">启用分账</a-checkbox>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card v-show="info.isEnableRoyalty" :body-style="{padding: '15px'}">


      <a-descriptions :column="4" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>分账配置</a-typography-text>
            <a-button @click="handleShowConfig" type="link">编辑</a-button>
          </a-flex>

        </template>
        <a-descriptions-item style="padding-bottom: 4px;" :labelStyle="{'color':'#999'}" label="分账比率(单位百分比)">
          {{ info.royaltyRate }}%
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"label="分账方式(影响分账账户比率配置)">
          
          <a-tooltip>
            <template #title>{{
                info.royaltyMode == DebtModeEnum.FIXED_RATIO ? '需手动配置分账账户的分账比率' : '无需配置分账账户的分账比率'
              }}</template>
            {{ getDebtModeEnumText(info.royaltyMode) }}<QuestionCircleFilled />
          </a-tooltip>
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="分账策略">
          {{ getDebtStrategyEnumText(info.royaltyStrategy) }}
        </a-descriptions-item>

      </a-descriptions>
    </a-card>
    <a-card v-show="info.isEnableRoyalty" :body-style="{padding: '15px'}">


      <a-descriptions :column="4" >
        <template #title>
          <a-flex  align="center">
            <a-typography-text>分账账户配置</a-typography-text>
            <a-button @click="handleShowAccountRateInfo(null)" type="link">添加</a-button>
            
          </a-flex>

        </template>
       

      </a-descriptions>
      <a-table :columns="columns" :data-source="info.accounts" style="width: 1200px;" bordered :pagination="false">
        <template #emptyText>
          <a-empty></a-empty>
          <a-button @click="handleShowAccountRateInfo(null)" type="link">添加分账账户</a-button>
        </template>
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex == 'rate'">
            <div>
              <a-typography-text type="danger" strong>{{setTableRateText(text)}}</a-typography-text>
             
            </div>
            
          </template>

      
          <template v-if="column.dataIndex == 'accountId'">
            <a-flex vertical :gap="5" align="start">
              <a-typography-text >渠道类型: {{ getPayChannelTypeText((record.accountInfo as DebtAccountInfo).channelType) }}</a-typography-text>
              <a-typography-text > {{ (record.accountInfo as DebtAccountInfo).realName   }} / {{ (record.accountInfo as DebtAccountInfo).accountNo   }}</a-typography-text>
              
            </a-flex>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations">
              <a @click="handleShowAccountRateInfo(record)" type="link">编辑</a>
              <a-button danger style="padding-left: 10px" type="link" @click="handleDel(record)">删除</a-button>
            </div>
          </template>
        </template>
        </a-table>
    </a-card>
  </div>
</template>

<style scoped lang="less">

</style>