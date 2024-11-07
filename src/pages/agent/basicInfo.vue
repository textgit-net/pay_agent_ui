<script setup lang="ts">
import { reactive} from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import {ContactWay, ContactWaySelectOption,getContactWayText} from "~/utils/constant.ts";
import {PayChannelInfo, AgentInfo, modifyAgent, getAgentInfo, AllowInviteUserEnum, resetAgentPwd,AgentResetPwdRequset } from '~/api/agent/index'
const route = useRoute()
const state = reactive<{
  showBaseInfoDialog: boolean;
  showConcatDialog: boolean;
  dialogBtnLoading: boolean;
  ShowSettingPwdDialog: boolean;
  isLoading:boolean;
  isOnEditPay:boolean;
  isOnEditChildAgent: boolean;
}>({
  showBaseInfoDialog: false,
  showConcatDialog: false,
  dialogBtnLoading: false,
  ShowSettingPwdDialog: false,
  isLoading: false,
  isOnEditPay: false,
  isOnEditChildAgent: false

})
const formRef = ref();
const resetPwdForm = ref<AgentResetPwdRequset>({});

const payChannelConfigList = ref<PayChannelInfo[]>([])

interface FormState {
  username: string;
  password: string;
  remember: boolean;
  contactWay: ContactWay;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
  contactWay: ContactWay.Phone
});


const ininForm = ():AgentInfo => {
    return{
        contactWay:ContactWay.Phone,
        isAllowInviteUser: AllowInviteUserEnum.notAllow,
        isEnable: false,
        payChannelConfig: []
    }
}
const formData=reactive<AgentInfo>(ininForm())
const copyFormData = ref<AgentInfo>(formData)



const initPayChannelInfo = ():PayChannelInfo => {
    let payChannelInfo:PayChannelInfo = {};
    payChannelInfo.payModes = []
    // payChannelInfo.ratesConfig = {}
    // payChannelInfo.ratesConfig.ratesMode = PayRatesModeEnum.singleRate
    // payChannelInfo.ratesConfig.singleRates = null
    // payChannelInfo.ratesConfig.ladderRatesConfigJson = ''
    return payChannelInfo;
}

// 获取支付渠道默认值
const getPayModeByChannelType = (channelType: string):string[] => {
    let payModes:string[] = [];
    formData.payChannelConfig.map((item:PayChannelInfo)=> {
        if (item.channelType== channelType) {
            payModes = item.payModes
        }
    })
    return payModes
}



const handleShowBaseInfo = () => {
  copyFormData.value = JSON.parse(JSON.stringify(formData))
  setTimeout(() => {
    formRef.value.resetFields();
  })
  state.showBaseInfoDialog = true;
}

const handleShowConcatInfo = () => {
  copyFormData.value = JSON.parse(JSON.stringify(formData))
  setTimeout(() => {
    formRef.value.resetFields();
  })
  state.showConcatDialog = true;
}
const handleShowSettingPwd = () => {
  state.ShowSettingPwdDialog = true;
}

const isDisAbledPwdBtn = computed(()=> {
  return !(resetPwdForm.value.password && resetPwdForm.value.confirmPassword) || (resetPwdForm.value.password.trim().length < 6 ||  resetPwdForm.value.confirmPassword.trim().length < 6);
})

const validatePwd =  async (_rule: Rule, value: string) => {
  if (!value || value.trim().length < 6) {
    return Promise.reject(`请输入至少6位数的密码`);
  } else {
    return Promise.resolve();
  }
};

const handleBaseInfoOk = async () => {


  submit()
  
}

const handleResetPwdOk = async () => {
  if (resetPwdForm.value.password != resetPwdForm.value.confirmPassword) {
    return message.warning(`俩次密码输入不一致`)
  }
  state.dialogBtnLoading = true
    try {
      resetPwdForm.value.targetId = formData.id
      let res = await resetAgentPwd(resetPwdForm.value)
      message.success('操作成功')
      state.ShowSettingPwdDialog = false
      await getInfo(id as string)
      // initPayChannelConfig()
    } catch (error) {
        // message.error(`${error}`)
    } finally {
      state.dialogBtnLoading = false
    }
}

const submit = async () => {
    state.dialogBtnLoading = true
    try {
      let data:AgentInfo= JSON.parse(JSON.stringify(copyFormData.value));
      data.payChannelConfig = payChannelConfigList.value;
      let res = await modifyAgent(data)
      message.success('操作成功')
      await getInfo(id as string)
      // initPayChannelConfig()
    } catch (error) {
        // message.error(`${error}`)
    } finally {
      state.dialogBtnLoading = false
      state.showBaseInfoDialog = false
      state.showConcatDialog = false
    }
}

const getInfo=async (id:string)=>{
  state.isLoading=true
  const {data} =await getAgentInfo(id)
  Object.assign(formData, data)
  
  state.isLoading=false
}

const handleEditPay = async () => {
 
  if (!state.isOnEditPay) {
    state.isOnEditPay = !state.isOnEditPay
  } else {
    // 保存
    try {
      await submit()
      state.isOnEditPay = !state.isOnEditPay
    } catch (error) {
      
    } finally {

    }
  }
}

const handleEditChildAgent = async () => {
 
 if (!state.isOnEditChildAgent) {
   state.isOnEditChildAgent = !state.isOnEditChildAgent
 } else {
   // 保存
   try {
      await submit()
     state.isOnEditChildAgent = !state.isOnEditChildAgent
   } catch (error) {
     
   } finally {

   }
 }
}

