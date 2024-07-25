<script setup lang="ts">
import {UploadChangeParam, UploadProps} from "ant-design-vue";
import path from "path";
import {ResponseBody, uploadAction, UploadResourceResponse} from "~/utils/constant.ts";
import {UploadFile} from "ant-design-vue/es/upload/interface";
import {PropType} from "@vue/runtime-core";

const message = useMessage()

const props = defineProps({
  value: {
    type: String,
    required: false
  },

  showUploadList:{
    type: Boolean,
    default:false,
    required: false
  },
  maxCount:{
    type:Number,
    default:1,
    required:false
  },
  style:{
    type:Object,
    default:{}
  },
  uploadPath:{
    type:String,
    default:'/images',
    required: false
  }
})
const action=import.meta.env.VITE_APP_BASE_API+"/oss/upload"
const emits = defineEmits(['update:value'])


function beforeUpload(file: UploadProps['fileList'][number]) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng){
    message.error('You can only upload JPG file!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M){
    message.error('Image must smaller than 2MB!')
    return false
  }
  getBase64(file, (base64Url: string) => {
    emits("update:value",base64Url)
  })
  return true
}
function getBase64(img: Blob|unknown, callback: (base64Url: string) => void) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(<Blob>img)
}
function handleUpdateChange(info: UploadChangeParam<UploadFile<ResponseBody<UploadResourceResponse>>>) {
  if (info.file.status === 'error') {
    message.error('upload error')
    emits("update:value",null)
  }else  if(info.file.status==="done"){
    emits("update:value",info.file.response.data)
  }
  else if(info.file.status=='removed'){
    emits("update:value",null)
  }
}



</script>

<template>
  <a-upload
      :max-count="maxCount"
      :show-upload-list="showUploadList"
      style="border: none;"
      :action="`${uploadAction}?path=${uploadPath}`"
      :before-upload="beforeUpload"
      @change="handleUpdateChange">
<!--    <div v-if="!modelValue" style="background: rgba(0, 0, 0, 0.1);">-->
<!--      <slot/>-->
<!--    </div>-->
    <div :style="style">
      <slot v-if="value===null || value.length===0" />
      <a-image v-else style="width: 100%;height: 100%" :src="value"></a-image>
    </div>
  </a-upload>
</template>

<style scoped lang="less">

</style>
