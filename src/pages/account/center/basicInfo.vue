<script setup lang="ts">
import { reactive} from 'vue';

import QrcodeVue from 'qrcode.vue'
import type { Level, RenderAs, ImageSettings } from 'qrcode.vue'
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import {QuestionCircleFilled } from "@ant-design/icons-vue"
import { AgentInfo, modifyAgent,AgentResetPwdRequset } from '~/api/agent/index'
import { getGoogleSecretKey,bigdGoogleSecretCode,changeGoogleVerifyStatus,GoogleSecretKeyRespone,GoogleSecretCodeRequest,resetPassword } from '~/api/account/auth'
import  logoGoogleAuth from '~/assets/images/logo-google-auth.png'

const userStore = useUserStore()

const route = useRoute()
const state = reactive<{
  showBaseInfoDialog: boolean;
  showConcatDialog: boolean;
  dialogBtnLoading: boolean;
  ShowSettingPwdDialog: boolean;
  showGooglVerifyDialog: boolean;
  isLoading:boolean;
  isOnEditPay:boolean;
  isOnEditChildAgent: boolean;
  btnStatusLoading: boolean;
}>({
  showBaseInfoDialog: false,
  showConcatDialog: false,
  dialogBtnLoading: false,
  ShowSettingPwdDialog: false,
  isLoading: false,
  isOnEditPay: false,
  isOnEditChildAgent: false,
  showGooglVerifyDialog: false,
  btnStatusLoading: false

})
const formRef = ref();
const GoogleVerifyRef = ref();
const ResetPwdFormRef = ref();
const resetPwdForm = ref<AgentResetPwdRequset>({});

const googleVerifyInfo = ref<GoogleSecretKeyRespone>({
  qeCode: ''
})

const googleVerifyForm = ref<GoogleSecretCodeRequest>({
  googleSecurityKey: '',
  secretCode: ''
})

const isEnableGoogleVerify = ref(false)


const qrLevel = ref<Level>('H')
const renderAs = ref<RenderAs>('svg')
const imageSettings = ref<ImageSettings>({
  src: logoGoogleAuth,
  width: 40,
  height: 38,
  // x: 10,
  // y: 10,
  excavate: true,
})

const userInfo = computed(()=> {
  if (userStore.userInfo) {
    isEnableGoogleVerify.value = userStore.userInfo.isEnableGoogleVerify
  }
  return userStore.userInfo ?? {}
})

const ininForm = ():AgentInfo => {
    return{
      name: ''
    }
}
const formData=reactive<AgentInfo>(ininForm())
const copyFormData = ref<AgentInfo>(formData)

const handleShowBaseInfo = () => {
  copyFormData.value.name = userInfo.value.nickName
  setTimeout(() => {
    formRef.value.resetFields();
  })
  state.showBaseInfoDialog = true;
}

const handleShowSettingPwd = () => {
  state.ShowSettingPwdDialog = true;
  nextTick(() => {
    ResetPwdFormRef.value.resetFields()
  })
}
const handleShowGoogleVerify = () => {
  fetchGoogleSecretKey()
  state.showGooglVerifyDialog = true;
  nextTick(() => {
    GoogleVerifyRef.value.resetFields()
  })
  
}

const fetchGoogleSecretKey = async () => {
  let res = await getGoogleSecretKey()
  googleVerifyInfo.value = res.data
  googleVerifyForm.value.googleSecurityKey = googleVerifyInfo.value.secretKey
}

const handleGoogleVerifyOk = async () => {
  await GoogleVerifyRef.value.validate()

  state.dialogBtnLoading = true
  try {
    let res = await bigdGoogleSecretCode(googleVerifyForm.value)
    message.success('操作成功')
    state.showGooglVerifyDialog = false;

    userInfo.value.isBindGoogleSecretKey = true;
    userStore.setUserInfo(userInfo.value)
    
    
  } catch (error) {
      // message.error(`${error}`)
  } finally {
    state.dialogBtnLoading = false
  }
}

