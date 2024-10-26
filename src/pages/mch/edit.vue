<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import {MerchantInfo, getMerchantInfo, modifyMerchant} from "~/api/merchant/index.ts";
import { getAllAgentList, AgentOptItem} from "~/api/agent/index.ts";
import {ContactWay, ContactWaySelectOption} from "~/utils/constant.ts";

const router=useRouter()
const route = useRoute()
const { agentId,id } = route.query
const isLoading=ref(false)
const formRef=ref()
const saveLoading=ref(false)
const formData=reactive<MerchantInfo>({
  contactWay:ContactWay.Phone
})
if (agentId) {
  formData.agentId = Number(agentId)
}
const agentOpts = ref<AgentOptItem[]>([])



const onSubmit =async ()=>{
  formRef.value
      .validate()
      .then(() => {
           saveLoading.value=true
           modifyMerchant(formData).then(res=>{
             saveLoading.value=false
             router.back()
           }).catch(err=>{
             saveLoading.value=false
           })
      })
}
const getMchInfo=async (id:any)=>{
  
  isLoading.value=true
  const {data} =await getMerchantInfo(id)
  Object.assign(formData,data)
  isLoading.value=false
}

const fetchAgentList = async () => {
  let res = await getAllAgentList()
  agentOpts.value = res.data
}

const isDisAbledBtn = computed(()=> {
  return !formData.name || !formData.contactNumber || !formData.loginName
})


const filterOption = (input: string, option: any) => {
  return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const validatePwd =  async (_rule: Rule, value: string) => {
  if (!value || value.trim().length < 6) {
    return Promise.reject(`请输入至少6位数的密码`);
  } else {
    return Promise.resolve();
  }
};


onMounted(()=>{
  if(id){
    getMchInfo(id)
  }
  fetchAgentList()
})
</script>

<template>
  <a-spin :spinning="isLoading">
    <a-flex justify="center" align="center">
      <a-form ref="formRef" style="width: 800px" :model="formData" :labelCol="{style: 'width: 120px; display: inline-block;'}">
        <a-flex vertical :gap="10">
          <a-card >
            <a-page-header
              :title="id? '编辑商户': '添加商户'"
              class="site-page-header"
              sub-title="  "
              @back="() => router.go(-1)"
              style="padding: 0;"
            >
              <template #tags>
              </template>
            </a-page-header>
          </a-card>

          <!-- <a-card >
            <a-typography-text strong>1.绑定所属代理</a-typography-text>
            <a-form-item label="绑定代理"  name="agentId"  class="mt-5" :rules="[{required:true,message:'请输入登录账号'}]">
              <a-flex style="flex: 1" vertical>
                <a-select
                  v-model:value="formData.agentId"
                  show-search
                  placeholder="请选择代理"
                  style="width: 320px"
                  :options="agentOpts"
                  :fieldNames="{label: 'name', value: 'id'}"
                  :disabled="!!agentId"
                  :filter-option="filterOption"
                ></a-select>
                <a-typography-text type="secondary">绑定当前商户所属的代理</a-typography-text>
              </a-flex>
            </a-form-item>
          </a-card> -->


          <a-card >
            <a-typography-text strong>1.基础信息</a-typography-text>
            <a-form-item label="商户名称" name="name"  class="mt-5" :rules="[{required:true,message:'请输入商户名称'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.name" placeholder="请输入商户名称" allow-clear style="width: 320px"/>
                <a-typography-text type="secondary">为了更好的管理请规范输入</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="联系方式：" name="contactWay" class="mt-5" :rules="[{required:true,message:'请选择联系方式'}]">

              <a-radio-group v-model:value="formData.contactWay">
                <a-radio v-for="(item) in ContactWaySelectOption" :value="item.value">{{item.title}}</a-radio>

              </a-radio-group>
            </a-form-item>
            <a-form-item label="联系人" name="contactName" class="mt-5" :rules="[{required:true,message:'请输入联系人'}]">
              <a-input v-model:value="formData.contactName" placeholder="请输入联系人" allow-clear style="width: 320px"></a-input>
            </a-form-item>
            
            <a-form-item label="联系号码" name="contactNumber" class="mt-5" :rules="[{required:true,message:'请输入联系号码'}]">
              <a-input v-model:value="formData.contactNumber" placeholder="请输入联系号码" allow-clear style="width: 320px"></a-input>
            </a-form-item>

            <a-form-item label="备注：" name="remark" class="mt-5" :rules="[{required:false,message:'请输入备注信息'}]">
              <a-input v-model:value="formData.remark" placeholder="请输入备注信息" allow-clear style="width: 320px"></a-input>
            </a-form-item>
          </a-card>
          <a-card >
            <a-typography-text strong>2.账号信息</a-typography-text>
            <a-form-item label="登录账号"  name="loginName"  class="mt-5" :rules="[{required:true,message:'请输入登录账号'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.loginName" placeholder="请输入登录账号" :disabled="formData.id!=null" allow-clear style="width: 320px"/>
                <a-typography-text type="secondary">登录账号用于商户登录商户管理系统</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="是否重置密码" class="mt-5"  v-show="formData.id!=null">
              <a-checkbox v-model:checked="formData.isResetPassword" />
            </a-form-item>
            <a-form-item label="登录密码" name="password" v-show="(formData.id!=null && formData.isResetPassword) ||formData.id==null" class="mt-5" :rules="[{ required: true, validator: validatePwd }]">
              <a-flex align="right" :gap="10">
                <a-flex style="flex: 1" vertical>
                  <a-input-password v-model:value="formData.password" placeholder="请输入新密码"  style="width: 320px" allow-clear />
                  <a-typography-text type="secondary" v-show="formData.id==null">登录密码用于商户首次登录。</a-typography-text>
                  <a-flex>
                    <a-typography-text  type="secondary">密码规则：</a-typography-text>
                    <a-typography-text  type="secondary">最少6个字符</a-typography-text>
                  </a-flex>
                </a-flex>
              </a-flex>
            </a-form-item>
          </a-card>

         
          
          <a-card >
            <a-flex justify="flex-end">
              <a-space>
                <a-button @click="router.back()" style="width:100px">取消</a-button>
                <a-button @click="onSubmit" :disabled="isDisAbledBtn" style="width:100px" :loading="saveLoading" type="primary">保存</a-button>
              </a-space>
            </a-flex>
          </a-card>
        </a-flex>
      </a-form>
    </a-flex>
  </a-spin>
</template>


<style lang="less">
  .form_item_name {
    display: inline-block;
    width: 160px !important;
  }
</style>
<style scoped lang="less">
  .form_item_name {
    width: 160px;
  }
</style>