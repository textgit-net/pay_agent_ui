<script setup lang="ts">
import {UploadChangeParam} from "ant-design-vue";
import {InboxOutlined} from "@ant-design/icons-vue";
import {UploadFile} from "ant-design-vue/es/upload/interface";
import {ResponseBody, UploadResourceResponse} from "~/utils/constant.ts";

const message = useMessage()
const props = defineProps({
  value: {
    type:Array<UploadResourceResponse>,
    required: false,
    default:[]
  },
  path:{
    type:String,
    required: true
  }
})
const action=import.meta.env.VITE_APP_BASE_API+"/resource/upload"
const emits = defineEmits(['update:value',"change"])

const fileList = ref<UploadFile<ResponseBody<UploadResourceResponse>>[]>(props.value.map(v=>{
   return {
     uid:'',
     status:"done",
     name:v.name,
     size:v.fileSize,
     response:{
       data:v,
       code:0,
       msg:''
     },
     url:v.fileUrl
   }
}));
function handleUpdateChange(info: UploadChangeParam<UploadFile<ResponseBody<UploadResourceResponse>>>) {
  if (info.file.status === 'error') {
    message.error('upload error')
    return
  }
  if(info.file.status==="done"){
    let resources=props.value;
    resources.push(info.file.response.data)
    // emits("update:value",resources)
    emits("change",resources)
  }
}
</script>

<template>
  <a-upload-dragger
      v-model:fileList="fileList"
      name="file"
      :multiple="true"
      :action="`${action}?path=${path}`"
      @change="handleUpdateChange">
    <p class="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p class="ant-upload-text">Click or drag file to this area to upload</p>
    <p class="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>

  </a-upload-dragger>
</template>

<style scoped lang="less">

</style>