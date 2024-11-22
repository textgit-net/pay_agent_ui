<script setup lang="ts">

import { reactive} from 'vue';
import { createVNode } from 'vue';
import { cloneDeep } from 'lodash-es';
import type { Rule } from 'ant-design-vue/es/form';
import { Modal, message, Empty } from 'ant-design-vue';
import {QuestionCircleFilled,ExclamationCircleOutlined } from "@ant-design/icons-vue"

import type { SubscribeEventItem, SubscribeEventItemWrap, ChannelEventSubscribeResponse, ChannelEventSubscribeRequest,ChannelSubscribeBootRequest,BootGroupCheckResponse } from '~/api/system/bot'
import { 
    getChannelSubscribeInfo,
    postChannelEventSubscribe,
    postChannelEventUnSubscribe,
    switchChannelEventSubscribe,
    getChannelSubscribeCode,
    getChannelSubscribeBoot,
    getChannelSubscribeBootGroupCheck
} from '~/api/system/bot'

import { calcFloat } from '~/utils/calcFloat'

const state = reactive<{
    showSettingBotDialog: boolean;
    dialogBtnLoading: boolean;
    isLoading:boolean;
    
}>({
    showSettingBotDialog: false,
    dialogBtnLoading: false,
    isLoading: false,
})
const formRef = ref();


const ininForm = ():ChannelEventSubscribeResponse => {
    return {
    }
}
const formData=ref<ChannelEventSubscribeResponse>(ininForm())
const info = ref<ChannelEventSubscribeResponse>({})
const subscribeEvents = ref<SubscribeEventItemWrap[]>([])

const getInfo = async (isShowLoad:boolean = true)=>{
    if (isShowLoad) {
        state.isLoading=true
    }
  
  const {data} =await getChannelSubscribeInfo()
  info.value = data
  subscribeEvents.value = filterSubscribeEventsData(data.subscribeEvents)
  formData.value = JSON.parse(JSON.stringify(data))
  state.isLoading=false
}

const filterSubscribeEventsData = (data: SubscribeEventItemWrap[]) => {
    data = data.map(i => {
        let isSubItemslen = i.items.length
        let isCheckSubItemsLen = i.items.filter(i => i.isEnable).length
        i.indeterminate = false
        i.checkAll = false
        i.checkList = []
        i.items.map(subItem => {
            if (subItem.isEnable) {
                i.checkList.push(subItem.value)
            }
        })
        if (isSubItemslen == isCheckSubItemsLen) {
            i.checkAll = true
        } else if (isCheckSubItemsLen < isSubItemslen && isCheckSubItemsLen > 0) {
            i.indeterminate = true
        }
        return i
    })
    return data
}

const handleShowConfig = async () => {
    state.showSettingBotDialog = true
   
    await fetchChannelSubscribeCode()
    startTimerCheck()
}

const handleStepOk = async () => {
    state.dialogBtnLoading = true
    try {
        let request:ChannelSubscribeBootRequest = {
            subscribeCode: channelSubscribeCode.value
        }
        let res = await getChannelSubscribeBoot(request)
        state.showSettingBotDialog = false
        message.success('验证成功')
        getInfo()
    } catch (error) {
        
    } finally {
        state.dialogBtnLoading = false
    }
}
const changeStatus = async () => {
    try {
        await switchChannelEventSubscribe()
        message.success('操作成功')
        getInfo()
    } catch (error) {
        
    }
}
const channelSubscribeCode = ref(null)
const fetchChannelSubscribeCode = async () => {
    channelSubscribeCode.value =null
    let res = await getChannelSubscribeCode()
    channelSubscribeCode.value=res.data
}

const checkJoinGroup = async () => {
    try {
        let res = await getChannelSubscribeBootGroupCheck(channelSubscribeCode.value)
        isJoinGroupOk.value = res.data
        if (isJoinGroupOk.value) {
            resetCheck()
        }
    } catch (error) {
        
    }
    
}

