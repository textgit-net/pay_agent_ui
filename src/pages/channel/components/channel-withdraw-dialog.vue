<script setup lang="ts">
import { ref, computed, CSSProperties, watch, watchEffect } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useDraggable } from '@vueuse/core';
import { message } from 'ant-design-vue';
import {ChannelListResponse} from "~/api/channel/ChannelInterface.ts";
import {ChannelWithdrawRequest,postChannelWithdraw, AccountTypeEnum, getAccountTypeEnumText } from '@/api/channel/withdraw'
const userStore = useUserStore()

const initFormData = ():ChannelWithdrawRequest => {
  return {
    realName: '',
    accountNo: '',
    channelId: 0,
    securityCode: '',
    accountType: AccountTypeEnum.LOGIN_NAME
  }
}

const formData = reactive<ChannelWithdrawRequest>(initFormData());

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'onSuccess'): void;
}

const emit = defineEmits<Emits>();

export interface PropsType {
  visiable: boolean;
  chnnelInfo?:  any;
}


const props = withDefaults(defineProps<Partial<PropsType>>(), {
  visiable: false,
  chnnelInfo: {}
});



const handleOk = async () => {
  FormRef.value.validate().then(() => {
    submit()
    
  }).catch(error => {
    message.error(error['errorFields'][0]['errors'][0])
    console.log('error', error);
  })
 
};

const submit = async () => {
  state.dialogBtnLoading = true
  try {
    let res = await postChannelWithdraw(formData)
    emit('onSuccess');
    message.success('操作成功')
    modalVisible.value = false
  } catch (error) {
    
  } finally {
    state.dialogBtnLoading = false
  }
}

const disabled = computed(() => {
  if (formData.accountType == AccountTypeEnum.LOGIN_NAME) {
    return !(!!formData.realName && !!formData.accountNo) || (formData.securityCode.trim().length < 6 && userInfo.value.isEnableGoogleVerify) || chnelInfo.value.channelAmount == 0;
  } else if (formData.accountType == AccountTypeEnum.UID) {
    return !(!!formData.accountNo) || (formData.securityCode.trim().length < 6 && userInfo.value.isEnableGoogleVerify) || chnelInfo.value.channelAmount == 0;
  }
});

const modalTitleRef = ref<HTMLElement>(null);
const FormRef = ref()


const { x, y, isDragging } = useDraggable(modalTitleRef);
const startX = ref<number>(0);
const startY = ref<number>(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value;
    startY.value = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = modalTitleRef.value.getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag.value = true;
});

watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
      preTransformX.value +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      startX.value;
    transformY.value =
      preTransformY.value +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      startY.value;
  }
});

const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});


const state = reactive({
  dialogBtnLoading: false
})


const modalVisible = computed({
  get: () => props.visiable,
  set: (newVal) => {
    emit('update:visible', newVal);
  },
});

const userInfo = computed(()=>{
  return userStore.userInfo
}) 


const validateLen =  async (_rule: Rule, value: string) => {
  if (!value || value.trim().length != 6) {
    return Promise.reject(`请输入6位数google安全码`);
  } else {
    return Promise.resolve();
  }
};

