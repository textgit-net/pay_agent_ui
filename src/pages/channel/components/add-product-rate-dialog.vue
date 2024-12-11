<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
 ChannelGroupFormData,
 saveChannelGroup,
} from "~/api/channel/group.ts";
import { message } from 'ant-design-vue';
import {
  PayChannelType,
  PayChannelTypeSelectOption
} from "~/utils/constant.ts";
import { getChannelGroups,ChannelGroupSimpleResponse } from '@/api/channel/group'
import type { ProductItem }from '@/api/channel/group'
import { calcFloat } from '@/utils/calcFloat'
import { isArray } from 'lodash';
const userStore = useUserStore()
const optsStore = useOptsStore()
const productOpts = shallowRef<ChannelGroupSimpleResponse[]>([])
const originProductOpts = shallowRef<ChannelGroupSimpleResponse[]>([])

const columns = [
  {
    title: '支付产品',
    dataIndex: 'name',
  },
  {
    title: '支付费率(%)',
    dataIndex: 'rate',
  },
];

interface Emits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'onSuccess', selects: ProductItem[]): void;
}

const emit = defineEmits<Emits>();


export interface PropsType {
    visiable: boolean;
    products?: any;
}


const props = withDefaults(defineProps<Partial<PropsType>>(), {
    visiable: false,
    products: []
});


const state = reactive({
    isSaveLoading: false,
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
})

const initChannelGroupFormData = ():ChannelGroupFormData => {
  return {
    isEnable: true,
    description: '',
    groupCode: '',
    channelType: PayChannelType.ALI,
    name: '',
  }
}
const formData=ref<ChannelGroupFormData>(initChannelGroupFormData())
const isDisAbledChannelGroupForm = computed(() => {
  return ! !!state.selectedRowKeys.length
})



const loadGroups = async () => {
//   const { data } = await getChannelGroups()
//   productOpts.value = data ?? []
//   productOpts.value = productOpts.value.map(i => {
//     return {
//         ...i,
//         rate: 0
//     }
//   })
// originProductOpts.value = JSON.parse(JSON.stringify(productOpts.value))
  let data:ChannelGroupSimpleResponse[]  = []
  userStore.userInfo.products.map(i => {
    if (i.isEnable) {
        let item: ChannelGroupSimpleResponse = {}
        item.channelType = i.channelType
        item.groupCode = i.productCode
        item.name = i.productName
        item.rate = 0
        data.push(item)
    }
    
  })
  productOpts.value = data
  originProductOpts.value = JSON.parse(JSON.stringify(productOpts.value))
}
loadGroups()

const onsubmit = async ()=>{
    console.log(' getFormData()',  getFormData())
    modalVisible.value = false
    emit('onSuccess', getFormData())
}


const modalVisible = computed({
    get: () => props.visiable,
    set: (newVal) => {
        emit('update:visible', newVal);
    },
});


watch(() => props.products, (data: ProductItem[]) => {
    nextTick().then(_ => {
        console.log('data', data, isArray(data))
        state.selectedRowKeys = []
        if(data && data.length){
            productOpts.value = originProductOpts.value.map(pI => {
                data.map(i => {
                    if (pI.groupCode == i.productCode) {
                        pI.rate = calcFloat.multi(i.freeRate, 100)
                        state.selectedRowKeys.push(i.productCode)
                    }
                })
                return pI
            })
            
        } else {
            console.log(222)
            productOpts.value = originProductOpts.value
        }
        console.log('state.selectedRowKeys', state.selectedRowKeys)
    })
    
})

const handleColse = () => {
    modalVisible.value = false
}


const onSelectChange = (selectedRowKeys: any[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  state.selectedRowKeys = selectedRowKeys;
};

const getFormData = ():ProductItem[] => {
    let products: ProductItem[] = []
    productOpts.value.map(i => {
        if (state.selectedRowKeys.includes(i.groupCode)) {
            let item:ProductItem = {}
            item.freeRate = calcFloat.div(i.rate, 100)
            item.productCode = i.groupCode
            products.push(item)
        }
    })
    return products
}

onMounted(() => {

})

defineExpose({
    getFormData,
});

</script>

<template>
    <a-modal ref="modalRef" v-model:visible="modalVisible" :mask-closable="false" :closable="true" centered :width="620"
        title="选择支付产品">
        <template #footer>
            <a-button key="back" @click="handleColse">取 消</a-button>
            <a-button key="submit" type="primary" :loading="state.isSaveLoading" :disabled="isDisAbledChannelGroupForm"
                @click="onsubmit">确 认</a-button>
        </template>
        <a-table
            :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
            rowKey="groupCode"
            :columns="columns"
            :scroll="{ y: 360 }"
            :pagination="false"
            :data-source="productOpts"
        >
            <template #headerCell="{ column }">
                <template v-if="column.dataIndex === 'rate'">
                    <a-space>
                        支付费率(%)
                    </a-space>
                </template>
            </template>
            <template #bodyCell="{ column , record}">
                <template v-if="column.dataIndex=='rate'">
                    <a-flex vertical :gap="5" align="start">
                        <a-input v-model:value="record.rate"  placeholder="请输入费率"></a-input>
                    </a-flex>
                </template>
            </template>
        </a-table>
        <a-alert
            style="margin: 10px 0;"
            type="success"
        >
            <template v-slot:description>
                <div>已选{{state.selectedRowKeys.length}}个产品</div>
            </template>
        </a-alert>
    </a-modal>
</template>
