<script setup lang="ts">
import {ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined, UploadOutlined} from "@ant-design/icons-vue";
import {
  ChannelFormData,
  ChannelSimpleResponse,
  getChannelEditInfo,
  getChannelListWithTye,
  saveChannel
} from "~/api/channel/ChannelInterface.ts";
import {PayChannelType, PayChannelTypeSelectOption, ResponseBody} from "~/utils/constant.ts";
import type {Rule} from 'ant-design-vue/es/form';
const alipayUserChannelStepsItems=[
  {
    title: '基础信息',
  },
  {
    title: '参数配制',
  },
  {
    title: '扫码授权',
  },
  {
    title: '结束'
  },
]
const commonChannelStepsItems=[
  {
    title: '基础信息',
  },
  {
    title: '参数配制',
  },
  {
    title: '结束'
  },
]
const current=ref(0)
const router=useRouter()
const formRef=ref()
const groups=shallowRef<any[]>([])
const saveLoading=ref(false)
const formData=reactive<ChannelFormData>({
  isEnableAllocation:false,
  channelType:PayChannelType.ALI,
  channelConfig:{
    isCert:false
  }
})
const channels=shallowRef<ChannelSimpleResponse[]>([])
const oauthUrlCodeResult=ref<ResponseBody<String>>(null)
const isLoading=ref(false)
const errorMsg=ref("")
const isSaveSuccess=ref(false)


const validateChannelType = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请选择渠道类型");
  }else {
    return Promise.resolve();
  }
};
const validateName = async (_rule: Rule, value: string) => {
  if (!value ) {
    return Promise.reject("请输入渠道名称");
  }else {
    return Promise.resolve();
  }
};
const validateAlipayAppId = async (_rule: Rule, value: string) => {
  if (current.value==1 && !formData.channelConfig['appId'] ) {
    return Promise.reject("请输入支付宝应用ID");
  }else {
    return Promise.resolve();
  }
};
const validatePid = async (_rule: Rule, value: string) => {
  if (current.value==1 && !formData.channelConfig['pid'] ) {
    return Promise.reject("请输入支付宝合作伙伴Id");
  }else {
    return Promise.resolve();
  }
};
const validateAlipayPublicKey = async (_rule: Rule, value: string) => {
  if (current.value==1 && !formData.channelConfig['alipayPublicKey'] ) {
    return Promise.reject("请输入支付宝公钥");
  }else {
    return Promise.resolve();
  }
};
const validateAlipayAppCert = async (_rule: Rule, value: any) => {
  if (current.value==1 && !formData.channelConfig['appCert'] ) {
    return Promise.reject("请输入应用公钥证书");
  }else {
    return Promise.resolve();
  }
};
const validateAlipayPublicCert = async (_rule: Rule, value: any) => {
  if (current.value==1 && !formData.channelConfig['alipayPublicCert'] ) {
    return Promise.reject("请输入支付宝公钥证书");
  }else {
    return Promise.resolve();
  }
};
const validateAlipayRootCert = async (_rule: Rule, value: any) => {
  if (current.value==1 && !formData.channelConfig['alipayRootCert'] ) {
    return Promise.reject("请输入支付宝根证书");
  }else {
    return Promise.resolve();
  }
};
const validateAlipayPrivateKey = async (_rule: Rule, value: string) => {
  if (current.value==1 && !formData.channelConfig['privateKey'] ) {
    return Promise.reject("请输入支付宝开发者私钥");
  }else {
    return Promise.resolve();
  }
};
const validateIsCert = async (_rule: Rule, value: string) => {
  if (current.value==1 && formData.channelConfig['isCart']==null  ) {
    return Promise.reject("请选择签名方式");
  }else {
    return Promise.resolve();
  }
};
const rules: Record<string, Rule[]> = {
  channelType: [{required:true,validator: validateChannelType, trigger: 'change' }],
  name: [{required:true, validator: validateName, trigger: 'change' }],
  alipayAppId: [{ required:true,validator: validateAlipayAppId, trigger: 'change' }],
  pid: [{required:true, validator: validatePid, trigger: 'change' }],
  alipayPrivateKey: [{required:true, validator: validateAlipayPrivateKey, trigger: 'change' }],
  IsCert: [{required:true, validator: validateIsCert, trigger: 'change' }],
  alipayPublicKey:[{required:true, validator: validateAlipayPublicKey, trigger: 'change' }],
  alipayAppCert:[{ required:true,validator: validateAlipayAppCert, trigger: 'blur' }],
  alipayPublicCert:[{ required:true,validator: validateAlipayPublicCert, trigger: 'blur' }],
  alipayRootCert:[{ required:true,validator: validateAlipayRootCert, trigger: 'blur' }],
};

