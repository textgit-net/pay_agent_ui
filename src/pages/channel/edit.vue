<script setup lang="ts">
import {ArrowLeftOutlined, UploadOutlined} from "@ant-design/icons-vue";
import {ChannelFormData} from "~/api/channel/ChannelInterface.ts";
import {PayChannelType, PayChannelTypeSelectOption} from "~/utils/constant.ts";
const items = ref([
  {
    title: '基础信息',
  },
  {
    title: '参数配制',
  },
  {
    title: '结束'
  },
]);
const current=ref(0)
const router=useRouter()
const formRef=ref()
const saveLoading=ref(false)
const formData=reactive<ChannelFormData>({
  isEnableAllocation:false,
  channelType:PayChannelType.ALI,
  channelConfig:{
    isCert:false
  }
})
const onSubmit =async ()=>{
  formRef.value
      .validate()
      .then(() => {
        saveLoading.value=true
      })
}
</script>

<template>
  <a-flex justify="center" align="center">
    <a-form ref="formRef" style="width: 800px" :model="formData" layout="vertical">
      <a-flex vertical :gap="10">
        <a-card >
          <a-flex>
            <a  @click="router.back()"   style="font-size: 16px;font-weight: 600;color: #333"><ArrowLeftOutlined class="mr-1"/> 返回</a>
          </a-flex>
        </a-card>
        <a-card >
          <a-steps :current="current" :percent="60" label-placement="vertical" :items="items" />
          <a-card v-if="current==0" :bordered="false">
            <!--          <a-typography-text strong>1.基础信息</a-typography-text>-->
            <a-form-item label="渠道类型" name="channelType"  class="mt-5" :rules="[{required:true,message:'请选择渠道类型'}]">
              <a-flex style="flex: 1" vertical>
                <a-select style="width: 100%" v-model:value="formData.channelType">
                  <a-select-option v-for="(item) in PayChannelTypeSelectOption"  :value="item.value">{{item.title}}</a-select-option>
                </a-select>
                <a-typography-text type="secondary">目前系统支持平台:支付宝,微信.</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="渠道名称" name="name" class="mt-5" :rules="[{required:true,message:'请输入渠道名称'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.name" placeholder="请输入渠道名称"></a-input>
                <a-typography-text type="secondary">为了方便管理,请给渠道起个名呗.</a-typography-text>
              </a-flex>
            </a-form-item>
          </a-card>
          <a-card  v-if="current==1" :bordered="false">
<!--            <a-typography-text strong>2.渠道配制</a-typography-text>-->
            <a-form-item label="应用ID" name="channelConfig.appId"  class="mt-5" :rules="[{required:true,message:'请输入支付宝应用ID'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.channelConfig['appId']" placeholder="请输入支付宝应用ID"></a-input>
                <a-typography-text type="secondary">支付宝平台申请的应用ID.</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="PID" name="channelConfig.pid"  class="mt-5" :rules="[{required:true,message:'请输入支付宝合作伙伴Id'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.channelConfig['pid']" placeholder="请输入支付宝合作伙伴Id"></a-input>
                <a-typography-text type="secondary">支付宝平台申请的合作伙伴Id.</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="开发者私钥" name="channelConfig.privateKey"  class="mt-5" :rules="[{required:true,message:'请输入支付宝开发者私钥'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.channelConfig['privateKey']" placeholder="请输入支付宝合作伙伴Id"></a-input>
                <a-typography-text type="secondary">支付宝平台申请的合作伙伴Id.</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="签名方式" name="channelConfig.isCert"  class="mt-5" :rules="[{required:true,message:'请选择签名方式'}]">
              <a-radio-group   v-model:value="formData.channelConfig['isCert']" default-value="false">
                <a-radio :value="false" >密钥</a-radio>
                <a-radio :value="true">证书</a-radio>
              </a-radio-group >

            </a-form-item>
            <a-form-item v-if="!formData.channelConfig['isCert']" label="支付宝公钥" name="channelConfig.alipayPublicKey"  class="mt-5" :rules="[{required:true,message:'请输入支付宝公钥'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.channelConfig['alipayPublicKey']" placeholder="请输入支付宝公钥"></a-input>
                <a-typography-text type="secondary">支付宝平台下发的公钥证书.</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item v-if="formData.channelConfig['isCert']" label="应用公钥证书" name="channelConfig.appCert"  class="mt-5" :rules="[{required:true,message:'请输入应用公钥证书'}]">
              <a-flex style="flex: 1" vertical>
                <a-textarea v-model:value="formData.channelConfig['appCert']" placeholder="请输入应用公钥证书" :rows="6"></a-textarea>
                <a-typography-text type="secondary">支付宝平台下发的应用公钥证书.</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item v-if="formData.channelConfig['isCert']" label="支付宝公钥证书" name="channelConfig.alipayPublicCert"  class="mt-5" :rules="[{required:true,message:'请输入支付宝公钥证书'}]">
              <a-flex style="flex: 1" vertical>
                <a-textarea v-model:value="formData.channelConfig['alipayPublicCert']" placeholder="请输入支付宝公钥证书" :rows="6"></a-textarea>
                <a-typography-text type="secondary">支付宝平台下发的公钥证书.</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item v-if="formData.channelConfig['isCert']" label="支付宝根证书" name="channelConfig.alipayRootCert"  class="mt-5" :rules="[{required:true,message:'请输入支付宝根证书'}]">
              <a-flex style="flex: 1" vertical>
                <a-textarea  v-model:value="formData.channelConfig['alipayRootCert']" placeholder="请输入支付宝公钥" :rows="6"></a-textarea>
                <a-typography-text type="secondary">支付宝平台下发的公钥证书.</a-typography-text>
              </a-flex>
            </a-form-item>
          </a-card>
          <a-flex justify="center" align="center" :gap="30" class="mt-10">
            <a-button v-if="current==0" @click="router.back()" style="width:100px">取消</a-button>
            <a-button v-if="current==0" @click="current=1" style="width:100px" :loading="saveLoading" type="primary">下一步</a-button>
            <a-button v-if="current==1" @click="current=0" style="width:100px" :loading="saveLoading" >上一步</a-button>
            <a-button v-if="current==1" @click="onSubmit" style="width:100px" :loading="saveLoading" type="primary">保存</a-button>

          </a-flex>
        </a-card>



      </a-flex>
    </a-form>
  </a-flex>
</template>

<style scoped lang="less">

</style>