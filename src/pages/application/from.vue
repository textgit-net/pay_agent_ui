<script setup lang="ts">
import PickColors from 'vue-pick-colors'
import {
  AndroidFilled,
  AppleFilled, ArrowLeftOutlined,
  InboxOutlined,
  LinkOutlined,
  MobileTwoTone,
  QuestionCircleOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'
import {ColumnsType} from "ant-design-vue/es/table";
import {
  AndroidResourceSize,
  ApplicationFrom, getApplicationCategory,
  getApplicationInfo,
  IosIconSize,
  saveApplication
} from "~/api/application.ts";
import {useUserStore} from "~/stores/user.ts";
import {
  AndroidApplicationStoreTypeSelectOption, ApplicationStoreStatus,
  ApplicationStoreStatusSelectOption,
  SerialStatus
} from "~/utils/constant.ts";
import {CascaderProps} from "ant-design-vue";
import {ap} from "vitest/dist/reporters-5f784f42";
const router=useRouter()
const configTabActiveKey=ref("android")
const versionTabActiveKey=ref("android")
const iosPreviewAndScreenshotsTabActiveKey=ref("6.5")
const message=useMessage()
const formRef=ref()
const categoryOptions=shallowRef<CascaderProps['options']>([])
const applicationForm=reactive<ApplicationFrom>(<ApplicationFrom>{
  navigationConfig:{
    items:[],
    textColor:"#000000",
    selectTextColor:"#e30e16",
    textSize:16,
    selectTextSize:16,
    isSelectBold:false
  },
  androidSplashImages:{
    MDPI:"",
    HDPI:"",
    X_HDPI:"",
    XX_HDPI:"",
    XXX_HDPI:""
  },
  androidIcons:{
    MDPI:"",
    HDPI:"",
    X_HDPI:"",
    XX_HDPI:"",
    XXX_HDPI:""
  },
  iosIcons:{
    ICON_40:"",
    ICON_58:"",
    ICON_60:"",
    ICON_80:"",
    ICON_87:"",
    ICON_120:"",
    ICON_180:"",
    ICON_1024:""
  }
})
const addNavigationItem=()=>{
  if(applicationForm.navigationConfig.items.length===5){
    message.error("最多只能添加5项")
    return;
  }
  applicationForm.navigationConfig.items.push({
    icon:"",
    selectIcon:""
  })
}

const state=reactive({
  isLoad:false
})

const doSave=async ()=>{
  await saveApplication(applicationForm)
  message.success("操作成功")
  router.back()
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
const loadInfo=async (id:number)=>{
  state.isLoad=true
  const res=await getApplicationInfo(id)
  Object.assign(applicationForm,res.data??{})
  applicationForm.companyId=res.data?.company?.id
  let pathIds= res.data?.category?.pathIds??""
  if(pathIds.length>0){
      applicationForm.categoryIds=pathIds.split(",")
  }
  state.isLoad=false
}
const loadCategory=async ()=>{
  const res=await getApplicationCategory()
  categoryOptions.value=res.data??[]
}
onMounted(()=>{
  let id=router.currentRoute?.value?.query["id"]?.toString()??""
  if(id){
    loadInfo(Number.parseInt(id))
  }
  loadCategory()
})
</script>

<template>
  <a-flex justify="center" align="center">
    <div style="width: 800px">
      <a-card class="mb-4">
        <a-flex>
          <a  @click="router.back()"   style="font-size: 16px;font-weight: 600;color: #333"><ArrowLeftOutlined class="mr-1"/> 返回</a>
        </a-flex>
      </a-card>
      <a-spin :spinning="state.isLoad">
        <a-form ref="formRef" layout="vertical" :model="applicationForm">
          <!--基础信息Start-->
          <a-card  >
            <a-typography-text strong>1.基础信息</a-typography-text>
            <a-form-item label="应用类型" name="categoryIds" class="mt-5" :rules="[{required:true,message:'请输入应用名称',trigger:'blur'}]">
              <a-flex style="flex: 1" vertical>
                <a-cascader v-model:value="applicationForm.categoryIds" placeholder="请输入应用名称" :options="categoryOptions"/>
                <a-typography-text type="secondary">不同应用,需要的资质有所不同,广告收益也有影响</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item  label="应用名称" name="name" class="mt-5" :rules="[{required:true,message:'请输入应用名称',trigger:'blur'}]">
              <a-flex align="right" :gap="10">
                <a-flex style="flex: 1" vertical>
                  <a-input :disabled="applicationForm.id!=null" v-model:value="applicationForm.name" placeholder="请输入应用名称"></a-input>
                  <a-typography-text type="secondary">需包含该应用软著登记名称（或软著中注明的软件简称）/实际应用名称。随意填写可能会影响应用正常合作。</a-typography-text>
                </a-flex>
                <a-typography-text :level="1" type="secondary" >0/50</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="应用图标" class="mt-5" name="icon" >
              <a-flex style="flex: 1" vertical>
                <SingFileUpload
                    v-model:value="applicationForm.icon"
                    :show-upload-list="true">
                  <a-button>
                    <UploadOutlined/>
                    upload
                  </a-button>
                </SingFileUpload>
                <a-typography-text type="secondary">应用图标，手动上传最大支持1024*1024、1M以内的1:1的jpg/png格式文件</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="所属企业" class="mt-5" name="companyId" :rules="[{required:true,message:'请选择企业'}]">
              <RemoteSelect placeholder="请选择企业" v-model:value="applicationForm.companyId" data-source-url="/company/selectOption"/>
            </a-form-item>
            <a-form-item label="应用软著" class="mt-5" :rules="[{required:true,message:'请输入应用名称'}]">
              <a-flex style="flex: 1" vertical>
                <SingFileUpload
                    v-model:value="applicationForm.softwareCopyright"
                    :show-upload-list="true">
                  <a-button>
                    <UploadOutlined/>
                    upload
                  </a-button>
                </SingFileUpload>
                <a-typography-text type="secondary">软著所有权必需与企业主体一致。</a-typography-text>
              </a-flex>
            </a-form-item>
          </a-card>
          <!--基础信息End-->
          <!--应用备案Start-->
          <a-card  class="mt-5" >
            <a-typography-text strong>2.应用备案</a-typography-text>
            <a-form-item  label="备案进度" name="name" class="mt-5" >
              <a-radio-group v-model:value="applicationForm.appSerialStatus">
                <a-radio :value="SerialStatus.ONGOING">进行中</a-radio>
                <a-radio :value="SerialStatus.COMPLETE">完成</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item  v-if="SerialStatus.COMPLETE==applicationForm.appSerialStatus" label="备案号" name="appSerial" class="mt-5" :rules="[{required:true,message:'请输入备案号'}]" >
              <a-input  v-model:value="applicationForm.appSerial" placeholder="请输入备案号"></a-input>
            </a-form-item>
            <a-form-item v-if="SerialStatus.COMPLETE==applicationForm.appSerialStatus" label="备案凭证" class="mt-5" name="appSerialImg"  :rules="[{required:true,message:'请上传备案凭证'}]">
              <a-flex style="flex: 1" vertical>
                <SingFileUpload
                    v-model:value="applicationForm.appSerialImg"
                    :show-upload-list="true">
                  <a-button>
                    <UploadOutlined/>
                    upload
                  </a-button>
                </SingFileUpload>
                <a-typography-text type="secondary">备案凭证，手动上传最大支持1024*1024、1M以内的1:1的jpg/png格式文件</a-typography-text>
              </a-flex>
            </a-form-item>
          </a-card>
          <!--应用备案end-->
          <!--应用配制Start-->
          <a-card  class="mt-5" id="app-config" >
            <a-typography-text strong>3.应用配制</a-typography-text>
            <a-form-item class="mt-4" name="bundleIdentifier" label="包名"  :rules="[{required:true,message:'请输入应用包名'}]">
              <a-input :disabled="applicationForm.id!=null" v-model:value="applicationForm.bundleIdentifier"  placeholder="请输入应用包名"></a-input>
              <a-typography-text type="secondary">需包含该应用软著登记包名</a-typography-text>
            </a-form-item>
            <a-tabs v-model:activeKey="configTabActiveKey">
              <a-tab-pane key="android" tab="Android">
                <a-form-item label="应用图标">
                  <a-flex justify="center" align="flex-end" :gap="20">
                    <!--mdpi -->
                    <a-flex vertical justify="center" align="center">
                      <ImageUpload
                          :style="{width: '60px',height:'60px',display:'flex',justifyContent:'center',alignContent:'center'}"
                          v-model:value="applicationForm.androidIcons.MDPI"
                          class="avatar-uploader">
                        <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                          <div class="ant-upload-text" style="font-size: 10px;">48x48px</div>
                        </a-flex>
                      </ImageUpload>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">Android</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">mdpi</a-typography-text>
                      </a-flex>
                    </a-flex>
                    <!--hdpi -->
                    <a-flex vertical justify="center" align="center">
                      <ImageUpload
                          :style="{width: '60px',height:'60px',display:'flex',justifyContent:'center',alignContent:'center'}"
                          v-model:value="applicationForm.androidIcons.HDPI"
                          class="avatar-uploader">
                        <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                          <div class="ant-upload-text" style="font-size: 10px;">72x72px</div>
                        </a-flex>
                      </ImageUpload>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">Android</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">hdpi</a-typography-text>
                      </a-flex>
                    </a-flex>
                    <!--xhdpi -->
                    <a-flex vertical justify="center" align="center">
                      <ImageUpload
                          :style="{width: '60px',height:'60px',display:'flex',justifyContent:'center',alignContent:'center'}"
                          v-model:value="applicationForm.androidIcons.X_HDPI"
                          class="avatar-uploader">
                        <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                          <div class="ant-upload-text" style="font-size: 10px;">96x96px</div>
                        </a-flex>
                      </ImageUpload>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">Android</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">xhdpi</a-typography-text>
                      </a-flex>
                    </a-flex>
                    <!--xxhdpi -->
                    <a-flex vertical justify="center" align="center">
                      <ImageUpload
                          :style="{width: '60px',height:'60px',display:'flex',justifyContent:'center',alignContent:'center'}"
                          v-model:value="applicationForm.androidIcons.XX_HDPI"
                          class="avatar-uploader">
                        <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                          <div class="ant-upload-text" style="font-size: 10px;">144x144px</div>
                        </a-flex>
                      </ImageUpload>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">Android</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">xxhdpi</a-typography-text>
                      </a-flex>
                    </a-flex>
                    <!--xxxhdpi -->
                    <a-flex vertical justify="center" align="center">
                      <ImageUpload
                          :style="{width: '60px',height:'60px',display:'flex',justifyContent:'center',alignContent:'center'}"
                          v-model:value="applicationForm.androidIcons.XXX_HDPI"
                          class="avatar-uploader">
                        <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                          <div class="ant-upload-text" style="font-size: 10px;">192x192px</div>
                        </a-flex>
                      </ImageUpload>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">Android</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">xxxhdpi</a-typography-text>
                      </a-flex>
                    </a-flex>
                  </a-flex>
                </a-form-item>
                <a-form-item label="闪屏页">
                  <a-flex justify="center" align="flex-end" :gap="20">
                    <!--xhdpi -->
                    <a-flex vertical justify="center" align="center">
                      <ImageUpload
                          :style="{width: '150px',height:'324.8px',display:'flex',justifyContent:'center',alignContent:'center'}"
                          v-model:value="applicationForm.androidSplashImages.X_HDPI"
                          class="avatar-uploader">
                        <a-flex style="width: 150px;height: 324.8px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                          <div class="ant-upload-text" style="font-size: 10px;">750x1624px</div>
                        </a-flex>
                      </ImageUpload>
                    </a-flex>
                  </a-flex>
                </a-form-item>
              </a-tab-pane>
              <a-tab-pane  key="ios" tab="IOS">
                <a-form-item label="应用图标">
                  <a-flex justify="center" align="flex-end" :gap="20">
                    <!--20pt -->
                    <a-flex vertical justify="center" align="center">
                      <a-flex :gap="10">
                        <a-flex vertical justify="center" align="center">
                          <ImageUpload
                              :style="{width: '60px',height:'60px'}"
                              style=" display: flex;justify-content: center;align-content: center"
                              v-model:value="applicationForm.iosIcons.ICON_40"
                              class="avatar-uploader">
                            <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                              <div class="ant-upload-text" style="font-size: 10px;">40x40px</div>
                            </a-flex>
                          </ImageUpload>
                          <a-typography-text style="font-size: 12px;" >2x</a-typography-text>
                        </a-flex>
                        <a-flex vertical justify="center" align="center">
                          <ImageUpload
                              :style="{width: '60px',height:'60px'}"
                              style=" display: flex;justify-content: center;align-content: center"
                              v-model:value="applicationForm.iosIcons.ICON_60"
                              class="avatar-uploader">
                            <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                              <div class="ant-upload-text" style="font-size: 10px;">60x60px</div>
                            </a-flex>
                          </ImageUpload>
                          <a-typography-text style="font-size: 12px;" >3x</a-typography-text>
                        </a-flex>
                      </a-flex>
                      <a-divider style="margin: 5px"/>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">iOS</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">20pt</a-typography-text>
                      </a-flex>
                    </a-flex>
                    <!--29pt -->
                    <a-flex vertical justify="center" align="center">
                      <a-flex :gap="10">
                        <a-flex vertical justify="center" align="center">
                          <ImageUpload
                              :style="{width: '60px',height:'60px'}"
                              v-model:value="applicationForm.iosIcons.ICON_58"
                              style=" display: flex;justify-content: center;align-content: center"
                              :max-count="1"
                              class="avatar-uploader"
                              :show-upload-list="false">
                            <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                              <div class="ant-upload-text" style="font-size: 10px;">58x58px</div>
                            </a-flex>
                          </ImageUpload>
                          <a-typography-text style="font-size: 12px;" >2x</a-typography-text>
                        </a-flex>
                        <a-flex vertical justify="center" align="center">
                          <ImageUpload
                              :style="{width: '60px',height:'60px'}"
                              v-model:value="applicationForm.iosIcons.ICON_87"
                              style=" display: flex;justify-content: center;align-content: center"
                              :max-count="1"
                              class="avatar-uploader"
                              :show-upload-list="false">
                            <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                              <div class="ant-upload-text" style="font-size: 10px;">87x87px</div>
                            </a-flex>
                          </ImageUpload>
                          <a-typography-text style="font-size: 12px;" >3x</a-typography-text>
                        </a-flex>
                      </a-flex>
                      <a-divider style="margin: 5px"/>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">iOS</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">29pt</a-typography-text>
                      </a-flex>
                    </a-flex>
                    <!--40pt -->
                    <a-flex vertical justify="center" align="center">
                      <a-flex :gap="10">
                        <a-flex vertical justify="center" align="center">
                          <ImageUpload
                              :style="{width: '60px',height:'60px'}"
                              v-model:value="applicationForm.iosIcons.ICON_80"
                              style=" display: flex;justify-content: center;align-content: center"
                              :max-count="1"
                              class="avatar-uploader"
                              :show-upload-list="false">
                            <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                              <div class="ant-upload-text" style="font-size: 10px;">80x80px</div>
                            </a-flex>
                          </ImageUpload>
                          <a-typography-text style="font-size: 12px;" >2x</a-typography-text>
                        </a-flex>
                        <a-flex vertical justify="center" align="center">
                          <ImageUpload
                              :style="{width: '60px',height:'60px'}"
                              v-model:value="applicationForm.iosIcons.ICON_120"
                              style=" display: flex;justify-content: center;align-content: center"
                              :max-count="1"
                              class="avatar-uploader"
                              :show-upload-list="false">
                            <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                              <div class="ant-upload-text" style="font-size: 10px;">120x120px</div>
                            </a-flex>
                          </ImageUpload>
                          <a-typography-text style="font-size: 12px;" >3x</a-typography-text>
                        </a-flex>
                      </a-flex>
                      <a-divider style="margin: 5px"/>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">iOS</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">40pt</a-typography-text>
                      </a-flex>
                    </a-flex>
                    <!--60pt -->
                    <a-flex vertical justify="center" align="center">
                      <a-flex :gap="10" align="flex-end">
                        <a-flex vertical justify="center" align="center">
                          <ImageUpload
                              :style="{width: '80px',height:'80px'}"
                              v-model:value="applicationForm.iosIcons.ICON_180"
                              style=" display: flex;justify-content: center;align-content: center"
                              :max-count="1"
                              class="avatar-uploader"
                              :show-upload-list="false">
                            <a-flex style="width: 80px;height: 80px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                              <div class="ant-upload-text" style="font-size: 10px;">180x180px</div>
                            </a-flex>
                          </ImageUpload>
                          <a-typography-text style="font-size: 12px;" >3x</a-typography-text>
                        </a-flex>
                      </a-flex>
                      <a-divider style="margin: 5px"/>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">iOS</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">60pt</a-typography-text>
                      </a-flex>
                    </a-flex>
                    <!--1024pt -->
                    <a-flex vertical justify="center" align="center">
                      <a-flex vertical justify="center" align="center">
                        <ImageUpload
                            :style="{width: '100px',height:'100px'}"
                            v-model:value="applicationForm.iosIcons.ICON_1024"
                            style=" display: flex;justify-content: center;align-content: center"
                            :max-count="1"
                            class="avatar-uploader"
                            :show-upload-list="false">
                          <a-flex style="width: 100px;height: 100px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                            <div class="ant-upload-text" style="font-size: 10px;">1024x1024px</div>
                          </a-flex>
                        </ImageUpload>
                      </a-flex>
                      <a-divider style="margin: 5px"/>
                      <a-flex vertical justify="center" align="center" :gap="0">
                        <a-typography-text strong style="font-size: 10px">iOS</a-typography-text>
                        <a-typography-text strong style="font-size: 10px">1024pt</a-typography-text>
                      </a-flex>
                    </a-flex>
                  </a-flex>
                </a-form-item>
                <a-form-item label="应用预览截图">
                  <a-tabs v-model:activeKey="iosPreviewAndScreenshotsTabActiveKey">
                    <a-tab-pane key="6.5">
                      <template #tab>
                        <a-flex :gap="0">
                          <MobileTwoTone style="font-size: 28px"/>
                          <a-flex vertical>
                            <a-typography-text style="font-size: 12px;" type="secondary">iPhone</a-typography-text>
                            <a-typography-text style="font-size: 12px;" strong>6.5" Display</a-typography-text>
                          </a-flex>
                        </a-flex>
                      </template>
                      <a-upload-dragger
                          name="file"
                          :multiple="true"
                      >
                        <p class="ant-upload-drag-icon">
                          <InboxOutlined></InboxOutlined>
                        </p>
                        <p class="ant-upload-text">Click or drag file to this area to upload</p>
                        <p class="ant-upload-hint">
                          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                          band files
                        </p>
                      </a-upload-dragger>
                    </a-tab-pane>
                    <a-tab-pane key="5.5">
                      <template #tab>
                        <a-flex :gap="0">
                          <MobileTwoTone style="font-size: 28px"/>
                          <a-flex vertical>
                            <a-typography-text style="font-size: 12px;" type="secondary">iPhone</a-typography-text>
                            <a-typography-text style="font-size: 12px;" strong>5.5" Display</a-typography-text>
                          </a-flex>
                        </a-flex>
                      </template>
                      <a-upload-dragger
                          name="file"
                          :multiple="true"
                      >
                        <p class="ant-upload-drag-icon">
                          <InboxOutlined></InboxOutlined>
                        </p>
                        <p class="ant-upload-text">Click or drag file to this area to upload</p>
                        <p class="ant-upload-hint">
                          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                          band files
                        </p>
                      </a-upload-dragger>
                    </a-tab-pane>
                  </a-tabs>
                </a-form-item>
              </a-tab-pane>
            </a-tabs>
          </a-card>
          <!--应用配制end-->
          <!--应用版本Start-->
          <a-card  class="mt-5" id="app-config" >
            <a-typography-text strong>4.应用版本</a-typography-text>
            <a-tabs v-model:activeKey="versionTabActiveKey">
              <a-tab-pane key="android" tab="Android">
                <a-form-item class="mt-4" name="androidVersion" label="应用版本"  :rules="[{required:true,message:'请输入应用版本'}]">
                  <a-input  v-model:value="applicationForm.androidVersion"  placeholder="请输入应用版本"></a-input>
                </a-form-item>
                <a-form-item class="mt-4" name="androidStoreStatus" label="应用商店状态"  :rules="[{required:true,message:'请选择应用商店状态'}]">
                  <a-select v-model:value="applicationForm.androidStoreStatus" placeholder="请选择应用商店状态">
                    <a-select-option :value="item.value" v-for="(item) in ApplicationStoreStatusSelectOption">{{item.title}}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item  v-if="ApplicationStoreStatus.COMPLETE==applicationForm.androidStoreStatus" class="mt-4" name="androidStoreType" label="用商店类型"  :rules="[{required:true,message:'请选择应用商店类型'}]">
                  <a-select v-model:value="applicationForm.androidStoreType" placeholder="请选择应用商店类型">
                    <a-select-option :value="item.value" v-for="(item) in AndroidApplicationStoreTypeSelectOption">{{item.title}}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item v-if="ApplicationStoreStatus.COMPLETE==applicationForm.androidStoreStatus" class="mt-4" name="androidStoreUrl" label="应用商店地址"  :rules="[{required:true,message:'请输入应用商店地址'}]">
                  <a-input v-model:value="applicationForm.androidStoreUrl"  placeholder="请输入应用商店地址"></a-input>
                </a-form-item>
              </a-tab-pane>
              <a-tab-pane  key="ios" tab="IOS">
              </a-tab-pane>
            </a-tabs>
          </a-card>
          <!--应用版本end-->
          <!--导航栏配制Start-->
          <a-card  class="mt-5">
            <a-flex justify="space-between">
              <a-typography-text strong>5.导航栏配制</a-typography-text>
              <a-button @click="addNavigationItem" type="link">添加导航菜单项</a-button>
            </a-flex>
            <a-form-item>
              <a-typography-text strong>字体样式</a-typography-text>
            </a-form-item>
            <a-form-item label="选中样式">
              <a-flex :gap="20" class="ml-4">
                <a-space>
                  <a-typography-text strong>字体颜色</a-typography-text>
                  <pick-colors v-model:value="applicationForm.navigationConfig.selectTextColor"/>
                </a-space>
                <a-space>
                  <a-typography-text strong>字体大小</a-typography-text>
                  <a-input-number v-model:value="applicationForm.navigationConfig.selectTextSize" size="small"/>
                </a-space>
                <a-space>
                  <a-typography-text strong>是否加粗</a-typography-text>
                  <a-checkbox v-model:checked="applicationForm.navigationConfig.isSelectBold"></a-checkbox>
                </a-space>
              </a-flex>
            </a-form-item>
            <a-form-item label="未选中样式">
              <a-flex :gap="20" class="ml-4">
                <a-space>
                  <a-typography-text strong>字体颜色</a-typography-text>
                  <pick-colors v-model:value="applicationForm.navigationConfig.textColor"/>
                </a-space>
                <a-space>
                  <a-typography-text strong>字体大小</a-typography-text>
                  <a-input-number v-model:value="applicationForm.navigationConfig.textSize" size="small"/>
                </a-space>
              </a-flex>
            </a-form-item>
            <a-empty v-if="applicationForm.navigationConfig.items.length==0" description="暂未配制导航菜单项">
              <a-button  @click="addNavigationItem" type="primary">添加导航菜单项</a-button>
            </a-empty>
            <a-flex v-else justify="center" align="flex-end" >
              <a-flex :key="`nav_item_${index}`" v-for="(item,index) in applicationForm.navigationConfig.items" vertical align="center" justify="center">
                <a-flex justify="center" align="flex-end" :gap="10">
                  <a-flex vertical justify="center" align="center">
                    <!--                  <ImageUpload-->
                    <!--                      v-model:value="item.icon"-->
                    <!--                      :style="{width: '48px',height:'48px',display:'flex',justifyContent:'center',alignContent:'center'}"-->
                    <!--                      >-->
                    <!--                    <a-flex style="width: 48px;height: 48px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">-->
                    <!--                      <div class="ant-upload-text" style="font-size: 10px;">48x48px</div>-->
                    <!--                    </a-flex>-->
                    <!--                  </ImageUpload>-->
                    <ImageUpload
                        :style="{width: '48px',height:'48px',display:'flex',justifyContent:'center',alignContent:'center'}"
                        v-model:value="item.selectIcon"
                        class="avatar-uploader">
                      <a-flex style="width: 48px;height: 48px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                        <div class="ant-upload-text" style="font-size: 10px;">48x48px</div>
                      </a-flex>
                    </ImageUpload>
                    <a-flex vertical justify="center" align="center" :gap="0">
                      <a-typography-text strong style="font-size: 10px">选中图标</a-typography-text>
                    </a-flex>
                  </a-flex>
                  <a-flex vertical justify="center" align="center">
                    <ImageUpload
                        :style="{width: '48px',height:'48px',display:'flex',justifyContent:'center',alignContent:'center'}"
                        v-model:value="item.icon"
                        class="avatar-uploader">
                      <a-flex style="width: 48px;height: 48px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                        <div class="ant-upload-text" style="font-size: 10px;">48x48px</div>
                      </a-flex>
                    </ImageUpload>
                    <a-flex vertical justify="center" align="center" :gap="0">
                      <a-typography-text strong style="font-size: 10px">未选中图标</a-typography-text>
                    </a-flex>
                  </a-flex>
                </a-flex>
                <a-input v-model:value="item.text" style="text-align: center;" :bordered="false" placeholder="请输入标题"></a-input>
                <a style="font-size: 12px;"><LinkOutlined></LinkOutlined>未设置链接</a>
                <a-button @click="applicationForm.navigationConfig.items.splice(index,1)" type="link" danger>删除</a-button>
              </a-flex>

            </a-flex>


          </a-card>
          <!--导航栏配制end-->
          <!--功能模块配制Start--->
          <a-card  class="mt-5">
            <a-typography-text strong>6.功能模块配制</a-typography-text>
          </a-card>
          <!--功能模块配制end--->
          <a-card  class="mt-5">
            <a-flex justify="flex-end">
              <a-space>
                <a-button @click="router.back()" style="width:100px">取消</a-button>
                <a-button @click="onSubmit" style="width:100px" type="primary">保存</a-button>
              </a-space>
            </a-flex>
          </a-card>
        </a-form>
      </a-spin>
    </div>
  </a-flex>
</template>

<style scoped lang="less">
.avatar-uploader > .ant-upload {
  width: 80px;
  height: 80px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {

  color: #666;
}
</style>