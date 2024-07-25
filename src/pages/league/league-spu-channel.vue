<script setup lang="ts">
import {MoreOutlined,DownOutlined, FireFilled, PlusOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {ColumnsType} from "ant-design-vue/es/table";
import {
  EditeLeagueSpuChannelRequest, getLeagueSpuChannels, getLeagueSpuChannelText,
  LeagueSpuChannelSelectOption,
  saveLeagueSpuChannel
} from "~/api/league/leagueSpu.ts";
const message=useMessage();
const columns:ColumnsType =[
  {
    title: '供应链名称',
    dataIndex: 'name',
    fixed:'left',
    width:"250px",
  },
  {
    title: '销量',
    dataIndex: 'saleCount',
  },
  {
    title: '状态',
    dataIndex: 'isEnable',
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
  },
  {
    title:'操作',
    fixed:'right',
    width:"180px",
    dataIndex: 'action',
  },
]
const dataSource=shallowRef<any[]>([])
const formData=shallowRef<EditeLeagueSpuChannelRequest>({
  channelConfig:{
    password:''
  }
})
const state=reactive({
  dataSourceLoading:false,
  selectRow:null,
  saveLoading:false,
  isShowEditModal:false,
})
const onOpenEditModal=(row:any)=>{
    formData.value={channelConfig:{password:''}}
    state.isShowEditModal=true
}
const doSaveChannel=async()=>{
  state.saveLoading=true
  try {
    await saveLeagueSpuChannel(unref(formData))
    message.success("添加成功");
    await loadData()
    state.isShowEditModal=false
  }finally {
    state.saveLoading=false
  }
}
const loadData=async ()=>{
  state.dataSourceLoading=true
  const result= await getLeagueSpuChannels()
  dataSource.value=result?.data??[]
  state.dataSourceLoading=false
}
onMounted(()=>{
  loadData()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>供应链渠道管理</a-typography-text>
      </a-flex>
    </a-card>
    <a-card :body-style="{'padding':'0px'}">
      <template #title>
        <a-button size="middle"  @click="onOpenEditModal(null)" type="primary"><PlusOutlined/>添加供应链渠道</a-button>
      </template>
      <a-table :scroll="{x: 'max-content'}"  ref="tableRef" :data-source="dataSource" :pagination="false" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
          <a-button size="middle"  @click="onOpenEditModal(null)" type="primary"><PlusOutlined/>添加供应链渠道</a-button>
        </template>
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex==='action'">
            <a>删除</a>
          </template>
          <template v-if="column.dataIndex==='saleCount'">
            <span>-</span>
          </template>
          <template v-if="column.dataIndex==='name'">
            <span>{{getLeagueSpuChannelText(record.channelType)}}</span>
          </template>
          <template v-if="column.dataIndex==='isEnable'">
            <a-switch :checked-value="true"
                      :un-checked-value="false"
                      :checked="record.isEnable"
                      checked-children="启用"
                      un-checked-children="禁用" />
          </template>

        </template>
      </a-table>
    </a-card>
    <a-modal width="450px" :confirm-loading="state.saveLoading" @ok="doSaveChannel" v-model:open="state.isShowEditModal" centered :title="state.selectRow==null?'添加供应链渠道':'编辑供应链渠道'" :closable="false">
      <a-form layout="vertical" :model="formData">
        <a-form-item label="渠道商" :rules="[{required:true,message:'请选择渠道商'}]" name="channelType">
          <a-select placeholder="请选择供应链渠道商" v-model:value="formData.channelType" style="width:100%">
            <a-select-option v-for="(item) in LeagueSpuChannelSelectOption" :value="item.value" >{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="登录账号" :rules="[{required:true,message:'请输入待发兔登录账号'}]" name="channelConfig">
          <a-input placeholder="请输入待发兔登录账号" v-model:value="formData.channelConfig.userName" style="width:100%"></a-input>
        </a-form-item>
        <a-form-item label="登录密码" :rules="[{required:true,message:'请输入待发兔登录密码'}]" name="channelConfig">
          <a-input placeholder="请输入待发兔登录密码" v-model:value="formData.channelConfig.password" style="width:100%"></a-input>
        </a-form-item>
        <a-form-item label="是否启用"  name="isEnable" required>
          <a-radio-group v-model:value="formData.isEnable" >
            <a-radio :value="true">启用</a-radio>
            <a-radio :value="false">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-flex>
</template>

<style scoped lang="less">

</style>