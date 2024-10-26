<script setup lang="ts">
import { message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import {ContactWay, ContactWaySelectOption} from "~/utils/constant.ts";
import {PayChannelInfo, AgentInfo, modifyAgent, getAgentInfo, AllowInviteUserEnum } from '~/api/agent/index'
const router=useRouter()
const route=useRoute()
const formRef=ref(null)

const state = reactive<{isLoading: boolean; saveLoading: boolean}>({
    isLoading: false,
    saveLoading: false
})

const ininForm = ():AgentInfo => {
    return{
        contactWay:ContactWay.Phone,
        isAllowInviteUser: AllowInviteUserEnum.notAllow,
        isEnable: false,
        payChannelConfig: []
    }
}

const formData=reactive<AgentInfo>(ininForm())
const payChannelConfigList = ref<PayChannelInfo[]>([])
const {id}= route.query

const onSubmit = async ()=>{
  formRef.value.validate().then(() => {
        
        submit()
    }).catch(error  => {
        message.warning('请完善信息再提交')
    })
}

const submit = async () => {
    try {
        state.saveLoading=true
        let copyFormData:AgentInfo= JSON.parse(JSON.stringify(formData));
        copyFormData.payChannelConfig = payChannelConfigList.value;
        let res = await modifyAgent(copyFormData)
        message.success('操作成功')
        let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            router.back()
        }, 1500)
       
    } catch (error) {
        // message.error(`${error}`)
    } finally {
        state.saveLoading=false
    }
}
const getInfo=async (id:string)=>{
  state.isLoading=true
  const {data} =await getAgentInfo(id)
  Object.assign(formData, data)
  state.isLoading=false
}



const initPayChannelInfo = ():PayChannelInfo => {
    let payChannelInfo:PayChannelInfo = {};
    payChannelInfo.payModes = []
    // payChannelInfo.ratesConfig = {}
    // payChannelInfo.ratesConfig.ratesMode = PayRatesModeEnum.singleRate
    // payChannelInfo.ratesConfig.singleRates = null
    // payChannelInfo.ratesConfig.ladderRatesConfigJson = ''
    return payChannelInfo;
}

const validatePwd =  async (_rule: Rule, value: string) => {
  if (!value || value.trim().length < 6) {
    return Promise.reject(`请输入至少6位数的密码`);
  } else {
    return Promise.resolve();
  }
};

onMounted(async ()=>{
  if(id){
    
    await getInfo(id as string)
  }
})
</script>

<template>
  <a-spin :spinning="state.isLoading">
    <a-flex justify="center">
      <a-form ref="formRef" style="width: 800px" :model="formData"  :labelCol="{style: 'width: 140px; display: inline-block;'}">
        <a-flex vertical :gap="10">
          <a-card >

            <a-page-header
              :title="id? '编辑代理': '添加代理'"
              class="site-page-header"
              sub-title="  "
              @back="() => router.go(-1)"
              style="padding: 0;"
            >
              <template #tags>
              </template>
            </a-page-header>
            <!-- <a-flex>
              <a  @click="router.back()"  style="font-size: 16px;font-weight: 600;color: #333"><ArrowLeftOutlined class="mr-1"/> 返回</a>
            </a-flex> -->
          </a-card>
          <a-card >
            <a-typography-text strong>1.基础信息</a-typography-text>
            <a-form-item label="代理名称：" name="name"  class="mt-5" :rules="[{required:true,message:'请输入代理名称'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.name" placeholder="请输入代理名称" allow-clear style="width: 320px"/>
                <a-typography-text type="secondary">为了更好的管理请规范输入</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="代理简称：" name="shortName"  class="mt-5" :rules="[{required:false,message:'请输入代理简称'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.shortName" placeholder="请输入代理简称" allow-clear style="width: 320px"/>
                <a-typography-text type="secondary">为了更好的管理请规范输入</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="联系方式：" name="contactWay" class="mt-5" :rules="[{required:true,message:'请选择联系方式'}]">

              <a-radio-group v-model:value="formData.contactWay">
                <a-radio v-for="(item) in ContactWaySelectOption" :value="item.value">{{item.title}}</a-radio>
              
              </a-radio-group>
            </a-form-item>
            <a-form-item label="联系人：" name="contactName" class="mt-5" :rules="[{required:true,message:'请输入联系人'}]">
              <a-input v-model:value="formData.contactName" placeholder="请输入联系人" allow-clear style="width: 320px"></a-input>
            </a-form-item>
           
            <a-form-item label="联系账号：" name="contactNumber" class="mt-5" :rules="[{required:true,message:'请输入联系账号'}]">
              <a-input v-model:value="formData.contactNumber" placeholder="请输入联系账号" allow-clear style="width: 320px"></a-input>
            </a-form-item>
            <a-form-item label="备注：" name="remark" class="mt-5" :rules="[{required:false,message:'请输入备注信息'}]">
              <a-input v-model:value="formData.remark" placeholder="请输入备注信息" allow-clear style="width: 320px"></a-input>
            </a-form-item>
          </a-card>
          <a-card >
            <a-typography-text strong>2.账号信息</a-typography-text>
            <a-form-item label="登录账号："  name="loginName"  class="mt-5" :rules="[{required:formData.id==null,message:'请输入登录账号'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.loginName" placeholder="请输入登录账号" :disabled="formData.id!=null" allow-clear style="width: 320px"/>
                <a-typography-text type="secondary">登录账号用于子代理登录代理管理系统</a-typography-text>
              </a-flex>
            </a-form-item>
         
            <a-form-item label="登录密码：" name="password" v-show="formData.id==null" class="mt-5" :rules="[{ required: true, validator: validatePwd }]">
              <a-flex :gap="10">
                <a-flex style="flex: 1" vertical>
                  <a-input-password v-model:value="formData.password" placeholder="请输入新密码"  style="width: 320px" allow-clear />
                  <a-typography-text type="secondary" v-show="formData.id==null">登录密码用于子代理首次登录。</a-typography-text>
                  <a-flex>
                    <a-typography-text  type="secondary">密码规则：</a-typography-text>
                    <a-typography-text  type="secondary">最少6个字符</a-typography-text>
                  </a-flex>
                </a-flex>
              </a-flex>
            </a-form-item>
          </a-card>
          <a-card >
            <a-typography-text strong>3.其他信息</a-typography-text>
            <a-form-item label="是否提交表单时候启用：" name="isEnable"  class="mt-5" :rules="[{required:true,message:''}]">
              <a-flex style="flex: 1" vertical>
                <a-radio-group v-model:value="formData.isEnable">
                    <a-switch v-model:checked="formData.isEnable" checked-children="是" un-checked-children="否" />
                </a-radio-group>
              </a-flex>
            </a-form-item>

          </a-card>
          <a-card >
            <a-flex justify="flex-end">
              <a-space>
                <a-button @click="router.back()" style="width:100px">取消</a-button>
                <a-button @click="onSubmit" style="width:100px" :loading="state.saveLoading" type="primary">保存</a-button>
              </a-space>
            </a-flex>
          </a-card>
        </a-flex>
      </a-form>
    </a-flex>
  </a-spin>
</template>

<style scoped lang="less">

</style>