let timer = null
const isJoinGroupOk = ref<BootGroupCheckResponse>(null)
const startTimerCheck = async () => {
    clearInterval(timer)
    timer = setInterval(() => {
        checkJoinGroup()
    }, 3000)
}
const resetCheck = () => {
    clearInterval(timer)
    timer = null;
   
}


const cancelSetttingBot = () => {
    // formData.value.isEnableEventSubscribe = false
    state.showSettingBotDialog = false
}

const handleCloseDialog = () => {
    resetCheck()
    isJoinGroupOk.value = null
}


onMounted(async ()=>{
    await getInfo()
})

const onCheckAllEventsChange = (i:SubscribeEventItemWrap, index: number) => {
    let wrapItems = cloneDeep(subscribeEvents.value[index])
    wrapItems.checkAll == !wrapItems.checkAll
    let checkList = []
    wrapItems.items.map(i => {
        checkList.push(i.value)
    })
    if (wrapItems.checkAll) {
        fetchChannelEventSubscribe(checkList)
    } else {
        fetchChannelEventUnSubscribe(checkList)
    }
}


const fetchChannelEventSubscribe = async (events: string[]) => {
    try {
        let res = await postChannelEventSubscribe(events)
        message.success('操作成功')
        getInfo(false)
    } catch (error) {

    }
   
}
const fetchChannelEventUnSubscribe = async (events: string[]) => {
    try {
        let res = await postChannelEventUnSubscribe(events)
        message.success('操作成功')
        getInfo(false)
    } catch (error) {

    }
   
}
const onCheckEventsChange = (i:SubscribeEventItem, index: number) => {
   console.log('i.isEnable', i.isEnable)
   if (i.isEnable) {
    fetchChannelEventUnSubscribe([i.value])
   } else {
    fetchChannelEventSubscribe([i.value])
   }
}

</script>

