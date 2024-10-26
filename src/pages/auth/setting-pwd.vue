<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import { message } from "ant-design-vue";
import { resetPassword } from '@/api/account/AccountInterface'
import {getQueryParam} from "~/utils/tools.ts";
const userStore = useUserStore()
const token = useAuthorization()
interface FormState {
  comfirmPassword: string;
  password: string;
}

const router=useRouter()
const route = useRoute()
const isLoading=ref(false)
const formRef=ref()
const saveLoading=ref(false)
const formData=reactive<FormState>({
    comfirmPassword: '',
    password: ''
})

const loginName = computed(() => {
    return route.query.loginName ?? '--'
})
const onSubmit =async ()=>{
  formRef.value
    .validate()
    .then(() => {
        if (formData.password.trim() != formData.comfirmPassword.trim()) {
            return message.warning('俩次密码输入不一致，请确认后再提交')
        }
        saveLoading.value=true
        resetPassword(formData.password).then(res=>{
            message.success('操作成功')
            
            saveLoading.value=false
            token.value=res.data.accessToken
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
  return !(formData.password && formData.comfirmPassword) || (formData.password.trim().length < 6 || formData.comfirmPassword.trim().length < 6);
})


const validateRateLen =  async (_rule: Rule, value: string) => {
  if (!value || value.trim().length < 6) {
    return Promise.reject(`请输入至少6位数的密码`);
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
        <a-flex justify="center" align="center">
            <a-form ref="formRef" layout="vertical" style="width: 550px" :model="formData">
                <a-flex vertical :gap="10">
                    <a-card >
                        <a-page-header
                        title="重置代理商用户登录密码"
                        class="site-page-header"
                        sub-title=""
                        style="padding: 0;"
                        >
                    
                        </a-page-header>
                        <a-alert message="由于安全及管理需要，您必须重置您的登录密码之后，才可访问代理商后台。" type="warning" show-icon />
                    </a-card>
                    <a-card >

                        <a-form-item
                            label="用户名"
                            name="username"
                        >
                            <a-typography-text>{{ loginName }}</a-typography-text>
                        </a-form-item>
                        <a-form-item
                            label="新密码"
                            name="password"
                            :rules="[
                                { required: true, validator: validateRateLen }
                            ]"
                        >
                            <a-input-password v-model:value="formData.password" allowClear>
                                <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                                </template>
                            </a-input-password>


                            <a-typography-text  type="secondary">密码规则：</a-typography-text>
                            <a-typography-text  type="secondary">最少6个字符</a-typography-text>
                        
                        </a-form-item>


                        <a-form-item
                            label="确认密码"
                            name="password"
                            :rules="[
                                { required: true, validator: validateRateLen }
                            ]"
                        >
                            <a-input-password v-model:value="formData.comfirmPassword" allowClear>
                                <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                                </template>
                            </a-input-password>
                        
                        </a-form-item>
                    </a-card>
                    <a-card >
                        <a-flex justify="center">
                            <a-button @click="onSubmit" :disabled="isDisAbledBtn" style="width:100%" :loading="saveLoading" type="primary">确认重置</a-button>
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