const next=(value:number)=>{
  formRef.value
      .validate()
      .then(() => {
          current.value=value
      })

}

const newChannel=()=>{
  if(formData.id){
    router.replace({path:router.currentRoute.value.path})
    return;
  }
  formData.name=""
  formData.id=null
  formData.allocationConfig={
    isCert:false,
  }
  formData.channelType=PayChannelType.ALI
  current.value=0
  isSaveSuccess.value=false
  errorMsg.value=""
}
const onSubmit =async ()=>{
  formRef.value
      .validate()
      .then(() => {
        saveLoading.value=true
        saveChannel(formData).then(res=>{
           saveLoading.value=false
           isSaveSuccess.value=true
           current.value=PayChannelType.ALI_USER==formData.channelType?3:2
        }).catch(err=>{
          saveLoading.value=false
          isSaveSuccess.value=false
          errorMsg.value=err
          current.value=PayChannelType.ALI_USER==formData.channelType?3:2
        })
      })
}

/**
 * 获取渠道授权二维码
 */
const getChannelOauthCode=async ()=>{
  isLoading.value=true
  try {
    oauthUrlCodeResult.value=await useGet(`/channel/genOauthCode/${formData.channelConfig.channelId}`)
  }finally {
    isLoading.value=false
    current.value=2
  }
}
const loadGroups=async ()=>{
  const { data } =await  useGet<any[]>("/channel/group/list")
  groups.value=data??[]
}
const onChannelTypeChange=(value:PayChannelType|unknown)=>{
    if((PayChannelType.ALI_USER==value || PayChannelType.ALI_OPEN==value) && channels.value.length==0){
       getChannelListWithTye(PayChannelType.ALI).then(res=>{
          channels.value=res.data??[]
       })
    }
}
onMounted(()=>{
  const id= router.currentRoute.value.query['id']
  if(id){
     isLoading.value=true
     getChannelEditInfo(id).then((res)=>{
       Object.assign(formData,res.data??{})
       if(PayChannelType.ALI_USER==formData.channelType || PayChannelType.ALI_OPEN==formData.channelType){
         onChannelTypeChange(formData.channelType)
       }
       isLoading.value=false
     })
  }
  loadGroups()
})
</script>

