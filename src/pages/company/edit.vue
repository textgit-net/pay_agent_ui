<script setup lang="ts">
import {ArrowLeftOutlined, UploadOutlined} from "@ant-design/icons-vue";
import {CompanyAccount, CompanyFormInfo, getCompanyInfo, getCompanySelectOption, saveCompany} from "~/api/company.ts";
import {ColumnsType} from "ant-design-vue/es/table";
import {companyAccountSelectOption, CompanyAccountType, getCompanyAccountTypeText} from "~/utils/constant.ts";
const router=useRouter()
const fromData=reactive<CompanyFormInfo>(<CompanyFormInfo>{
  accounts:[]
})
const message=useMessage()
const accountColumns:ColumnsType =[
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '密码',
    dataIndex: 'password',
  },
  {
    title: '平台',
    dataIndex: 'type',
  },
  {
    title:'操作',
    width:"150px",
    dataIndex: 'action',
  },
]
const state=reactive<{
  showAccountModal:boolean
  isLoad:boolean
  isLoadError:boolean
  isLoadSuccess:boolean
  accountRowIndex:number
  accountFrom?:CompanyAccount
}>({
  showAccountModal:false,
  isLoad:false,
  isLoadError:false,
  isLoadSuccess:true,
  accountRowIndex:1,
  accountFrom: {
  }
})

const openAccountModal=(item?:CompanyAccount)=>{
    if(item==null){
      state.accountFrom={}
      state.accountRowIndex=-1
    }else{
      state.accountFrom=item
      state.accountRowIndex=fromData.accounts.findIndex(v=>v.userName==item.userName && v.type==item.type)
    }
    state.showAccountModal=true
}
const saveAccount=()=>{
  if(fromData.accounts.length==0){
    fromData.accounts.push(...[state.accountFrom])
  }else {
    if(state.accountRowIndex>0){
      Object.assign( fromData.accounts[state.accountRowIndex],state.accountFrom)
    }else {
      fromData.accounts.push(...[state.accountFrom])
    }
  }
  state.showAccountModal=false
}

const removeAccount=(account:CompanyAccount)=>{
  fromData.accounts=fromData.accounts.filter(v=>v.userName!=account.userName && v.type!=account.type)
}
const formRef=ref()
const messageKey="saveMessageKey"
const doSave=async ()=>{
   message.loading({content:"loading...",key:messageKey,duration:0})
   try {
     await saveCompany(unref(fromData))
     message.success({content:"保存成功",key:messageKey,duration:3})
     router.back()
   } catch (e){
     message.error({content:`${e}`,key:messageKey,duration:3})
   }
}
const onSubmit= ()=>{

  formRef.value
      .validate()
      .then(() => {
        doSave()
      })
      .catch((error: void) => {
        console.log('error', error);
      });
}

const openAccountLoginUrl=(account:CompanyAccount)=>{
   switch (account.type){
     case CompanyAccountType.ALI_YUN:
       window.open("https://account.aliyun.com/login/login.htm","_blank")
       break
     case CompanyAccountType.CSJ:
       window.open("https://www.csjplatform.com/","_blank")
       break
     case CompanyAccountType.LENOVO:
       window.open("https://open.lenovomm.com/developer/home","_blank")
       break
     case CompanyAccountType.SINA_CLOUD:
       window.open("http://cp.xinnet.com/login","_blank")
       break
   }
}
onMounted(()=>{
  const id = router.currentRoute.value.query["id"]?.toString() ?? "";
  if(id){
    state.isLoad=true
    getCompanyInfo(Number.parseInt(id)).then(res=>{
      state.isLoadError=false
      state.isLoad=false
      state.isLoadSuccess=true
      Object.assign(fromData,res.data??{})
    }).catch(e=>{
      state.isLoad=false
      state.isLoadError=true
      state.isLoadSuccess=false
    })
  }
})
</script>

