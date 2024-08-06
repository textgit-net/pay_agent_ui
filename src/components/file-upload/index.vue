<script setup lang="ts">
import {ResponseBody, uploadAction, UploadResourceResponse} from "~/utils/constant.ts";
import {UploadFile, UploadListType} from "ant-design-vue/es/upload/interface";
import {UploadChangeParam, UploadProps} from "ant-design-vue";


const message = useMessage()

const props = defineProps({

  value:{
    type:Array,
    default:[]
  },
  isUpload:{
    type:Boolean,
    default:true
  },
  listType:{
    type:String,
    default:"picture"
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
const fileList = ref<UploadFile<ResponseBody<String>>[]>()

const emits = defineEmits(['update:value'])

const onChange=(info: UploadChangeParam<UploadFile<ResponseBody<String>>>)=>{
  if (info.file.status === 'error') {
    message.error('upload error')
  }else if(info.file.status==="done"){
    info.file.url=info.file.response?.data?.toString()??""
  }
  emits("update:value",info.fileList)

}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [...(fileList.value || []), file];
  return props.isUpload;
};
</script>

<template>
  <a-upload :list-type="listType as UploadListType"
            v-model:file-list="fileList"
            :max-count="maxCount"
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
