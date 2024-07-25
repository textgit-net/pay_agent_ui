<script setup lang="ts">
import {
  PlusOutlined
} from "@ant-design/icons-vue";
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps, Row, message} from "ant-design-vue";
import { CreateMediationTaskRequest, CreateMediationTask, editMediationTask, MediationTask, postMediationTaskItem, putMediationTaskItem, MediationTaskItem, MediationTaskSearch, RewardModeType, RewardType, TaskType, changeMediationTaskEnable, getAdTaskList, getRewardModeTypeText, getRewardTypeText, getTaskTypeText, } from "~@/api/mediationTask";
import dayjs from "dayjs";
import { rewriteDefault } from "vue/compiler-sfc";

const labelCol = { style: { width: '120px' } };

const columns:ColumnsType =[
  {
    title: 'ID',
    showSorterTooltip:false,
    dataIndex: 'id',
  },
  {
    title: '任务名称',
    showSorterTooltip:false,
    dataIndex: 'name',
  },

  {
    title:'是否启用',
    showSorterTooltip:false,
    dataIndex: 'isEnable'
  },
  {
    title:'任务项',
    showSorterTooltip:false,
    dataIndex: 'taskItems'
  },
  {
    title:'创建时间',
    showSorterTooltip:false,
    dataIndex: 'createTime'
  },
  {
    title:'操作',
    dataIndex: 'action',
  }
]


const TaskItemColumns:ColumnsType =[
  {
    title: '任务名称',
    showSorterTooltip:false,
    dataIndex: 'name',
  },
  {
    title: '任务图标',
    showSorterTooltip:false,
    dataIndex: 'taskIcon',
  },

  {
    title:'任务类型',
    showSorterTooltip:false,
    dataIndex: 'taskType'
  },
  // {
  //   title:'奖励类型',
  //   showSorterTooltip:false,
  //   dataIndex: 'rewardType'
  // },
  // {
  //   title:'奖励方式',
  //   showSorterTooltip:false,
  //   dataIndex: 'rewardMode'
  // },
  {
    title:'奖励规则',
    showSorterTooltip:false,
    dataIndex: 'rewardRules'
  },

  
  {
    title:'奖励次数',
    showSorterTooltip:false,
    dataIndex: 'rewardCount'
  },
  // {
  //   title:'任务奖励值',
  //   showSorterTooltip:false,
  //   dataIndex: 'rewardNumber'
  // },
  // {
  //   title:'最小奖励值',
  //   showSorterTooltip:false,
  //   dataIndex: 'minRewardNumber'
  // },
  // {
  //   title:'最大奖励值',
  //   showSorterTooltip:false,
  //   dataIndex: 'maxRewardNumber'
  // },
  
  {
    title:'奖励描述',
    showSorterTooltip:true,
    dataIndex: 'rewardDepicted'
  },
  {
    title:'操作',
    dataIndex: 'action',
  }
]

const props = defineProps({
  appId: {
    type: Number,
    required: false,
    default:null
  }
})
const appId = ref(props.appId)


const resetSearchParams=()=>{
  Object.assign(searchForm.value,{
    page:1,
    limit:10,
    unitId: ''
  })
}

const state=reactive({
  isLoading:false,
  isShowTaskItemModal:false,
  isShowCreateModal:false,
  isShowCreateTaskItemModal:false,
  isSaveLoading:false,
  ///是否广告任务编辑
  isTaskEdit: false,
  ///是否广告任务项目编辑
  isTaskItemEdit: false
})
const initMediationTaskItemForm: MediationTaskItem = {
    id: 0,
    name: '',
    taskIcon: '',
    taskType: TaskType.ADV,
    taskInterval: 0,
    isOrderUnlock: false,
    rewardNumber: 0,
    rewardType: RewardType.POINTS,
    rewardCount: 0,
    rewardRules: {
      pointsRatio: 0,
      cashRatio: 0,
      maxRewardAmount: 0,
      rewardRatio: 0,
    },
    rewardMode: RewardModeType.FIXED,
    maxRewardNumber: 0,
    minRewardNumber: 0,
    rewardDepicted: ''

}

const mediationTaskItemList = ref<MediationTaskItem []>([])
const selectMediationTask = ref<MediationTask>(<MediationTask>{})
let mediationTaskItemForm=ref<MediationTaskItem>(<MediationTaskItem>JSON.parse(JSON.stringify(initMediationTaskItemForm)))

