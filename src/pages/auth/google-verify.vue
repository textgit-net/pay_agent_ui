<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import { message } from "ant-design-vue";
import {getQueryParam} from "~/utils/tools.ts";
import { verifyGoogleCode } from '~/api/account/auth'
interface FormState {
    code: string;
}

const router=useRouter()
const route = useRoute()
const isLoading=ref(false)
const formRef=ref()
const saveLoading=ref(false)
const formData=reactive<FormState>({
    code: ''
})

const loginName = computed(() => {
    return route.query.loginName ?? '--'
})
const onSubmit =async ()=>{
  formRef.value.validate()
    .then(() => {
        saveLoading.value = true
        verifyGoogleCode(formData.code).then(res=>{
            message.success('验证成功')
            saveLoading.value=false
            router.push({
                path: getQueryParam('redirect', '/'),
                replace: true,
            }).then(() => {
                // multiTabStore.clear()
                // layoutMenuStore.clear()
            })
        }).catch(err=>{
            saveLoading.value=false
        })
    })
}


const isDisAbledBtn = computed(()=> {
  return !formData.code|| (formData.code.trim().length != 6);
})


const validateRateLen =  async (_rule: Rule, value: string) => {
  if (!value || value.trim().length != 6) {
    return Promise.reject(`请输入6位数的安全码`);
  } else {
    return Promise.resolve();
  }
};


onMounted(()=>{
 
})
</script>

<template>
<div class="page">
    <a-spin :spinning="isLoading">
        <a-flex justify="center">
            <a-form ref="formRef" layout="vertical" style="width: 550px" :model="formData">
                <a-flex vertical :gap="10">
                    <a-card >
                        <a-page-header
                            title="验证Google设备验证器"
                            class="site-page-header"
                            sub-title=""
                            style="padding: 0;"
                        >
                        </a-page-header>
                        <a-alert message="您的账号已开启Google验证，请输入您的Google验证器动态安全码。" type="info" show-icon />
                    </a-card>
                    <a-card >

                        <a-form-item
                            label="用户名"
                            name="username"
                        >
                            <a-typography-text>{{ loginName }}</a-typography-text>
                        </a-form-item>
                        <a-form-item
                            label="安全码"
                            name="code"
                            :rules="[
                                { required: true, validator: validateRateLen }
                            ]"
                        >
                            <a-input v-model:value="formData.code" allowClear :maxlength="6" placeholder="请输入6 位数字安全码"></a-input>
                        </a-form-item>
                    </a-card>
                    <a-card >
                        <a-flex justify="center">
                            <a-button @click="onSubmit" :disabled="isDisAbledBtn"  style="width:100%" :loading="saveLoading" type="primary">提交验证</a-button>
                        </a-flex>
                    </a-card>
                </a-flex>
            </a-form>
        </a-flex>
    </a-spin>
</div>
</template>


<style lang="less">
  .form_item_name {
    display: inline-block;
    width: 160px !important;
  }
</style>
<style scoped lang="less">
    .page {
        padding-top: 120px;
        display: flex;
        justify-content: center;
        min-height: 100vh;
        width: 100%;
        background-color: rgb(242, 245, 248);
    }
  .form_item_name {
    width: 160px;
  }
</style>