<script setup lang="ts">
import {ResponseBody, uploadAction, UploadResourceResponse} from "~/utils/constant.ts";
import {UploadFile, UploadListType} from "ant-design-vue/es/upload/interface";
import {UploadChangeParam, UploadProps} from "ant-design-vue";


const message = useMessage()

const props = defineProps({
  value:{
    type:Object,
    default:{}
  },
  isUpload:{
    type: Boolean,
    default:true,
  },
  showUploadList:{
    type: Boolean,
    default:false,
    required: false
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
const fileList = ref<UploadFile<ResponseBody<String>>[]>(props.value?[{
  name: props.value.fileName,
  response: {
    code:200,
    msg:"",
  },
  uid: "",
  xhr: undefined,
}]:[])

const emits = defineEmits(['update:value'])

watch(()=>props.value,(newValue,oldValue)=>{
  if(newValue){
    debugger
    let fileName = `${newValue["fileName"]}`;
    fileName=fileName.substring(fileName.lastIndexOf("/")+1)
    fileList.value=[
      {
        name: fileName,
        response: {
          code:200,
          msg:"",
        },
        uid: "",
        xhr: undefined,
      }
    ]
  }
})
const onChange=(info: UploadChangeParam<UploadFile<ResponseBody<String>>>)=>{

  if (info.file.status === 'error') {
    message.error('upload error')
  }else if(info.file.status==="done"){
    info.file.url=info.file.response.data?.toString()
    emits("update:value",info.fileList[0].url)
  }else if(info.file.status=='removed'){
    emits("update:value",null)
  }
}

function beforeUpload(file: UploadProps['fileList'][number]) {
  if(!props.isUpload){
    getFileTextData(file,(textContent)=>{
      emits("update:value",{fileName:file.name,data:textContent})
    })
  }
  return props.isUpload
}
function getFileTextData(file: Blob|unknown, callback: (textContent: string) => void) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(<Blob>file)
}
</script>

<template>
  <a-upload list-type="picture"
            v-model:file-list="fileList"
            :max-count="1"
            :show-upload-list="showUploadList"
            :before-upload="beforeUpload"
            style="border: none;"
            :action="`${uploadAction}?path=${uploadPath}`"
            @change="onChange">
    <slot />
  </a-upload>
</template>

<style scoped lang="less">

</style>