const changeGoogleVerify = async () => {
  state.btnStatusLoading = true
  try {
    let res = await changeGoogleVerifyStatus()
    message.success('操作成功')

    userInfo.value.isEnableGoogleVerify = !userInfo.value.isEnableGoogleVerify;
    userStore.setUserInfo(userInfo.value)
  } catch (error) {
      message.error(`${error}`)
  } finally {
    state.btnStatusLoading = false
  }
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
const validateGoogleCode = async (_rule: Rule, value: string) => {
  if (!value || value.trim().length != 6) {
    return Promise.reject(`请输入6位数的安全码`);
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
      let res = await resetPassword(resetPwdForm.value.password)
      message.success('操作成功')
      state.ShowSettingPwdDialog = false
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
      let res = await modifyAgent(data)
      message.success('操作成功')
      // initPayChannelConfig()
    } catch (error) {
        // message.error(`${error}`)
    } finally {
      state.dialogBtnLoading = false
      state.showBaseInfoDialog = false
      state.showConcatDialog = false
    }
}

onMounted(async ()=>{

  
})
</script>

<template>
  <div>

    <a-modal v-model:open="state.showBaseInfoDialog"  title="更改信息" :mask-closable="false" style="width: 480px;">
      <template #footer>
        <a-button key="submit" type="primary" :disabled="!copyFormData.name" :loading="state.dialogBtnLoading" @click="handleBaseInfoOk" style="width: 100%;">保 存</a-button>
      </template>
      <a-form
        ref="formRef"
        style="padding: 30px 0;"
        :model="copyFormData"
        name="basic"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item
          label="用户名称"
          name="name"
          :rules="[{ required: false, message: '请输入用户名称!',  trigger: 'change' }]"
        >
          <a-input v-model:value="copyFormData.name" placeholder="请输入" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model:open="state.ShowSettingPwdDialog" :mask-closable="false" style="width: 480px;" title="重置密码">
      <template #footer>
        <a-flex align="center">
          <a-button key="submit" style="width: 100%;" :disabled="isDisAbledPwdBtn" type="primary" :loading="state.dialogBtnLoading" @click="handleResetPwdOk">保 存</a-button>
        </a-flex>
       
      </template>
      
      <a-form
        style="padding: 30px 0;"
        :model="resetPwdForm"
        name="basic"
        ref="ResetPwdFormRef"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item
          label="用户账号"
        >
          <a-flex> <a-typography-text>{{ userInfo.loginName }}</a-typography-text></a-flex>
        </a-form-item>
        <a-form-item
          label="新密码"
          name="password"
          :rules="[
            { required: true, validator: validatePwd }
          ]"
        >
          <a-input-password v-model:value="resetPwdForm.password" placeholder="请输入新密码" allow-clear />
          <a-typography-text  type="secondary">密码规则：</a-typography-text>
          <a-typography-text  type="secondary">最少6个字符</a-typography-text>
        </a-form-item>
        <a-form-item
          label="确认新密码"
          name="confirmPassword"
          :rules="[
            { required: true, validator: validatePwd }
          ]"
        >
          <a-input-password v-model:value="resetPwdForm.confirmPassword" placeholder="请输入确认新密码" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:open="state.showGooglVerifyDialog" :footer="null" :mask-closable="false" style="width: 680px;" title="绑定Google安全验证器">
      <a-flex align="center" justify="center">

        <a-flex align="center" justify="center" vertical  style="padding: 20px 0;">
          <qrcode-vue
            :value="googleVerifyInfo.qeCode"
            :level="qrLevel"
            :size="200"
            :render-as="renderAs"
            background="#000000"
            foreground='#fff'
            :image-settings='imageSettings'
          />
          <a-typography-text style="margin-top: 10px;" type="secondary">请用Google验证器扫一扫进行绑定</a-typography-text>
        </a-flex>

        <a-form
          style="padding: 30px;width: 360px; padding-right: 0px;"
          :model="googleVerifyForm"
          name="basic"
          ref="GoogleVerifyRef"
          layout="vertical"
          autocomplete="off"
        >
          <a-form-item>
            <a-alert message="扫码绑定后，请输入您的Google验证器动态安全码。" type="info" show-icon />
          </a-form-item>
          
          <!-- <a-form-item
            label="Gooogle安全Key"
            name="password"
            :rules="[
              { required: true, validator: validatePwd }
            ]"
          >
            <a-input-password v-model:value="googleVerifyForm.googleSecurityKey" disabled />
            
          </a-form-item> -->
          <a-form-item
            label="安全码"
            name="secretCode"
            :rules="[
              { required: true, validator: validateGoogleCode }
            ]"
          >
            <a-input v-model:value="googleVerifyForm.secretCode" placeholder="请输入6位数Google安全码" :maxlength="6" allow-clear />
           
          </a-form-item>
          <a-button key="submit" type="primary" :disabled="!googleVerifyForm.secretCode" :loading="state.dialogBtnLoading" @click="handleGoogleVerifyOk" style="width: 100%;">提交验证</a-button>
        </a-form>
        
      </a-flex>    
    
    </a-modal>


    

    <a-card :body-style="{padding: '15px'}">
      <a-descriptions :column="1">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>基础信息</a-typography-text>
            <!-- <a-button @click="handleShowBaseInfo" type="link">编辑</a-button> -->
          </a-flex>

        </template>
        <a-descriptions-item style="padding-bottom: 10px" :labelStyle="{'color':'#999'}"  label="账号ID:">{{ userInfo.id }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 10px" :labelStyle="{'color':'#999'}" label="用户账号:">{{ userInfo.loginName }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 10px" :labelStyle="{'color':'#999'}"  label="用户名称:">{{ userInfo.nickName }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 10px" :labelStyle="{'color':'#999'}"  label="是否允许发展代理:">{{ userInfo.isAllowInviteUser? '是': '否' }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card :body-style="{padding: '15px',}">
      
      
      <a-descriptions :column="4" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>账号安全</a-typography-text>
          </a-flex>
        </template>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="重置密码">
          <a-flex  align="start">
            <a-button @click="handleShowSettingPwd" type="link" style="padding-left: 0">重置密码</a-button>
          </a-flex>
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="Google安全验证器">
          <a-flex  align="start">
            <a-button @click="handleShowGoogleVerify" type="link" style="padding-left: 0">
              {{ userInfo.isBindGoogleSecretKey? '更改Google安全验证': '绑定Google安全验证' }} 
            </a-button>
          </a-flex>
        </a-descriptions-item>
        <a-descriptions-item v-if="userInfo.isBindGoogleSecretKey" style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="登录时是否开启Google安全验证器">
          <a-flex align="center" justify="center">
              <a-tooltip>
                <template #title>请确认绑定google验证码后再开启，否则登录受限</template>
                <a-switch v-model:checked="isEnableGoogleVerify"  @change="changeGoogleVerify" :loading="state.btnStatusLoading" checked-children="已开启" un-checked-children="已关闭" /><QuestionCircleFilled style="margin-left: 2px;" />
                
              </a-tooltip>
              <!-- <a-button @click="handleShowGoogleVerify" type="link" style="padding-left: 20px">
                 测试Google验证器绑定情况
                </a-button> -->
          </a-flex>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    
  </div>
</template>

<style scoped lang="less">

</style>