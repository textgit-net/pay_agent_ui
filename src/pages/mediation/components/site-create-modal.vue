<script setup lang="ts">
import {AndroidOutlined, AppleOutlined, SearchOutlined} from '@ant-design/icons-vue'
import ApplicationTransferItem from "~/pages/application/components/application-transfer-item.vue";
import {ClientPlatform} from "~/utils/constant.ts";
import {Application, getUsableApps} from "~/api/application.ts";
import {createAdApplication, CreateAdAppRequest} from "~/api/mediationSite.ts";

const router=useRouter()
const emits = defineEmits(["ok","onCancel"])
const message=useMessage()
let allApplications:Application[]= [];

const applications=shallowRef<Application[]>([])

const selectApplications=shallowRef<Application[]>([])

const getApplication=async ()=>{
  let res=await getUsableApps()
  allApplications=res.data||[]
  applications.value=allApplications
}
const  onDelItem=(app:Application)=>{
  selectApplications.value=unref(selectApplications).filter(v => v.id !== app.id)
  applications.value=allApplications.filter(v=>selectApplications.value.findIndex(item=>item.id==v.id)<0)
}
const  onSelectItem=(app:Application)=>{
  let old=JSON.parse(JSON.stringify(selectApplications.value))
  old.push(app)
  selectApplications.value=old
  applications.value=applications.value.filter(v=>v.id!=app.id)
}

const fromData=reactive<CreateAdAppRequest>({
  clientPlatforms:[]
})
const onSave=async ()=>{
  fromData.appIds=selectApplications.value.map(v=>v.id).toString()
  let res=await createAdApplication(fromData)
  if(res.code==200){
    message.success("操作成功")
    emits("ok")
  }else{
    message.error(res.msg)
  }
}
onMounted(()=>{
  getApplication()
})
</script>

<template>
<a-flex vertical style="height: 550px;width: 100%">
  <div style="padding: 0 24px">
    <a-typography-text type="secondary">首页使用需要添加应用，下列为你已创建的应用，或 <a-button type="link" @click="router.push({path:'/application/manage/add'})">点击添加新应用</a-button></a-typography-text>
  </div>
  <a-divider style="margin: 0"/>
  <a-flex style="flex: 1;width: 100%;" >
    <a-flex style="flex: 1; padding: 15px;" vertical >
      <a-flex :gap="10" align="center" justify="center">
        <a-input  allow-clear style="flex: 1;height: 28px" placeholder="请输入应用名称ID搜索">
          <template #prefix>
            <SearchOutlined style="color: #c1c1c1"/>
          </template>
        </a-input>
        <a type="link">全选</a>
      </a-flex>
      <div style="height: 400px;overflow-y: auto;">
        <ApplicationTransferItem @onSelect="onSelectItem" :value="item" v-for="(item) in applications"/>
      </div>

    </a-flex>
    <a-divider type="vertical" style="height: 100%"/>
    <a-flex style="flex: 1;padding: 15px" vertical>
      <a-flex justify="space-between" align="center" style="height: 28px">
        <span style="color:#333;">已选</span>
        <a >清空全部</a>
      </a-flex>
      <div style="height: 400px;overflow-y: auto;">
        <ApplicationTransferItem @onDel="onDelItem" :is-select-style="true" :value="item"  v-for="(item) in selectApplications"/>
      </div>
    </a-flex>
  </a-flex>
  <a-divider style="margin: 0"/>
  <a-flex justify="space-between" :gap="15" style="padding:15px 24px">
    <a-space>
      <span>应用平台:</span>
      <a-checkbox-group v-model:value="fromData.clientPlatforms">
        <a-checkbox :value="ClientPlatform.ANDROID"><AndroidOutlined/> Android </a-checkbox>
        <a-checkbox :value="ClientPlatform.IOS"><AppleOutlined/> IOS </a-checkbox>
      </a-checkbox-group>
    </a-space>
    <a-flex :gap="15">
      <a-button style="width: 100px" @click="emits('onCancel')">取消</a-button>
      <a-button style="width:100px" @click="onSave" :disabled="selectApplications.length==0 || fromData.clientPlatforms.length==0"  type="primary">创建</a-button>
    </a-flex>
  </a-flex>
</a-flex>
</template>

<style scoped lang="less">

</style>