const dataSource=shallowRef<MediationTask[]>([])

const pagination = reactive<PaginationProps>({
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30', '40'],
  current: 1,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: total => `总数据位：${total}`,
  onChange(current, pageSize) {
    pagination.pageSize = pageSize
    pagination.current = current
    getData()
  },
})

const searchForm = ref<MediationTaskSearch>(<MediationTaskSearch>{
  appId: String(props?.appId),
  page:1,
  limit:10,
  unitId: ''
})

const initMediationTaskForm:CreateMediationTaskRequest = {appId: String(appId.value)}

let mediationTaskForm = ref<CreateMediationTaskRequest>(<CreateMediationTaskRequest> JSON.parse(JSON.stringify(initMediationTaskForm)))

const getData=async ()=>{
  state.isLoading=true
  let res=await getAdTaskList(searchForm.value)

  dataSource.value=res.data?.rows??[]
  dataSource.value = dataSource.value.map(i => {
    i.enableLoading = false
    return i
  })
  console.log('dataSource.value', dataSource.value)
  pagination.total = res.data?.total ?? 0
  state.isLoading=false
}

/// 任务项编辑
const showTaskItemModal = (item: MediationTask) => {
  selectMediationTask.value = item
  mediationTaskItemList.value = item.taskItems
  
  state.isShowTaskItemModal = true
}

const showCrateModal=()=>{
  state.isTaskEdit = false
  mediationTaskForm.value = JSON.parse(JSON.stringify(initMediationTaskForm))
  mediationTaskForm.value.appId = String(appId.value)
  state.isShowCreateModal=true
}

const editTask = (item: MediationTask) => {
  state.isTaskEdit = true
  mediationTaskForm.value = Object.assign(mediationTaskForm.value, item)
  console.log(mediationTaskForm.value)
  state.isShowCreateModal=true
}


const filterDate = (timer: number | string) => {
   return dayjs(timer).format('YYYY-MM-DD')
} 

const handleClickTaskSwitch = async (record: MediationTask) => {
    record.enableLoading = true
    try {
        let res = await changeMediationTaskEnable(String(record.id))
        record.isEnable = !record.isEnable
        record.enableLoading = false
        dataSource.value= JSON.parse(JSON.stringify(dataSource.value))
        message.success('操作成功')
    } catch (error) {
        message.success('操作失败')
    } finally {
        record.enableLoading = false
    }
}


watch(()=>props.appId,(newValue,oldValue)=>{
  appId.value = newValue
  searchForm.value.appId = String(newValue)
  resetSearchParams()
  getData()
})

onMounted(()=>{
    getData()
})

/// 添加广告任务项
const addMediationTaskItem = () => {
  state.isTaskItemEdit = false
  mediationTaskItemForm.value = JSON.parse(JSON.stringify(initMediationTaskItemForm))
  mediationTaskItemForm.value.taskId = selectMediationTask.value.id
  state.isShowCreateTaskItemModal = true
}

/// 编辑广告任务项
const editMediationTaskItem = (item: MediationTaskItem) => {
  state.isTaskItemEdit = true
  mediationTaskItemForm.value = Object.assign(mediationTaskItemForm.value, item)
  state.isShowCreateTaskItemModal=true
}

const saveMediationTaskForm = async () => {
  state.isSaveLoading = true
  
  try {
    let res:any
    if (state.isTaskEdit) {
      res = await editMediationTask(mediationTaskForm.value)
    } else {
      res = await CreateMediationTask(mediationTaskForm.value)
    }
    message.success('操作成功')
    state.isShowCreateModal = false
    resetSearchParams()
    getData()
  } catch (error) {
      message.success('操作失败')
  } finally {
    state.isSaveLoading = false
  }
}

const confirmMediationTaskForm = () => {
    state.isShowTaskItemModal = false
    resetSearchParams()
    getData()
}

/// 广告任务项保存
const saveMediationTaskItemForm = async () => {
  state.isSaveLoading = true
  try {
      let res = !state.isTaskItemEdit? await postMediationTaskItem(mediationTaskItemForm.value) : await putMediationTaskItem(mediationTaskItemForm.value)
      message.success('操作成功')
      state.isShowCreateTaskItemModal = false
      if (!state.isTaskItemEdit) {
        mediationTaskItemList.value.push(res.data as MediationTaskItem)
      } else {
        mediationTaskItemList.value = mediationTaskItemList.value.map(item => {
          if (item.id == (res.data as MediationTaskItem).id) {
            item = (res.data as MediationTaskItem)
          }
          return item
        })
      }
    } catch (error) {
        message.success('操作失败')
    } finally {      
      state.isSaveLoading = false
    }
}
</script>

