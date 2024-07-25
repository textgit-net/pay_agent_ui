<script setup lang="ts">
import {
  AndroidFilled,
  AppleFilled, ArrowLeftOutlined,
  InboxOutlined,
  LinkOutlined,
  MobileTwoTone,
  QuestionCircleOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'
import {  gamePlatformTypeSelectOption } from "~/utils/constant.ts";
import {GameTaskFormData, GameTaskResponse, getGameTaskById, saveGameTask} from "~/api/task/gameTask.ts";

const message=useMessage()
const messageKey="saveMessageKey"
const router=useRouter()
const state=reactive({
  isLoad:false
})
const formRef=ref()
const formData=reactive<GameTaskFormData>(<GameTaskFormData>{})
const doSave=async ()=>{
  message.loading({content:"loading...",key:messageKey,duration:0})
  try {
    await saveGameTask(unref(formData))
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

onMounted(()=>{

  const id= router.currentRoute.value.query["id"]
  if(id){
     getGameTaskById(Number.parseInt(id+"")).then(value=>{
        let task=value.data
        formData.platform=task.platformInfo.id
        formData.name=task.name
        formData.remark=task.remark
        formData.reward=task.reward
        formData.userReward=task.userReward
        formData.outTaskId=task.outTaskId
        formData.icon=task.icon
        formData.id=task.id
     })
  }

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
        <a-form ref="formRef" layout="vertical" :model="formData" >
          <!--基础信息Start-->
          <a-card  >
            <a-typography-text strong>1.基础信息</a-typography-text>
            <a-form-item label="渠道方" name="platform" class="mt-5" :rules="[{required:true,message:'请选择需推广的合作渠道',trigger:'blur'}]">
              <a-flex style="flex: 1" vertical>
                <a-select v-model:value="formData.platform" placeholder="请输入应用名称" >
                  <a-select-option v-for="(item) in gamePlatformTypeSelectOption" :value="item.value" >{{item.title}}</a-select-option>
                </a-select>
                <a-typography-text type="secondary">不同渠道,需要的资质有所不同,广告收益也有影响</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="推广号" name="outTaskId" class="mt-5" :rules="[{required:true,message:'请输入推广号',trigger:'blur'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.outTaskId" placeholder="请输入推广号" />
                <a-typography-text type="secondary">推广号是每个合作方渠道独立的任务标识号</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="任务名称" name="name" class="mt-5" :rules="[{required:true,message:'请输入任务名称',trigger:'blur'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.name" placeholder="请输入任务名称" />
                <a-typography-text type="secondary">用于显示在app前端</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="任务描述" name="remark" class="mt-5" :rules="[{required:true,message:'请输入任务描述',trigger:'blur'}]">
              <a-flex style="flex: 1" vertical>
                <a-input v-model:value="formData.remark" placeholder="请输入任务描述" />
                <a-typography-text type="secondary">用于显示在app前端</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="任务图标" class="mt-5" name="icon" >
              <a-flex style="flex: 1" vertical>
                <SingFileUpload
                    v-model:value="formData.icon"
                    upload-path="/images/game/task"
                    :show-upload-list="true">
                  <a-button>
                    <UploadOutlined/>
                    upload
                  </a-button>
                </SingFileUpload>
                <a-typography-text type="secondary">任务图标，手动上传最大支持1024*1024、1M以内的1:1的jpg/png格式文件</a-typography-text>
              </a-flex>
            </a-form-item>
          </a-card>
          <!--基础信息End-->
          <!--佣金设置Start-->
          <a-card  >
            <a-typography-text strong>2.佣金设置</a-typography-text>
            <a-form-item label="推广费" name="reward" class="mt-5" :rules="[{required:true,message:'请输入合作方推广费',trigger:'blur'}]">
              <a-flex style="flex: 1" vertical>
                <a-input-number style="width: 100%" v-model:value="formData.reward" placeholder="请输入合作方推广费" :min="1" :step="1"/>
                <a-typography-text type="secondary">推广费,该任务在合作方投入的费,当下仅用于展示无其它意义</a-typography-text>
              </a-flex>
            </a-form-item>
            <a-form-item label="用户佣金" name="userReward" class="mt-5" :rules="[{required:true,message:'请输入用户佣金',trigger:'blur'}]">
              <a-flex style="flex: 1" vertical>
                <a-input-number  style="width: 100%" v-model:value="formData.userReward" placeholder="请输入用户佣金" :min="1" :step="1"/>
                <a-typography-text type="secondary">用户佣金,用户完成整个任务所能领取到的佣金</a-typography-text>
              </a-flex>
            </a-form-item>
          </a-card>
          <!--佣金设置End-->
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

</style>