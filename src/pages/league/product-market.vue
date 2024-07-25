<script setup lang="ts">
import {ArrowLeftOutlined, ShoppingCartOutlined,DeleteOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {LeagueSpuChannel, LeagueSpuChannelSelectOption} from "~/api/league/leagueSpu.ts";
const router=useRouter();
const channelType=ref<LeagueSpuChannel>(LeagueSpuChannel.DAI_FA_TU)
const dataSource=shallowRef<any[]>([])
const isLoading=ref(false)
const isNotMore=ref(false)
const initLoading=ref(false)
const page=ref(1)
const pagination = {
  onChange: (now: number) => {
    page.value=now
    loadData()
  },
  pageSize:90,
  showSizeChanger:false
};
const state=reactive({
  isShowCreateModal:false,
  isSaveLoading:false,
})

const form = ref({
  row: {},
  categoryId: '',
  salePriceRatio: '',
  commissionRatio: '',
  spuId: '',
  channelType: ''
})

const  cSelectOption:Array<any>[]=[
    {
        val: 1,
        title: '测试'
    }
]

const opts = ref(cSelectOption)

const selectItems=shallowRef<any[]>([])
const targetFn=()=>{
  return document.querySelector('.product-list')
}
const loadData=async ()=>{
   const result=await useGet<any[]>("/league/product/channel/products",{"channelType":channelType.value,page:page.value})
   let list=result.data?.data??[]
   // isNotMore.value=list.length==0 || list.length<90
   pagination.total=result.data.total
   dataSource.value=list
}

const loadCategory=async ()=>{
   const result=await useGet<any[]>("/league/product/channel/category",{})
   let list=result?.data??[]
   // isNotMore.value=list.length==0 || list.length<90
   opts.value=list
}

const saveForm = async ()=>{
  state.isSaveLoading = true
  const copeForm = JSON.parse(JSON.stringify(form.value))
  if (copeForm.categoryId.length) {
    copeForm.categoryId = copeForm.categoryId[copeForm.categoryId.length-1]
  }
  copeForm.channelType = channelType.value
  copeForm.spuId = copeForm.row.id
  
  const result=await usePost("/league/product/channel/product/onShelf", copeForm)
  state.isSaveLoading = false
  state.isShowCreateModal = false
  loadData()
}

const onLoadMore=async ()=>{
  isLoading.value=true
  page.value=page.value+1
  await loadData()
  isLoading.value=false
}
const addCart=(item:any)=>{
  form.value.row = item
  state.isShowCreateModal = true
  // selectItems.value=selectItems.value.concat([item])
}
const delCart=(item:any)=>{
  selectItems.value=selectItems.value.filter(v=>v.id!=item.id)
}

onMounted(async()=> {
   await loadData()
   loadCategory()
   initLoading.value=true
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text><a  @click="router.back()"  ><ArrowLeftOutlined class="mr-1" style="color:black"/></a>  选品中心</a-typography-text>
        <div>
          <span>供应链</span>
          <a-select v-model:value="channelType" style="width: 100px" class="ml-2">
            <a-select-option v-for="(item) in  LeagueSpuChannelSelectOption" :value="item.value" :label="item.title">{{item.title}}</a-select-option>
          </a-select>
        </div>
      </a-flex>
    </a-card>
    <a-list class="product-list"  :pagination="pagination" :loading="isLoading" :grid="{ gutter: 16, column: 6 }" :data-source="dataSource">
      <template #renderItem="{ item }">
        <a-list-item >
          <a-card hoverable>
            <template #cover>
              <img  :src="item['goods_master_image']" />
            </template>
            <a-card-meta :title="item['goods_name']">
              <template #description >
                <a-flex justify="space-between">
                  <span style="color: red">  ¥ {{item["goods_price"]}} </span>
                  <a-button @click="addCart(item)" v-if="selectItems.findIndex(v=>v.id==item.id)<0" type="primary">
                    添加
                  </a-button>
                  <!-- <a-button @click="delCart(item)" v-if="selectItems.findIndex(v=>v.id==item.id)>=0" type="primary" shape="circle" danger>
                    <template #icon>
                      <DeleteOutlined />
                    </template>
                  </a-button> -->
                </a-flex>
              </template>
            </a-card-meta>

          </a-card>
        </a-list-item>
      </template>

    </a-list>
    <a-float-button-group shape="circle">
      <a-float-button
          shape="circle"
          :badge="{ count: selectItems.length, color: 'blue' }"
          type="primary" >
        <template #icon>
          <ShoppingCartOutlined />
        </template>
      </a-float-button>
      <a-back-top :target="targetFn" :visibilityHeight="0"  />
    </a-float-button-group>

    <a-modal :width="400" v-model:open="state.isShowCreateModal" centered :closable="false" destroy-on-close :footer="null" :title="null">
        <a-flex vertical :gap="15">
            <a-typography-text strong >添加商品</a-typography-text>
            <div style="height: 350px;overflow-y: auto">
                <a-form layout="vertical">
                  <a-flex :gap="10" align="center">
                      <a-form-item name="name"  label="商品信息:">
                        {{ form.row.goods_name }} <span style="color: red;">￥{{ form.row.goods_price }}</span>
                      </a-form-item>
                    </a-flex>
                    <a-flex :gap="10" align="center">
                      <a-form-item name="name"  label="商品分类">
                        <a-cascader
                          v-model:value="form.categoryId"
                          :options="opts"
                          :fieldNames="{
                            label: 'name',
                            value: 'id',
                          }"
                          placeholder="请添加商品分类"
                          style="width: 320px"
                        />


                        <!-- <a-select v-model:value="form.categoryId"  placeholder="请添加商品分类" style="width: 320px" class="ml-2">
                          <a-select-option v-for="(item) in  opts" :value="item.val" :label="item.title">{{item.title}}</a-select-option>
                        </a-select> -->
                      </a-form-item>
                    </a-flex>
                    <a-flex :gap="10" align="center">
                      <a-form-item name="name"  label="设置销售价格比例">
                          <a-input v-model:value="form.salePriceRatio" placeholder="" size="middle" style="width: 320px"></a-input>%
                      </a-form-item>
                    </a-flex>
                    <a-flex :gap="10" align="center">
                      <a-form-item name="name"  label="设置佣金比例">
                          <a-input v-model:value="form.commissionRatio" placeholder="" size="middle" style="width: 320px"></a-input>%
                      </a-form-item>
                    </a-flex>
                </a-form>
            </div>
            <a-flex justify="flex-end" :gap="10">
                <a-button @click="state.isShowCreateModal=false" style="width: 120px" >取消</a-button>
                <a-button :disabled="!form.categoryId" :loading="state.isSaveLoading" style="width: 120px" @click="saveForm" type="primary">保存</a-button>
            </a-flex>
        </a-flex>
    </a-modal>

  </a-flex>
</template>

<style scoped lang="less">

</style>