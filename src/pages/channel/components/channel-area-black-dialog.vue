<script setup lang="ts">
import { ref, computed, CSSProperties, watch, watchEffect } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useDraggable } from '@vueuse/core';
import { message } from 'ant-design-vue';
import {ChannelListResponse} from "~/api/channel/ChannelInterface.ts";
import {ChannelAddressBlackListFormData,saveChannelAddressBlackList} from '@/api/channel/blacklist'
import { earthCityData } from '@/data/earth_city_data'
import { isArray } from 'lodash';
const userStore = useUserStore()

const initFormData = ():ChannelAddressBlackListFormData => {
  return {
    channelId: 0,
    isEnable: false
  }
}

const formData = reactive<ChannelAddressBlackListFormData>(initFormData());

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'onSuccess'): void;
}

const emit = defineEmits<Emits>();

export interface PropsType {
  visiable: boolean;
  chnnelInfo?:  any;
}


const props = withDefaults(defineProps<Partial<PropsType>>(), {
  visiable: false,
  chnnelInfo: {}
});



const handleOk = async () => {
  FormRef.value.validate().then(() => {
    submit()
    
  }).catch(error => {
    message.error(error['errorFields'][0]['errors'][0])
    console.log('error', error);
  })
 
};

const submit = async () => {
  state.dialogBtnLoading = true
  try {
    let res = await saveChannelAddressBlackList(formData)
    emit('onSuccess');
    message.success('操作成功')
    modalVisible.value = false
  } catch (error) {
    
  } finally {
    state.dialogBtnLoading = false
  }
}

const disabled = computed(() => {
  return !formData.country;
});

const modalTitleRef = ref<HTMLElement>(null);
const FormRef = ref()


const { x, y, isDragging } = useDraggable(modalTitleRef);
const startX = ref<number>(0);
const startY = ref<number>(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value;
    startY.value = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = modalTitleRef.value.getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag.value = true;
});

watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});

watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
      preTransformX.value +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      startX.value;
    transformY.value =
      preTransformY.value +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      startY.value;
  }
});

const transformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});


const state = reactive({
  dialogBtnLoading: false
})


const modalVisible = computed({
  get: () => props.visiable,
  set: (newVal) => {
    emit('update:visible', newVal);
  },
});

const userInfo = computed(()=>{
  return userStore.userInfo
}) 



const chnelInfo =ref<ChannelListResponse>({})
watch(() => props.chnnelInfo, (val) => {
  chnelInfo.value = val
  formData.channelId = chnelInfo.value.id
  nextTick().then(_=> {
    FormRef.value.resetFields();
  })
})


const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const changeCountry = (val:string) => {
    console.log(val)
    formData.province =undefined;
    formData.city = undefined;
    if (val) {
        findProvices(val)
    } else {
        cityOpts.value = []
        proviceOpts.value = []
    }
}
const changeProvice = (val:string) => {
    formData.city = undefined;
    findcitys(val)
}

const findProvices = (val:string) => {
    let arr = earthCityData.filter(i => i['@CountryName'] == val)
    proviceOpts.value = []
    if (arr.length) {
        proviceOpts.value = arr[0].Station
    }
    
}

const findcitys = (val:string) => {
   
    console.log('proviceOpts', proviceOpts.value)
    let arr = proviceOpts.value.filter(i => i['@StationName'] == val)
    cityOpts.value = []
    console.log('arr', arr[0].City)
    if (arr.length) {
        cityOpts.value = isArray(arr[0].City) ? arr[0].City: [arr[0].City]
    }
    
}

const proviceOpts = ref([])
const cityOpts = ref([])

onMounted(() => {
 
})


</script>

<template>
    <a-modal ref="modalRef" v-model:visible="modalVisible"  :mask-closable="false" style="width: 480px;" :keyboard="false">
        <template #title>
            <div ref="modalTitleRef" style="width: 100%; cursor: move">添加渠道【{{chnelInfo.name}}】地区权限</div>
        </template>

        <template #footer>
          <a-flex align="center" style="padding-bottom: 20px;">
            <a-button key="submit" style="width: 100%;" :disabled="disabled" type="primary" :loading="state.dialogBtnLoading" @click="handleOk">保 存</a-button>
          </a-flex>
        </template>
        

        <a-form
            ref="FormRef"
            :model="formData"
            name="basic"
            layout="vertical"
            autocomplete="off"
            style="padding-top:10px;"
        >
            <a-form-item
                label="国家或地区"
                name="country"
                :rules="[
                    { required: true, message: '国家或地区不能为空',trigger: 'change' },
                    
                ]"
            >
                <a-select  @change="changeCountry" placeholder="按国家或地区筛选" :filter-option="filterOption"  show-search v-model:value="formData.country"  allow-clear style="width: 100%;">
                <a-select-option v-for="(item) in earthCityData" :value="item['@CountryName']" :label="item['@CountryName']" >{{item['@CountryName']}}</a-select-option>
                </a-select>
             
            </a-form-item>

            <a-form-item
                label="省份或州"
                name="province"
                :rules="[
                    { required: false, message: '省份或州不能为空',trigger: 'change' },
                ]"
            >
                <a-select @change="changeProvice" placeholder="按省份或州筛选" :filter-option="filterOption"  show-search v-model:value="formData.province" :disabled="!formData.country"  allow-clear style="width: 100%;">
                <a-select-option v-for="(item) in proviceOpts" :value="item['@StationName']" :label="item['@StationName']" >{{item['@StationName']}}</a-select-option>
                </a-select>
             
            </a-form-item>

            <a-form-item
                label="城市"
                name="city"
                :rules="[
                    { required: false, message: '城市不能为空',trigger: 'change' },
                    
                ]"
            >
                <a-select placeholder="按城市筛选" :filter-option="filterOption"  show-search v-model:value="formData.city" :disabled="!formData.province"  allow-clear style="width: 100%;">
                <a-select-option v-for="(item) in cityOpts" :value="item['@CityName']" :label="item['@CityName']" >{{item['@CityName']}}</a-select-option>
                </a-select>
             
            </a-form-item>

            <a-form-item
                label="限制区域"
                name="isEnable"
                :rules="[
                    { required: false, message: '限制区域',trigger: 'change' },
                    
                ]"
            >
              <a-flex vertical>
                <a-switch v-model:checked="formData.isEnable" checked-children="开" un-checked-children="关" style="width: 60px;" />
                <a-typography-text type="secondary">若开启限制区域，将视为开启白名单，只限制在开启区域；<br />若只添加不开启，则视为添加地区黑名单。</a-typography-text>
              </a-flex>
            </a-form-item>
        </a-form>
        <template #modalRender="{ originVNode }">
          <div :style="transformStyle">
            <component :is="originVNode" />
          </div>
        </template>
    </a-modal>
</template>
