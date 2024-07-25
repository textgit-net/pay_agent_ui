<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import { DeleteOutlined,MoreOutlined, SearchOutlined,PlusOutlined} from '@ant-design/icons-vue'
import useClipboard from 'vue-clipboard3'
import {PaginationProps} from "ant-design-vue";
import { 
  getSeedList,
  seedListItem,
  seedListSearch,
  deleteSeedArticle,
  getContentTypeEnumText, 
  getPostTypeEnumText,
  ZhongCaoStatusEnum,
  ContentTypeEnum,
  getZhongCaoStatusEnumText
} from "~/api/seed/seed.ts";
import { log } from "console";
const message = useMessage()
const router = useRouter()
interface SeedListState {
  tableLoad: boolean;
  isShowEditModal: boolean;
  isSaveLoading: boolean;
}

// 跳转页面 --- 使用上传文件组件


const columns:ColumnsType = [
  {
    title: '文章标题',
    dataIndex: 'title',
    // width:'200px',
    fixed: 'left',
  },

  {
    title:'文章主图',
    dataIndex: 'picture',
  },
  {
    title:'文章类型',
    dataIndex: 'postType',
  },
  {
    title:'内容类型',
    dataIndex: 'contentType',
  },
  {
    title:'内容',
    dataIndex: 'content',
  },
 
  {
    title:'H5链接',
    dataIndex: 'h5Url',
  },
 
  {
    title:'视频链接',
    dataIndex: 'videoUrl',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    width:'140px',
    title:"操作",
    fixed: 'right',
    dataIndex: 'action',
  },
]

const initSearchForm = ():Partial<seedListSearch> => {
  return {
    page: 1,
    limit: 10,
    title: ""
  }
}

const seedSearch=ref<Partial<seedListSearch>>(initSearchForm())
const dataSource = shallowRef<seedListItem[]>([])
const loadData= async () => {
    if (state.tableLoad)
      return
    state.tableLoad = true
    try {
      const {data}  = await getSeedList({
        ...seedSearch,
        page: pagination.current,
        limit: pagination.pageSize,
        
      })
      dataSource.value = data?.rows ?? []
      pagination.total = data?.total ?? 0
    }
    catch (e) {
      console.log(e)
    }
    finally {
      state.tableLoad = false
    }
  }
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
    loadData()
  },
})



const state = reactive<SeedListState>({
  tableLoad:false,
  isShowEditModal:false,
  isSaveLoading:false,
})


const deletePage = async (id: number) => {
  try {
    await deleteSeedArticle(id)
    message.success('操作成功')
    resetSeach()
  } catch (error) {

  }
}


const doSearch = async () => {
  try{
      const {data} =await getSeedList({
      ...seedSearch.value,
      page: pagination.current,
      limit: pagination.pageSize,
    })
    
    
    dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
  }
  catch (e) {
    console.log(e)
  }
  finally {
    state.tableLoad = false
  }
}

const resetSeach = () => {
  seedSearch.value = initSearchForm()
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<template>
<PageContainer>


  <a-flex vertical :gap="15">
    <a-card>
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="8">
            <a-input v-model:value="seedSearch.title" placeholder="请输入标题" >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
    

        </a-row>
        <a-flex justify="flex-end" :gap="0">
          <a-button type="link" @click="resetSeach">重置筛选</a-button>
          <a-button size="middle" @click="doSearch()" type="primary" style="width: 80px">筛选</a-button>
        </a-flex>
      </a-flex>
    </a-card>

    <a-card :body-style="{'padding':'0px'}">
      <!-- 表头插槽 -->
      <template #title>
        <!-- <RouterLink :to="{path:'/application/add'}"><PlusOutlined/>创建应用</RouterLink> -->
        <a-button @click="router.push({path:'/seed/from'})" ><PlusOutlined/>创建文章</a-button>
        <!-- showmodal -->
      </template>
  
      <a-table :scroll="{ x: 'max-content' }" :columns="columns" :loading="state.tableLoad" :pagination="pagination" :data-source="dataSource" size="middle" :bordered="false">
        <!-- 每行数据 -->
        <template #bodyCell="{ column , record}">
          <!-- 操作列 下拉菜单 start -->
          <template v-if="column.dataIndex==='action'">
            <a-flex :gap="5">
              <!-- <a-button size="small" type="link" @click="editSeedPage(record.id)">编辑</a-button> -->
              <a-button size="small" type="link" @click="router.push({path:'/seed/from', query:{id:record.id}})">编辑</a-button>
              <a-popconfirm title="确认删除当前文章吗？" @confirm="(_:Event) => deletePage(record.id)">
                <template #icon><question-circle-outlined style="color: red" /></template>
                <a href="#" style="color:red;"><DeleteOutlined/> 删除</a>
              </a-popconfirm>
            </a-flex>
          </template>
          <!-- 操作列 下拉菜单 end -->
          <!-- 图标名称id 完成 -->
          <template v-if="column.dataIndex==='categryName'">
              <a-flex :gap="5">
              <!-- <a-avatar shape="square" :src="record.applyLogo" size="large"></a-avatar> -->
              <a-flex :gap="0" vertical>
                    <a-typography-text strong>{{record.categoryName}}</a-typography-text>
              <a-typography-text type="secondary">{{record.id}}</a-typography-text>
                </a-flex>
              </a-flex>
          </template>
          <template v-if="column.dataIndex==='content'">
            <a-button v-if="record.contentType == ContentTypeEnum.textarea" size="small" type="link" @click="router.push({path:'/seed/from', query:{id:record.id}})">查看</a-button>
            <a-typography-text v-else strong>-</a-typography-text>
          </template>
          <template v-if="column.dataIndex==='h5Url'">
            <a-typography-text strong>{{ record.contentType == ContentTypeEnum.H5 ? record.h5Url : '-' }}</a-typography-text>
          </template>
          <template v-if="column.dataIndex==='videoUrl'">
            <a-typography-text strong>{{ record.contentType == ContentTypeEnum.video ? record.vedioUrl : '-' }}</a-typography-text>
          </template>
          <template v-if="column.dataIndex==='contentType'">
            <a-typography-text strong>{{getContentTypeEnumText(record.contentType)}}</a-typography-text>
          </template>
          <template v-if="column.dataIndex==='postType'">
            <a-typography-text strong>{{getPostTypeEnumText(record.postType)}}</a-typography-text>
          </template>
          <template v-if="column.dataIndex==='picture'">
            <a-image
              :width="69"
              :src="record.picture"
            />
          </template>
          <template v-if="column.dataIndex==='status'">
            <a-typography-text strong>{{getZhongCaoStatusEnumText(record.status)}}</a-typography-text>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-flex>
</PageContainer>
</template>

<style scoped lang="less">

</style>