<script setup lang="ts">
import {SearchOutlined}  from '@ant-design/icons-vue'

import {getMediationSites, MediationSite} from "~/api/mediationSite.ts";
import SiteItem from "~/pages/mediation/components/site-item.vue";
import MediationSiteInfo from "~/pages/mediation/components/mediation-site-info.vue";
import MadiationTaskInfo from "~/pages/mediation/components/mediation-task-info.vue";
import SiteCreateModal from "~/pages/mediation/components/site-create-modal.vue";
const activeKey = ref('1');
const mediationSites=shallowRef<MediationSite[]>([])
let copyMediationSites: MediationSite[] = []

const state=reactive<{
  isFirst:boolean,
  isLoading:boolean,
  isShowCreateModal:boolean,
  currentSite?:MediationSite
}
>({
  isFirst:true,
  isLoading:false,
  isShowCreateModal:false,
  currentSite:null
})

const onItemClick=(item:MediationSite)=>{
  state.currentSite=item
}
const loadMediationSites=async ()=>{
  state.isLoading=true
  const res = await getMediationSites();
  mediationSites.value=res.data||[]
  copyMediationSites = JSON.parse(JSON.stringify(mediationSites.value))
  if(state.currentSite==null){
    state.currentSite=mediationSites.value[0]
  }
  state.isLoading=false
  if(state.isFirst){
    state.isFirst=false
  }
}


const handleSearchApplication=(e:InputEvent)=>{
  let newArr: MediationSite[] = []
  if (e.target.value != '') {
    let reg = new RegExp(e.target.value, 'g');  
    copyMediationSites.map((item: MediationSite) => {
      if (reg.test(item.name)) {
        newArr.push(item)
      }
    })
    newArr = newArr.map((item: MediationSite) => {
      item.applicationInfo.regText = highLightKeywords(item.applicationInfo.name, e.target.value)
      return item
    })
    mediationSites.value = newArr

  } else {
    mediationSites.value = copyMediationSites
  }
}

/**
 * 匹配整个关键词 不拆分
 * @param {Object} text 内容
 * @param {Object} keyword 关键词
 * @param {Object} tag 被包裹的标签
 */
function highLightKeywords(text:string, keyword:string, tag:string|null|undefined = null): string {
  // 默认的标签，如果没有指定，使用span
  tag = tag || 'span';

  // 匹配每一个特殊字符 ，进行转义
  let specialStr = ["*", ".", "?", "+", "$", "^", "[", "]", "{", "}", "|", "\\", "(", ")", "/", "%"];
  specialStr.map((item, index) => {
    if(keyword.indexOf(item) != -1) {
      keyword = keyword.replace(new RegExp("\\" + item, 'g'), "\\" + item);
    }
  })

  // 匹配整个关键词
  let reg = new RegExp(keyword, 'g');
  if(reg.test(text)) {
    text = text.replace(reg, '<' + tag + ' class="highlight">' + text + '</' + tag + '>');
    console.log(text.replace(reg, '<' + tag + ' class="highlight">' + text + '</' + tag + '>'))
  }
  return text
}

onMounted(()=>{
  loadMediationSites()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card >
      <a-flex justify="space-between">
        <a-typography-text>应用管理</a-typography-text>
        <a-input size="middle" style="width: 250px" placeholder="全局搜索"></a-input>
      </a-flex>
    </a-card>
    <a-flex style="flex: 1" :gap="10">
      <!--左侧应用列表-->
      <a-card style="height: 100%" :body-style="{padding:'10px 15px',height:'100%'}">
          <a-flex vertical style="height: 100%" :gap="10">
            <a-tabs centered v-model:activeKey="activeKey" style="height: 100%" >
              <a-tab-pane key="1" tab="全部应用" style="height: 100%;">
                <a-skeleton :loading="state.isLoading">
                  <a-flex vertical :gap="10">
                    <a-input @change="handleSearchApplication"  style="height: 28px" allow-clear placeholder="请输入应用名称/ID搜索">
                      <template #prefix><SearchOutlined /></template>
                    </a-input>
                    <div style="overflow-y: auto;height: calc(100vh - 340px)">
                      <SiteItem :is-select="item.id==state.currentSite?.id"  @on-item-click="onItemClick" :value="item" v-for="(item) in mediationSites" :key="item.id" v-if="mediationSites.length>0"/>
                      <a-empty v-else/>
                    </div>
                  </a-flex>
                </a-skeleton>

              </a-tab-pane>
              <a-tab-pane key="2" tab="智能管家应用">
                <a-flex vertical :gap="10">
                  <a-input  style="height: 28px" allow-clear placeholder="请输入应用名称/ID搜索">
                    <template #prefix><SearchOutlined /></template>
                  </a-input>
                  <a-empty/>
                </a-flex>
              </a-tab-pane>
            </a-tabs>
            <a-button @click="state.isShowCreateModal=true">添加应用</a-button>
          </a-flex>
      </a-card>
      <!--右侧内容-->
      <div  style="flex: 1; height: calc(100vh - 160px); overflow-y: auto;-webkit-scrollbar:">
        <a-skeleton :loading="state.isLoading">
          <MediationSiteInfo  :app-id="state.currentSite?.id" v-if="mediationSites.length>0"/>
          <a-flex style="height: 100%" vertical v-else align="center" justify="center" >
            <a-empty/>
            <a-button type="primary" style="width: 100px" @click="state.isShowCreateModal=true">添加应用</a-button>
          </a-flex>
        </a-skeleton>
        <a-skeleton :loading="state.isLoading">
          <div style="margin-top:30px">
            <MadiationTaskInfo :app-id="state.currentSite?.applicationInfo?.id" v-if="mediationSites.length>0"/>
          </div>
        </a-skeleton>
      </div>
    </a-flex>

    <a-modal wrap-class-name="no-padding" destroy-on-close :footer="null" v-model:open="state.isShowCreateModal" :width="800" centered title="添加应用">
        <SiteCreateModal/>
    </a-modal>
  </a-flex>

</template>

<style scoped lang="less">


</style>