<template>
  <a-skeleton :loading="state.isLoading">
        <a-flex :gap="10" align="center" justify="space-between">
            <a-typography-text>广告任务</a-typography-text>
            <a-button @click="showCrateModal" class="ml-2" type="primary"><PlusOutlined/>创建广告任务</a-button>
        </a-flex>
      <a-card class="mt-4">
        <a-table :data-source="dataSource" :pagination="pagination" :loading="state.isLoading" size="small" :columns="columns">
            <template #bodyCell="{ column , record}">
                <template v-if="column.dataIndex=='name'">
                    <span  style="display: block;">{{record.name}}</span>
                </template>
                <template v-if="column.dataIndex=='isEnable'">
                    <a-switch :checked="record.isEnable" :loading="record.enableLoading" @click="handleClickTaskSwitch(record)" checked-children="开" un-checked-children="关" />
                </template>
                <template v-if="column.dataIndex=='taskItems'">
                    <span>
                      共 {{ record.taskItems.length }} 任务项
                    </span>
                    <a-button size="small" type="link" @click="showTaskItemModal(record)">编辑</a-button>
                </template>
                <template v-if="column.dataIndex=='createTime'">
                    <span>
                       {{ filterDate(record.createTime) }}
                    </span>
                </template>
                <template v-if="column.dataIndex=='action'">
                    <a-button @click="editTask(record)" size="small" type="link">编辑任务</a-button>
                </template>
            </template>
        </a-table>
      </a-card>

      <a-modal :width="400" v-model:open="state.isShowCreateModal" centered :closable="false" destroy-on-close :footer="null" :title="null">
        <a-flex vertical :gap="15">
            <a-typography-text strong >新建广告任务</a-typography-text>
            <div style="height: 300px;overflow-y: auto">
                <a-form layout="vertical">
                    <a-flex :gap="10" align="center">
                      <a-form-item name="name"  label="任务名称">
                          <a-input v-model:value="mediationTaskForm.name" placeholder="请添加任务名称" size="middle" style="width: 320px"></a-input>
                      </a-form-item>
                    </a-flex>
                    <a-flex :gap="10" align="center">
                      <a-form-item  name="name" label="是否启用">
                          <a-switch v-model:checked="mediationTaskForm.isEnable" checked-children="开" un-checked-children="关" />
                      </a-form-item>
                    </a-flex>
                </a-form>
            </div>
            <a-flex justify="flex-end" :gap="10">
                <a-button @click="state.isShowCreateModal=false" style="width: 120px" >取消</a-button>
                <a-button :loading="state.isSaveLoading" style="width: 120px" @click="saveMediationTaskForm" type="primary">保存</a-button>
            </a-flex>
        </a-flex>
    </a-modal>

    <a-modal :width="1200" v-model:open="state.isShowTaskItemModal" centered :closable="false" destroy-on-close :footer="null" :title="null">
        <a-flex vertical :gap="15">
            <a-typography-text strong >广告任务项列表</a-typography-text>
            <div style="height: 450px;overflow-y: auto">
                <a-form layout="vertical">
                    <!-- <a-flex :gap="10" align="center">
                      <a-form-item name="name"  label="任务名称">
                          <a-input v-model:value="mediationTaskForm.name" placeholder="请添加任务名称" size="middle" style="width: 400px"></a-input>
                      </a-form-item>
                      <a-form-item  name="name" label="是否启用">
                          <a-switch v-model:checked="mediationTaskForm.isEnable" checked-children="开" un-checked-children="关" />
                      </a-form-item>
                
                    </a-flex> -->
                    <a-flex :gap="10" align="center" justify="flex-end">
                        <a-button style="width: 120px" @click="addMediationTaskItem" type="primary">添加广告任务配置</a-button>
                    </a-flex>
                    <a-card  :bordered="true" :body-style="{padding:'10px 10px'}">
                        <a-table :data-source="mediationTaskItemList" :pagination="false" :loading="state.isLoading" size="small" :columns="TaskItemColumns">
                            <template #bodyCell="{ column , record}">
                                <template v-if="column.dataIndex=='name'">
                                    <span  style="display: block;">{{record.name}}</span>
                                </template>
                                <template v-if="column.dataIndex=='taskIcon'">
                                  <a-image
                                    :width="44"
                                    :src="record.taskIcon"
                                    :preview="{
                                      src: record.taskIcon,
                                    }"
                                  />
                                </template>
                                <template v-if="column.dataIndex=='taskType'">
                                    <span>{{ getTaskTypeText(record.taskType) }}</span>
                                </template>
                                <!-- <template v-if="column.dataIndex=='rewardType'">
                                    <span>{{ getRewardTypeText(record.rewardType) }}</span>
                                </template> -->
                                <!-- <template v-if="column.dataIndex=='rewardMode'">
                                    <span>{{ getRewardModeTypeText(record.rewardMode) }}</span>为：
                                    <span v-if="RewardModeType.FIXED == record.rewardMode" style="font-weight: bolder">{{ record.rewardNumber }}</span>
                                    <span v-if="RewardModeType.RANDOM == record.rewardMode" style="font-weight: bolder">{{ record.minRewardNumber }} ~ {{ record.maxRewardNumber}}</span>
                                </template> -->
                                <template v-if="column.dataIndex=='rewardRules'">
                                    <div>
                                      <div>红包比例(%)：{{ record.rewardRules.cashRatio }}</div>
                                      <div>积分比例(%)：{{ record.rewardRules.pointsRatio }}</div>
                                      <div>奖励比例(%)：{{ record.rewardRules.rewardRatio }}</div>
                                      <div>最大奖励金额(元)：{{ record.rewardRules.maxRewardAmount }}</div>
                                    </div>
                                </template>
                                <template v-if="column.dataIndex=='createTime'">
                                    <span>
                                    {{ filterDate(record.createTime) }}
                                    </span>
                                </template>
                                <template v-if="column.dataIndex=='action'">
                                    <a-button @click="editMediationTaskItem(record)" size="small" type="link">编辑</a-button>
                                </template> 
                            </template>
                        </a-table>
                    </a-card>
                </a-form>
            </div>
            <a-flex justify="flex-end" :gap="10">
                <!-- <a-button @click="state.isShowTaskItemModal=false" style="width: 120px" >取消</a-button> -->
                <a-button style="width: 120px" @click="confirmMediationTaskForm" type="primary">确 认</a-button>
            </a-flex>
        </a-flex>
    </a-modal>

    <a-modal :width="1200" v-model:open="state.isShowCreateTaskItemModal" centered :closable="false" destroy-on-close :footer="null" :title="null">
        <a-flex vertical :gap="15">
            <a-typography-text strong >广告任务项</a-typography-text>
            <div style="height: 450px;overflow-y: auto">
                <a-form layout="vertical">
                    <a-flex :gap="10" align="flex-start" >
                        <a-form-item name="name">
                            <span style="display: inline-block; width: 140px; text-align: right;"> 任务类型： </span>
                            <a-radio-group v-model:value="mediationTaskItemForm.taskType">
                                <a-radio :value="TaskType.ADV">{{ getTaskTypeText(TaskType.ADV) }}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-flex>
                    <!-- <a-flex :gap="10" align="flex-start" >
                        <a-form-item name="rewardType">
                            
                            <span style="display: inline-block; width: 140px; text-align: right;"> 奖励类型：  </span>
                            <a-radio-group v-model:value="mediationTaskItemForm.rewardType">
                                <a-radio :value="RewardType.POINTS">{{ getRewardTypeText(RewardType.POINTS) }}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-flex> -->
                    <a-flex :gap="10" align="center">
                        <a-form-item  name="name">
                            <span style="display: inline-block; width: 140px; text-align: right;">  任务图标： </span>
                            <ImageUpload
                                :style="{width: '60px',height:'60px',display:'flex',justifyContent:'center',alignContent:'center'}"
                                v-model:value="mediationTaskItemForm.taskIcon"
                                class="avatar-uploader">
                                <a-flex style="width: 60px;height: 60px;background-color: rgba(0, 0, 0, 0.02);border: 1px dashed #d9d9d9;" vertical justify="center" align="center">
                                <div class="ant-upload-text" style="font-size: 10px;">48x48px</div>
                                </a-flex>
                            </ImageUpload>
                        </a-form-item>
                     </a-flex>
                    <a-flex :gap="10" align="center">
                        <a-form-item name="name">
                            <span style="display: inline-block; width: 140px; text-align: right;">  任务名称： </span>
                           <a-input v-model:value="mediationTaskItemForm.name" placeholder="请输入任务名称" size="middle" style="width: 300px"></a-input>
                        </a-form-item>
                    </a-flex>
                  <a-flex :gap="10" align="center">
                    <a-form-item name="name">
                      <span style="display: inline-block; width: 140px; text-align: right;">  广告位ID： </span>
                      <a-input v-model:value="mediationTaskItemForm.adUnitId" placeholder="请输入广告位ID" size="middle" style="width: 300px"></a-input>
                    </a-form-item>
                  </a-flex>
                  <a-flex :gap="10" align="center">
                        <!-- <a-form-item name="name">
                            <span style="display: inline-block; width: 140px; text-align: right;">  奖励方式 ：  </span>
                            <a-radio-group v-model:value="mediationTaskItemForm.rewardMode">
                                <a-radio :value="RewardModeType.FIXED">{{ getRewardModeTypeText(RewardModeType.FIXED) }}</a-radio>
                                <a-radio :value="RewardModeType.RANDOM">{{ getRewardModeTypeText(RewardModeType.RANDOM) }}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item name="rewardType">
                        
                          <a-flex align="center" v-if="RewardModeType.FIXED == mediationTaskItemForm.rewardMode">
                            <span style="display: inline-block; width: 140px; text-align: right;">设置固定奖励值 ： </span>
                            <a-input-number v-model:value="mediationTaskItemForm.rewardNumber" :min="0.1" />
                          </a-flex>
                          <a-flex align="center" v-if="RewardModeType.RANDOM == mediationTaskItemForm.rewardMode" >
                            <span style="display: inline-block; width: 140px; text-align: right;">设置随机奖励值 ： </span>
                            最小值<a-input-number v-model:value="mediationTaskItemForm.minRewardNumber" :min="0.1" />
                            最大值<a-input-number v-model:value="mediationTaskItemForm.maxRewardNumber" :min="0.1" />
                          </a-flex>
                          
                        </a-form-item> -->
                        <a-form-item>
                          <span style="display: inline-block; width: 120px; text-align: right;">设置最大奖励值(元)：</span>
                          <a-input-number v-model:value="mediationTaskItemForm.rewardRules.maxRewardAmount" />
                        </a-form-item>
                        <a-form-item>
                          <span style="display: inline-block; width: 120px; text-align: right;">设置奖励波比(%)：</span>
                          <a-input-number v-model:value="mediationTaskItemForm.rewardRules.rewardRatio" />
                        </a-form-item>
                        <a-form-item>
                            <span style="display: inline-block; width: 140px; text-align: right;">设置红包比例(%)：</span>
                            <a-input-number v-model:value="mediationTaskItemForm.rewardRules.cashRatio" />
                        </a-form-item>
                        <a-form-item>
                            <span style="display: inline-block; width: 120px; text-align: right;">设置积分比例(%)：</span>
                            <a-input-number v-model:value="mediationTaskItemForm.rewardRules.pointsRatio" />
                        </a-form-item>

                  </a-flex>
                  <a-flex :gap="10" align="center">
                    <a-form-item name="rewardType">
                      <a-flex align="center">
                        <span style="display: inline-block; width: 140px; text-align: right;">奖励次数 ： </span>
                        <a-input-number v-model:value="mediationTaskItemForm.rewardCount" :min="1" :step="1" />
                      </a-flex>
                    </a-form-item>
                  </a-flex>
                    
                  <a-flex :gap="10" align="center">
                    <a-form-item name="rewardDepicted">
                      <span style="display: inline-block; width: 140px; text-align: right;">  任务奖励描述： </span>
                      <a-input v-model:value="mediationTaskItemForm.rewardDepicted" placeholder="请输入任务奖励描述" size="middle" style="width: 420px"></a-input>
                    </a-form-item>
                  </a-flex>       
                </a-form>
            </div>
            <a-flex justify="flex-end" :gap="10">
                <a-button @click="state.isShowCreateTaskItemModal=false" style="width: 120px" >取消</a-button>
                <a-button :loading="state.isSaveLoading" style="width: 120px" @click="saveMediationTaskItemForm" type="primary">保存</a-button>
            </a-flex>
        </a-flex>
    </a-modal>
  </a-skeleton>
</template>

<style scoped lang="less">

</style>