function isNumber(n:any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const validateAmmount =  async (_rule: Rule, value: string) => {
  console.log('isNumber(value)', isNumber(value))
  if (!value || !isNumber(value) || parseFloat(value) == 0) {
    return Promise.reject(`请输入有效的金额`);
  } else if (parseFloat(value) > chnelInfo.value.channelAmount) {
    return Promise.reject(`输入的金额超出可提现金额`);
  } else {
    return Promise.resolve();
  }
};

const chnelInfo =ref<ChannelListResponse>({})
watch(() => props.chnnelInfo, (val) => {
  chnelInfo.value = val
  formData.channelId = chnelInfo.value.id
  nextTick().then(_=> {
    FormRef.value.resetFields();
  })
})

const handleWithdrawAll = () => {
  formData.amount = chnelInfo.value.channelAmount
  FormRef.value.validateFields(['amount']);
}

onMounted(() => {
 
})


</script>

<template>
    <a-modal ref="modalRef" v-model:visible="modalVisible"  :mask-closable="false" style="width: 480px;" :keyboard="false">
        <template #title>
            <div ref="modalTitleRef" style="width: 100%; cursor: move">渠道【{{chnelInfo.name}}】账户余额提现</div>
        </template>

        <template #footer>
          <a-flex align="center" style="padding-bottom: 20px;">
            <a-button key="submit" style="width: 100%;" :disabled="disabled" type="primary" :loading="state.dialogBtnLoading" @click="handleOk">发起提现</a-button>
          </a-flex>
        </template>
        <a-card :body-style="{padding: '15px'}">
          <a-descriptions :column="3" layout="vertical">
            <!-- <template #title>
              <a-flex  align="center">
                <a-typography-text>渠道账户信息</a-typography-text>
                
              </a-flex>

            </template> -->
          
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="可用金额">
              <a-space>
                <a-typography-text>￥{{ chnelInfo.channelAmount }}</a-typography-text>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="冻结金额">
              <a-space>
                <a-typography-text>￥{{ chnelInfo.channelFreezeAmount }}</a-typography-text>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="已提现金额">
              <a-space>
                <a-typography-text>￥{{ chnelInfo.totalWithdrawAmount }}</a-typography-text>
              </a-space>
            </a-descriptions-item>
            

          </a-descriptions>
        </a-card>

        <a-form
            ref="FormRef"
            :model="formData"
            name="basic"
            layout="vertical"
            autocomplete="off"
            style="padding-top:10px;"
        >
            <a-form-item
                label="提现账户类型"
                name="accountType"
                :rules="[
                    { required: true, message: '提现账户类型!' },
                ]"
            >
                <a-radio-group v-model:value="formData.accountType">
                  <a-radio :value="AccountTypeEnum.LOGIN_NAME">{{getAccountTypeEnumText(AccountTypeEnum.LOGIN_NAME)}}</a-radio>
                  <a-radio :value="AccountTypeEnum.UID">{{getAccountTypeEnumText(AccountTypeEnum.UID)}}</a-radio>
                </a-radio-group>
                
            </a-form-item>
            <a-form-item
                label="提现金额"
                name="amount"
                :rules="[
                    { required: true, validator: validateAmmount,trigger: 'change' },
                    
                ]"
            >
              <a-input v-model:value="formData.amount" placeholder="请输入" prefix="￥"></a-input>
              <a-flex justify="space-between">
                <a-typography-text type="secondary">请输入提现金额，最多可提￥{{ chnelInfo.channelAmount }}</a-typography-text>
                <a-typography-link @click="handleWithdrawAll" v-if="chnelInfo.channelAmount>0" style="margin-left: 10px">全部提现</a-typography-link>
              </a-flex>
            </a-form-item>

            <a-form-item
                v-if="AccountTypeEnum.LOGIN_NAME == formData.accountType"
                label="收款账号的真实姓名"
                name="realName"
                :rules="[
                    { required: true, message: '请输入收款账号的真实姓名!' },
                ]"
            >
                <a-input v-model:value="formData.realName" placeholder="请输入"></a-input>
                <a-typography-text type="secondary">收款账号绑定填写的真实姓名</a-typography-text>
            </a-form-item>
            <a-form-item
                v-if="AccountTypeEnum.LOGIN_NAME == formData.accountType"
                label="收款账号"
                name="accountNo"
                :rules="[
                    { required: true, message: '请输入收款账号!' },
                ]"
            >
                <a-input v-model:value="formData.accountNo"  placeholder="请输入"></a-input>
                <a-typography-text type="secondary">支付宝收款账号</a-typography-text>
            </a-form-item>
            <a-form-item
                v-if="AccountTypeEnum.UID == formData.accountType"
                label="UID"
                name="accountNo"
                :rules="[
                    { required: true, message: '请输入支付宝UID!' },
                ]"
            >
                <a-input v-model:value="formData.accountNo"  placeholder="请输入"></a-input>
                <a-typography-text type="secondary">支付宝UID</a-typography-text>
            </a-form-item>

            <a-form-item
                v-if="userInfo.isEnableGoogleVerify"
                label="安全码"
                name="securityCode"
                :rules="[
                    { required: true, validator: validateLen }
                ]"
            >
                <a-input v-model:value="formData.securityCode" :maxlength="6" placeholder="请输入6位数安全码"></a-input>
                <a-typography-text type="secondary">google动态安全码</a-typography-text>
            </a-form-item>

            <a-form-item
                label="提现备注"
                name="remark"
            >
                <a-input v-model:value="formData.remark"></a-input>
                <a-typography-text type="secondary">提现备注信息</a-typography-text>
            </a-form-item>
        </a-form>

     
    
        <template #modalRender="{ originVNode }">
          <div :style="transformStyle">
            <component :is="originVNode" />
          </div>
        </template>
    </a-modal>
</template>