<template>
  <a-spin :spinning="isLoading">
    <a-flex justify="center" align="center">
      <a-form ref="formRef" style="width: 800px" :model="formData" layout="vertical"  :rules="rules">
        <a-flex vertical :gap="10">
          <a-card >
            <a-flex>
              <a  @click="router.back()"   style="font-size: 16px;font-weight: 600;color: #333"><ArrowLeftOutlined class="mr-1"/> 返回</a>
            </a-flex>
          </a-card>
          <a-card >
            <a-steps :current="current" v-if="PayChannelType.ALI_USER==formData.channelType" :percent="60" label-placement="vertical" :items="alipayUserChannelStepsItems"  />
            <a-steps :current="current" v-else :percent="60" label-placement="vertical" :items="commonChannelStepsItems"  />
            <a-card v-if="current==0" :bordered="false">
              <!--          <a-typography-text strong>1.基础信息</a-typography-text>-->
              <a-form-item label="渠道类型" name="channelType"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-select :disabled="formData.id!=null" style="width: 100%" v-model:value="formData.channelType"  @change="onChannelTypeChange">
                    <a-select-option v-for="(item) in PayChannelTypeSelectOption"  :value="item.value">{{item.title}}</a-select-option>
                  </a-select>
                  <a-typography-text type="secondary">目前系统支持平台:支付宝,微信.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="渠道名称" name="name" class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.name" placeholder="请输入渠道名称"></a-input>
                  <a-typography-text type="secondary">为了方便管理,请给渠道起个名呗.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="渠道组" name="groupCode" class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-select v-model:value="formData.groupCode" >
                    <a-select-option v-for="(item) in groups" :value="item.groupCode">{{item.name}}</a-select-option>
                  </a-select>
                  <a-typography-text type="secondary">请选择渠道分组,用于派单</a-typography-text>
                </a-flex>
              </a-form-item>
            </a-card>
            <a-card  v-if="current==1&& PayChannelType.ALI_OPEN===formData.channelType" :bordered="false">
              <a-form-item label="应用ID" name="alipayAppId"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['appId']" placeholder="请输入支付宝应用ID"></a-input>
                  <a-typography-text type="secondary">支付宝平台申请的应用ID.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="PID" name="pid"  class="mt-5" required>
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['pid']" placeholder="请输入支付宝合作伙伴Id"></a-input>
                  <a-typography-text type="secondary">支付宝平台申请的合作伙伴Id.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="开发者私钥" name="alipayPrivateKey"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['privateKey']" placeholder="请输入支付宝开发者私钥"></a-input>
                  <a-typography-text type="secondary">请输入支付宝开发者私钥</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="支付宝公钥" name="alipayPublicKey"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['alipayPublicKey']" placeholder="请输入支付宝公钥"></a-input>
                  <a-typography-text type="secondary">支付宝平台下发的公钥.</a-typography-text>
                </a-flex>
              </a-form-item>

            </a-card>
            <a-card  v-if="current==1&& PayChannelType.ALI===formData.channelType" :bordered="false">
              <!--            <a-typography-text strong>2.渠道配制</a-typography-text>-->
              <a-form-item label="应用ID" name="alipayAppId"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['appId']" placeholder="请输入支付宝应用ID"></a-input>
                  <a-typography-text type="secondary">支付宝平台申请的应用ID.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="PID" name="pid"  class="mt-5" required>
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['pid']" placeholder="请输入支付宝合作伙伴Id"></a-input>
                  <a-typography-text type="secondary">支付宝平台申请的合作伙伴Id.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="开发者私钥" name="alipayPrivateKey"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['privateKey']" placeholder="请输入支付宝开发者私钥"></a-input>
                  <a-typography-text type="secondary">请输入支付宝开发者私钥</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item label="签名方式" name="isCert"  class="mt-5" >
                <a-radio-group   v-model:value="formData.channelConfig['isCert']" default-value="false">
                  <a-radio :value="false" >密钥</a-radio>
                  <a-radio :value="true">证书</a-radio>
                </a-radio-group >

              </a-form-item>
              <a-form-item v-if="!formData.channelConfig['isCert']" label="支付宝公钥" name="alipayPublicKey"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-input v-model:value="formData.channelConfig['alipayPublicKey']" placeholder="请输入支付宝公钥"></a-input>
                  <a-typography-text type="secondary">支付宝平台下发的公钥证书.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item v-if="formData.channelConfig['isCert']" label="应用公钥证书" name="alipayAppCert"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <SingFileUpload :is-upload="false" :show-upload-list="true" v-model:value="formData.channelConfig['appCert']" >
                    <a-button>
                      <UploadOutlined/>
                      upload
                    </a-button>
                  </SingFileUpload>
                  <a-typography-text type="secondary">支付宝平台下发的应用公钥证书.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item v-if="formData.channelConfig['isCert']" label="支付宝公钥证书" name="alipayPublicCert"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <SingFileUpload :is-upload="false" :show-upload-list="true" v-model:value="formData.channelConfig['alipayPublicCert']" >
                    <a-button>
                      <UploadOutlined/>
                      upload
                    </a-button>
                  </SingFileUpload>
                  <a-typography-text type="secondary">支付宝平台下发的公钥证书.</a-typography-text>
                </a-flex>
              </a-form-item>
              <a-form-item v-if="formData.channelConfig['isCert']" label="支付宝根证书" name="alipayRootCert"  class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <SingFileUpload :is-upload="false" :show-upload-list="true" v-model:value="formData.channelConfig['alipayRootCert']" >
                    <a-button>
                      <UploadOutlined/>
                      upload
                    </a-button>
                  </SingFileUpload>
                  <a-typography-text type="secondary">支付宝平台下发的公钥证书.</a-typography-text>
                </a-flex>
              </a-form-item>
            </a-card>
            <a-card  v-if="current==1&& PayChannelType.ALI_USER===formData.channelType" :bordered="false">
              <a-form-item label="渠道"   class="mt-5" >
                <a-flex style="flex: 1" vertical>
                  <a-select v-model:value="formData.channelConfig['channelId']" placeholder="请选择支付宝渠道">
                    <a-select-option v-for="(item) in channels" :value="item.id">{{item.name}}</a-select-option>
                  </a-select>
                  <a-typography-text type="secondary">随意选择一个支付宝渠道主要用于获取支付宝用户ID.</a-typography-text>
                </a-flex>
              </a-form-item>
            </a-card>
            <a-card  v-if="current==2&& PayChannelType.ALI_USER===formData.channelType" :bordered="false">
                <a-flex vertical justify="center" align="center" :gap="10">
                  <vue-qrcode :color="{}" :quality="1" :value="oauthUrlCodeResult.data" :width="200" :margin="0"></vue-qrcode>
                  <a-typography-text type="secondary">打开手机浏览器扫一扫</a-typography-text>
                </a-flex>
                <a-form-item label="支付宝用户ID" name="alipayUserId">
                  <a-flex style="flex: 1" vertical>
                    <a-input v-model:value="formData.channelConfig['userId']" placeholder="请扫码/手动填写支付宝用户ID"></a-input>
                    <a-typography-text type="secondary">支持扫码获取用户ID以及手动填写用户ID.</a-typography-text>
                  </a-flex>
                </a-form-item>
                <a-form-item label="终端类型" name="alipayUserId">
                    <a-radio-group  v-model:value="formData.channelConfig['clientType']" default="SERVICE">
                      <a-radio value="SERVICE">服务器</a-radio>
                      <a-radio value="CLIENT">客户端</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="支付宝用户Cookie" v-if="'SERVICE'==formData.channelConfig['clientType']" name="alipayUserCookie" >
                  <a-flex style="flex: 1" vertical>
                    <a-input v-model:value="formData.channelConfig['userCookie']" placeholder="请填写支付宝用户Cookie"></a-input>
                    <a-flex :gap="5">
                      <a-typography-text type="secondary">需要填写与用户ID一致的支付宝账号Cookie.</a-typography-text>
                      <a-typography-link>怎么获取Cookie?</a-typography-link>
                    </a-flex>
                  </a-flex>
                </a-form-item>
                <a-flex :gap="5" v-if="'CLIENT'==formData.channelConfig['clientType']">
                  <a-typography-text type="secondary">客户端模式需要下载客户端软件并运行.</a-typography-text>
                  <a-typography-link>下载客端</a-typography-link>
                </a-flex>
            </a-card>
            <a-card  v-if="
            (
                    (PayChannelType.ALI_USER==formData.channelType && current==alipayUserChannelStepsItems.length-1)
                    ||
                    (
                        (PayChannelType.ALI==formData.channelType  || PayChannelType.ALI_OPEN==formData.channelType )
                        && current==commonChannelStepsItems.length-1)
              )
              " :bordered="false">
              <a-flex vertical v-if="isSaveSuccess" justify="center" align="center" :gap="10">
                <CheckCircleOutlined style="font-size: 24px;color: green"/>
                <a-typography-text type="success">配制成功</a-typography-text>
              </a-flex>
              <a-flex vertical v-if="!isSaveSuccess"   justify="center" align="center" :gap="10">
                <CloseCircleOutlined style="font-size: 24px;color: red"/>
                <a-typography-text type="danger">{{errorMsg}}</a-typography-text>
              </a-flex>
            </a-card>
            <a-flex justify="center" align="center" :gap="30" class="mt-10">
              <a-button v-if="current==0" @click="router.back()" style="width:100px">取消</a-button>
              <a-button v-if="current==0" @click="next(1)" style="width:100px" type="primary">下一步</a-button>
              <a-button v-if="current==1" @click="current=0" style="width:100px"  >上一步</a-button>
              <a-button v-if="current==1 && PayChannelType.ALI_USER!=formData.channelType" @click="onSubmit" style="width:100px" :loading="saveLoading" type="primary">保存</a-button>
              <a-button v-if="current==1 && PayChannelType.ALI_USER==formData.channelType" @click="getChannelOauthCode" style="width:100px" :loading="saveLoading" type="primary">下一步</a-button>
              <a-button v-if="current==2 && PayChannelType.ALI_USER==formData.channelType" @click="current=1" style="width:100px"  >上一步</a-button>
              <a-button v-if="current==2 && PayChannelType.ALI_USER==formData.channelType" @click="onSubmit" style="width:100px" :loading="saveLoading" type="primary">保存</a-button>

              <a-button v-if="
              (PayChannelType.ALI==formData.channelType  || PayChannelType.ALI_OPEN==formData.channelType )
                         && current==commonChannelStepsItems.length-1 && !isSaveSuccess"  @click="current=1" style="width:100px"  type="primary" >上一步</a-button>
              <a-button v-if="
              (
                    (PayChannelType.ALI_USER==formData.channelType && current==alipayUserChannelStepsItems.length-1)
                    ||
                    (
                        (PayChannelType.ALI==formData.channelType  || PayChannelType.ALI_OPEN==formData.channelType )
                        && current==commonChannelStepsItems.length-1)
                    )
               && isSaveSuccess" @click="newChannel" style="width:100px"  type="primary" >继续添加</a-button>

              <a-button v-if="
               (
                    (PayChannelType.ALI_USER==formData.channelType && current==alipayUserChannelStepsItems.length-1)
                    ||
                    (
                        (PayChannelType.ALI==formData.channelType  || PayChannelType.ALI_OPEN==formData.channelType )
                        && current==commonChannelStepsItems.length-1)
              )
              " @click="router.back()" style="width:100px" >返回列表</a-button>
            </a-flex>
          </a-card>



        </a-flex>
      </a-form>
    </a-flex>
  </a-spin>
</template>

<style scoped lang="less">

</style>