<template>
  <div>

    <a-modal v-model:open="state.showSettingBotDialog" title="Telegram群组机器人配置" @cancel="handleCloseDialog" :footer="null" :maskClosable="false" style="width: 580px;">
      <a-card :body-style="{padding: '45px', paddingBottom: '0px'}">


        <a-timeline>
        
            <a-timeline-item color="green">
                <template #dot>1</template>
                <a-flex vertical>
                    <a-typography-text>将机器人添加到群聊</a-typography-text>
                    <a-space>
                        <a-typography-text  type="secondary">{{info.telegramBootName}}</a-typography-text>
                        <copy-text-btn :copytext="info.telegramBootName" tipText="复制机器人账号"></copy-text-btn>
                    </a-space>
                </a-flex>
            </a-timeline-item>
            <a-timeline-item color="green">
                <template #dot>2</template>
                <a-flex vertical>
                    <a-typography-text >将下面的验证码发送到群组</a-typography-text>
                    <!-- <a-space>
                        <a-typography-text type="secondary">{{channelSubscribeCode}}</a-typography-text>
                        <copy-text-btn v-if="channelSubscribeCode" :copytext="channelSubscribeCode" tipText="复制验证码"></copy-text-btn>
                    </a-space> -->

                    <a-space>
                        <a-typography-text type="secondary">TG指令：/sub {{channelSubscribeCode}}</a-typography-text>
                        <copy-text-btn v-if="channelSubscribeCode" :copytext="`/sub ${channelSubscribeCode}`" tipText="复制TG指令"></copy-text-btn>
                    </a-space>
                </a-flex>
            </a-timeline-item>
            <a-timeline-item color="green">
                <template #dot>3</template>
                <a-button v-if="!isJoinGroupOk" type="dashed" :loading="true" >请先将机器人添加入群组并发送TG指令进行验证</a-button>
                <a-typography-text v-else type="secondary">群组：{{isJoinGroupOk.groupName}}</a-typography-text>
            </a-timeline-item>

            <a-timeline-item v-if="isJoinGroupOk" color="green">
                <template #dot>4</template>
                <a-button v-if="isJoinGroupOk" type="primary" :loading="state.dialogBtnLoading" @click="handleStepOk">提交校验</a-button>
            </a-timeline-item>
        </a-timeline>
      </a-card>
    
    </a-modal>

    <a-flex vertical :gap="10">
        <a-card :body-style="{padding: '15px',}" :loading="state.isLoading">
        <a-descriptions layout="vertical" :column="4">
            <template #title>
            <a-flex  align="center">
                <a-typography-text>开启机器人订阅事件</a-typography-text>
            </a-flex>
            </template>
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="">
            <a-checkbox v-model:checked="formData.isEnableBot" @change="changeStatus">启用订阅</a-checkbox>
            </a-descriptions-item>
        </a-descriptions>
        </a-card>
        <a-card v-show="info.isEnableBot" :body-style="{padding: '15px'}" :loading="state.isLoading">


        <a-descriptions :column="4" layout="vertical">
            <template #title>
            <a-flex  align="center">
                <a-typography-text>Telegram群组机器人配置</a-typography-text>
                <a-button v-if="info.telegramGroupId" @click="handleShowConfig" type="link">更换群组Boot</a-button>
                <a-button v-else @click="handleShowConfig" type="link">添加群组Boot</a-button>
            </a-flex>

            </template>
            <a-descriptions-item style="padding-bottom: 4px;" :labelStyle="{'color':'#999'}" label="机器人">
                <a-typography-text>{{ info.telegramBootName }}</a-typography-text>
                <copy-text-btn v-if="info.telegramBootName" :copytext="info.telegramBootName" tipText="复制机器人账号"></copy-text-btn>
            </a-descriptions-item>
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"label="群组ID">
            
            
            
                <a-flex justify="space-start" align="center" :gap="5" >
                    <a-typography-text>{{ info.telegramGroupId ? info.telegramGroupId: '/' }}</a-typography-text>
                    <copy-text-btn v-if="info.telegramGroupId" :copytext="info.telegramGroupId" tipText="复制群组ID"></copy-text-btn>
                </a-flex>
            </a-descriptions-item>
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"label="群组名称">
            
            
            
                <a-flex justify="space-start" align="center" :gap="5" >
                    <a-typography-text>{{ info.telegramGroupName ? info.telegramGroupName: '/' }}</a-typography-text>
                </a-flex>
            </a-descriptions-item>
        </a-descriptions>
        </a-card>

        <a-flex v-if="info.isEnableBot && info.telegramGroupId" vertical :gap="0">
            
            <a-card title="订阅渠道事件"></a-card>
            <a-card v-for="(i, index) in subscribeEvents" :body-style="{padding: '15px'}" :loading="state.isLoading">
                <a-descriptions :column="4" layout="vertical">
                    <template #title>
                        <a-flex  align="center">
                        <a-typography-text>{{ i.groupName }}</a-typography-text>
                        <!-- <a-button @click="handleShowConfig" type="link">编辑</a-button> -->
                        </a-flex>
                    </template>
                </a-descriptions>
                <div style="padding-bottom: 14px;">
                    <a-checkbox
                        v-model:checked="i.checkAll"
                        :indeterminate="i.indeterminate"
                        @change="onCheckAllEventsChange(i, index)"
                    >
                        一键订阅
                    </a-checkbox>
                </div>
               
                <a-checkbox-group v-model:value="i.checkList">
                    <a-checkbox v-for="(subItem, subIndex) in i.items" :value="subItem.value" @change="onCheckEventsChange(subItem, subIndex)">{{ subItem.desc }}</a-checkbox>
                </a-checkbox-group>
            </a-card>
        </a-flex>
       

    </a-flex>
  </div>
</template>

<style scoped lang="less">

</style>