const {id}= route.query
onMounted(async ()=>{
  if(id){
    
    await getInfo(id as string)
    
  }
  
})
</script>

<template>
  <div>

    <a-modal v-model:open="state.showBaseInfoDialog" title="设置基础信息" style="width: 480px;">
      <template #footer>
        <a-button key="submit" type="primary" :loading="state.dialogBtnLoading" @click="handleBaseInfoOk" style="width: 100%;">保 存</a-button>
      </template>
      <a-form
        ref="formRef"
        style="padding: 20px 0;"
        :model="copyFormData"
        name="basic"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item
          label="代理名称"
          name="username"
          :rules="[{ required: false, message: '商户名称!' }]"
        >
          <a-input v-model:value="copyFormData.name" disabled  />
        </a-form-item>
        <a-form-item
          label="代理简称"
          name="username"
          :rules="[{ required: false, message: '商户简称!',  trigger: 'change' }]"
        >
          <a-input v-model:value="copyFormData.shortName" placeholder="请输入" allow-clear />
        </a-form-item>
        <a-form-item
          label="备注"
          name="username"
          :rules="[{ required: false, message: '备注!',  trigger: 'change' }]"
        >
          <a-input v-model:value="copyFormData.remark" placeholder="请输入" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:open="state.showConcatDialog" title="设置联系人信息" style="width: 480px;">
      <template #footer>
        <a-button key="submit" type="primary" :disabled="!copyFormData.contactName || !copyFormData.contactNumber" :loading="state.dialogBtnLoading" @click="handleBaseInfoOk"  style="width: 100%;">保 存</a-button>
      </template>
      <a-form
         ref="formRef"
        style="padding: 20px 0;"
        :model="copyFormData"
        name="basic"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item
          label="代理联系人名称"
          name="contactName"
          :rules="[{ required: true, message: '请输入联系人名称!', trigger: 'change' }]"
        >
          <a-input v-model:value="copyFormData.contactName" placeholder="请输入联系人名称"   />
        </a-form-item>
        <a-form-item
          label="代理联系人方式"
          name="contactWay"
          :rules="[{ required: true, message: '请输入联系人方式!', trigger: 'change' }]"
        >
          <a-radio-group v-model:value="copyFormData.contactWay">
            <a-radio v-for="(item) in ContactWaySelectOption" :value="item.value">{{item.title}}</a-radio>
            
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="代理联系号码"
          name="contactNumber"
          :rules="[{ required: true, message: '请输入联系号码!', trigger: 'change'}]"
        >
          <a-input v-model:value="copyFormData.contactNumber"  placeholder="请输入联系人联系号码" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:open="state.ShowSettingPwdDialog" :mask-closable="false" title="重置密码" style="width: 480px;">
      <template #footer>
      
        <a-button key="submit" :disabled="isDisAbledPwdBtn" type="primary" :loading="state.dialogBtnLoading" @click="handleResetPwdOk" style="width: 100%;">保 存</a-button>
      </template>
      <a-form
        style="padding: 20px 0;"
        :model="resetPwdForm"
        name="basic"
        layout="vertical"
        autocomplete="off"
      >

        <a-form-item
          label="用户名"
          name="username"
        >
          <a-typography-text>{{ formData.loginName }}</a-typography-text>
        </a-form-item>
        <a-form-item
          label="新密码"
          name="password"
          :rules="[{ required: true, validator: validatePwd }]"
        >
          <a-input-password v-model:value="resetPwdForm.password" placeholder="请输入新密码" allow-clear />
          <a-typography-text  type="secondary">密码规则：</a-typography-text>
          <a-typography-text  type="secondary">最少6个字符</a-typography-text>
        </a-form-item>
        <a-form-item
          label="确认新密码"
          name="confirmPassword"
          :rules="[{ required: true, validator: validatePwd }]"
        >
          <a-input-password v-model:value="resetPwdForm.confirmPassword" placeholder="请输入确认新密码" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-card :body-style="{padding: '15px'}" :loading="state.isLoading">
      <a-descriptions :column="3" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>基础信息</a-typography-text>
            <a-button @click="handleShowBaseInfo" type="link">编辑</a-button>
          </a-flex>

        </template>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="代理名称">{{ formData.name }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="代理简称">{{ formData.shortName }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="备注">{{ formData.remark }}</a-descriptions-item>
      </a-descriptions>

      <a-descriptions :column="3" layout="vertical" class="mt-4">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>联系人信息</a-typography-text>
            <a-button @click="handleShowConcatInfo" type="link">编辑</a-button>
          </a-flex>
        </template>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="联系方式">{{ getContactWayText(formData.contactWay) }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="联系人">{{ formData.contactName }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="联系号码">{{ formData.contactNumber }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card :body-style="{padding: '15px',}" :loading="state.isLoading">
      <a-descriptions :column="3" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>账号信息</a-typography-text>
          
          </a-flex>

        </template>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="登录账号">{{ formData.loginName }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="重置密码">
          <!-- <a-checkbox v-model:checked="checked">重置密码</a-checkbox> -->
          <a-flex  align="start">
            <a-button @click="handleShowSettingPwd" type="link" style="padding-left: 0">重置密码</a-button>
          </a-flex>
          <!-- <a-input-password v-model:value="formState.password" placeholder="新密码" /> -->
          <!-- <a-input-password v-model:value="formState.password" placeholder="新密码" /> -->
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    
  </div>
</template>

<style scoped lang="less">

</style>