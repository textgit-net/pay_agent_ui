<script setup lang="ts">
import { ref, computed, CSSProperties, watch, watchEffect } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
const userStore = useUserStore()
const multiTabStore = useMultiTab()
const layoutMenuStore = useLayoutMenu()
import { useDraggable } from '@vueuse/core';
import { resetPassword } from '@/api/account/AccountInterface'
import { message } from 'ant-design-vue';
import router from '~@/router';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12, },
};

interface FormState {
  comfirmPassword: string;
  password: string;
}
const formState = reactive<FormState>({
  comfirmPassword: '',
  password: '',
});

const onFinish = async (values: FormState) => {
  let res = await resetPassword(values.password)
  message.success('操作成功')
  setTimeout(async () => {
    try {
        await userStore.logout()
    } catch (error) {
        
    } finally {
        router.push({
            path: '/login',
        }).then(() => {
            multiTabStore.clear()
            layoutMenuStore.clear()
        })
    }
  }, 700)
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(formState.comfirmPassword && formState.password) || (formState.password.trim().length < 6 || formState.comfirmPassword.trim().length < 6);
});

const modalTitleRef = ref<HTMLElement>(null);


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


const isNeedSettingPwd = computed(()=> {
    console.log('userStore.userInfo', userStore.userInfo)
  return false
})

const validateRateLen =  async (_rule: Rule, value: string) => {
  if (!value || value.trim().length < 6) {
    return Promise.reject(`请输入至少6位数的密码`);
  } else {
    return Promise.resolve();
  }
};

</script>

<template>
    <a-modal ref="modalRef" v-model:open="isNeedSettingPwd" width="500px" :keyboard="false" :closable="false" :footer="null" :maskClosable="false" :wrap-style="{ overflow: 'hidden' }">
        <a-form
            :model="formState"
            name="horizontal_login"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
            v-bind="formTailLayout"
            style="padding-top: 20px;"
        >
            <a-form-item
                label="新密码"
                name="password"
                :rules="[
                    { required: true, message: '请输入密码!' },
                    { required: true, validator: validateRateLen }
                ]"
            >
                <a-input-password v-model:value="formState.password">
                    <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                    </template>
                </a-input-password>
                <a-typography-text type="secondary">请设置大于6位数密码</a-typography-text>
            </a-form-item>

            <a-form-item
                label="确认密码"
                name="comfirmPassword"
                :rules="[
                    { required: true, message: '请输入确认密码!' },
                    { required: true, validator: validateRateLen }
                ]"
            >
                <a-input-password v-model:value="formState.comfirmPassword">
                    <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                    </template>
                </a-input-password>
                <a-typography-text type="secondary">请设置大于6位数密码</a-typography-text>
            </a-form-item>

           

            <a-form-item label=" " v-bind="formItemLayout">
                <a-button :disabled="disabled" type="primary" html-type="submit">确认</a-button>
            </a-form-item>
        </a-form>
      <template #title>
        <div ref="modalTitleRef" style="width: 100%; cursor: move">首次登录 请先重置密码后再进入</div>
      </template>
      <template #modalRender="{ originVNode }">
        <div :style="transformStyle">
          <component :is="originVNode" />
        </div>
      </template>
    </a-modal>
</template>
