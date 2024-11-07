<script setup lang="ts">
import { reactive} from 'vue';
import { message } from 'ant-design-vue';
import { getChannelGroupInfo, ChannelGroupListResponse,ChannelGroupFormData,saveChannelGroup } from '~/api/channel/group'
const route = useRoute()
const router = useRouter()
const state = reactive<{
  showBaseInfoDialog: boolean;
  dialogBtnLoading: boolean;
  isLoading:boolean;
}>({
  showBaseInfoDialog: false,
  dialogBtnLoading: false,
  isLoading: false,
})

const info = ref<ChannelGroupListResponse>({})
const formData=ref<ChannelGroupFormData>({})
const formRef=ref()

const getInfo=async (groupCode:string)=>{
  state.isLoading=true
  const {data} =await getChannelGroupInfo(groupCode)
  info.value = data
  
  state.isLoading=false
}

const handleShowBaseInfo = () => {
  state.showBaseInfoDialog = true

  nextTick(() => {
    formRef.value.resetFields()
  }).then(_=> {
    formData.value = JSON.parse(JSON.stringify(info.value))
   })
}
const isDisAbledChannelGroupForm = computed(() => {
  return !formData.value.description || !formData.value.name || !formData.value.groupCode || state.dialogBtnLoading
})
const onsubmit=async ()=>{
  formRef.value.validate().then(async()=> {
    state.dialogBtnLoading=true
    try {
      await saveChannelGroup(formData.value)
      await getInfo(groupCode as string)
      state.dialogBtnLoading=false
    }finally {
      state.dialogBtnLoading=false
    }
  })
}

const {groupCode}= route.query
onMounted(async ()=>{
  if(groupCode){
    
    await getInfo(groupCode as string)
    
  }
})
</script>

<template>
  <div>
    <a-modal
        v-model:open="state.showBaseInfoDialog"
        :mask-closable="false"
        :closable="true" centered :width="420" title="编辑渠道分组"
      >
      <template #footer>
        <a-button key="back" @click="state.showBaseInfoDialog =false">取 消</a-button>
        <a-button key="submit" type="primary" :loading="state.dialogBtnLoading" :disabled="isDisAbledChannelGroupForm" @click="onsubmit">确 认</a-button>
      </template>
      <a-form ref="formRef" :model="formData" layout="vertical">
        <a-form-item name="groupCode" :rules="{required:true,message:'请输入分组编号'}" label="分组编号">
            <a-input placeholder="请输入分组编号" :disabled="!!formData.groupCode" v-model:value="formData.groupCode" allow-clear></a-input>
        </a-form-item>
        <a-form-item name="name" :rules="{required:true,message:'请输入分组名称'}"  label="分组名称" >
          <a-input placeholder="请输入分组名称" v-model:value="formData.name" allow-clear></a-input>
        </a-form-item>
        <a-form-item name="description" :rules="{required:true,message:'请输入分组描述'}"  label="分组描述">
          <a-textarea  allow-clear placeholder="请输入分组名称" v-model:value="formData.description" :rows="2"></a-textarea >
        </a-form-item>
      </a-form>
    </a-modal>
  

    <a-card :body-style="{padding: '15px'}" :loading="state.isLoading">
      <a-descriptions :column="3" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>基础信息</a-typography-text>
            <a-button @click="handleShowBaseInfo" type="link">编辑</a-button>
          </a-flex>

        </template>
       
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="渠道组名称">
          
          <a-typography-text>{{info.name}}</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="渠道组编码">{{  info.groupCode ?? '/'  }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="渠道组描述">{{  info.description ?? '/'  }}</a-descriptions-item>
       

      </a-descriptions>
      
    </a-card>
    <a-card :body-style="{padding: '15px'}" :loading="state.isLoading">
      <a-descriptions :column="3" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>渠道</a-typography-text>
          </a-flex>

        </template>
       
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="渠道数量">
          <!-- <a-tooltip>
            <template #title>查看当前渠道组【{{info.name}}】的渠道信息</template>
            <a-typography-link @click="router.replace({path:'/channel/group-info',query:{groupCode:info.groupCode, tabKey: 'channelsInfo'}})">{{info.channelCount}}</a-typography-link>
          </a-tooltip> -->
          <a-typography-text>{{info.channelCount}}</a-typography-text>
        </a-descriptions-item>

      </a-descriptions>
    </a-card>

  </div>
</template>

<style scoped lang="less">

</style>