<template>
<a-flex justify="center" align="center">
  <a-spin :spinning="state.isLoad">
    <a-form ref="formRef" style="width: 800px" :model="fromData" layout="vertical">

      <a-flex vertical :gap="10">
        <a-card >
          <a-flex>
            <a  @click="router.back()"   style="font-size: 16px;font-weight: 600;color: #333"><ArrowLeftOutlined class="mr-1"/> 返回</a>
          </a-flex>
        </a-card>
        <a-card >
          <a-typography-text strong>1.基础信息</a-typography-text>
          <a-form-item label="企业名称" name="name"  class="mt-5" :rules="[{required:true,message:'请输入企业名称名称'}]">
            <a-flex style="flex: 1" vertical>
              <a-input v-model:value="fromData.name" placeholder="请输入企业名称名称"/>
              <a-typography-text type="secondary">请输入与营业执照上一致的企业名称</a-typography-text>
            </a-flex>
          </a-form-item>
          <a-form-item label="手机号码" name="phone" class="mt-5" :rules="[{required:true,message:'请输入手机号码'}]">
            <a-flex align="right" :gap="10">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="fromData.phone" placeholder="请输入手机号码"></a-input>
                <a-typography-text type="secondary">手机号码用户企业用户登录后台</a-typography-text>
              </a-flex>
            </a-flex>
          </a-form-item>
        </a-card>
        <a-card >
          <a-typography-text strong>2.企业资质</a-typography-text>
          <a-form-item label="法人/经营者" name="legalPerson"  class="mt-5" :rules="[{required:true,message:'请输入法人名称'}]">
            <a-flex style="flex: 1" vertical>
              <a-input v-model:value="fromData.legalPerson" placeholder="请输入法人名称"/>
              <a-typography-text type="secondary">请输入与营业执照上一致的法人姓名</a-typography-text>
            </a-flex>
          </a-form-item>
          <a-form-item label="统一信息代码" name="qualificationSerial" class="mt-5" :rules="[{required:true,message:'请输入统一信息代码'}]">
            <a-flex align="right" :gap="10">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="fromData.qualificationSerial" placeholder="请输入统一信息代码"></a-input>
              </a-flex>
            </a-flex>
          </a-form-item>
          <a-form-item label="经营执照" name="qualificationCert" class="mt-5" :rules="[{required:true,message:'请上传经营执照'}]">
            <a-flex style="flex: 1" vertical>
              <SingFileUpload
                  v-model:value="fromData.qualificationCert"
                  :show-upload-list="true"
                  :max-count="1">
                <a-button>
                  <UploadOutlined/>
                  upload
                </a-button>
              </SingFileUpload>
            </a-flex>
          </a-form-item>
        </a-card>
        <a-card >
          <a-typography-text strong>3.域名信息</a-typography-text>
          <a-form-item label="域名" name="domain" class="mt-5" >
            <a-input v-model:value="fromData.domain" placeholder="请输入域名"></a-input>
          </a-form-item>
          <a-form-item label="备案号" name="domainSerial" class="mt-5" >
            <a-input v-model:value="fromData.domainSerial" placeholder="请输入域名备案号"></a-input>
          </a-form-item>
          <a-form-item label="备案平台" name="domainRegisterPlatform"  class="mt-5" >
            <a-select v-model:value="fromData.domainRegisterPlatform" placeholder="请选择域名备案平台">
              <a-select-option value="啊里云">啊里云</a-select-option>
              <a-select-option value="新浪">新浪</a-select-option>
            </a-select>
          </a-form-item>
        </a-card>
        <a-card >
          <a-flex justify="space-between" align="center">
            <a-typography-text strong>4.账号信息</a-typography-text>
            <a-button type="link" @click="openAccountModal(null)">添加账号</a-button>
          </a-flex>
          <a-table :columns="accountColumns" :data-source="fromData.accounts" class="mt-4" :pagination="null" size="small">
            <template #bodyCell="{ column , record}">
              <template v-if="column.dataIndex==='type'">
                <span>{{getCompanyAccountTypeText(record.type as CompanyAccountType)}}</span>
              </template>
              <template v-if="column.dataIndex==='action'">
                <a-flex :gap="10">
                  <a type="link"  @click="openAccountModal(record as CompanyAccount)">编辑</a>
                  <a type="link"  @click="openAccountLoginUrl(record as CompanyAccount)">去登录</a>
                  <a type="link" style="color: red" @click="removeAccount(record as CompanyAccount)">删除</a>
                </a-flex>
              </template>
            </template>
            <template #emptyText>
              <a-empty/>
              <a-button type="primary" @click="openAccountModal(null)">添加账号</a-button>
            </template>
          </a-table>
        </a-card>
        <a-card >
          <a-flex justify="flex-end">
            <a-space>
              <a-button @click="router.back()" style="width:100px">取消</a-button>
              <a-button @click="onSubmit" style="width:100px" type="primary">保存</a-button>
            </a-space>
          </a-flex>
        </a-card>
      </a-flex>
    </a-form>
  </a-spin>


  <a-modal centered title="编辑企业第三方账号" @ok="saveAccount"  v-model:open="state.showAccountModal" destroy-on-close>
    <a-form :model="state.accountFrom" layout="vertical">
      <a-form-item label="用户名/手机号" :rules="[{require:true,message:'请输入用户名/手机号'}]">
        <a-input v-model:value="state.accountFrom.userName" placeholder="请输入用户名/手机号"/>
      </a-form-item>
      <a-form-item label="密码" :rules="[{require:true,message:'请输入登录密码'}]">
        <a-input v-model:value="state.accountFrom.password" placeholder="请输入登录密码"/>
      </a-form-item>
      <a-form-item label="账号类型" :rules="[{require:true,message:'请选择账号类型'}]">
        <a-select v-model:value="state.accountFrom.type" placeholder="请账号类型">
          <a-select-option v-for="(item) in companyAccountSelectOption" :value="item.value">{{item.title}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</a-flex>


</template>

<style scoped lang="less">

</style>