<script setup lang="ts">

const props = defineProps({
  value: {
    type: Number,
    required: false
  },
  disabled:{
    type:Boolean,
    default:false
  },
  placeholder:{
    type: String,
    required:false
  },
  isShowPlaceholderItem:{
    type:Boolean,
    default:false
  },
  dataSourceUrl:{
    type: String,
    required:true
  },
  selectValue:{
    type: Object
  },
  labelKey:{
    type: String,
    required:false,
    default:"title"
  },
  valueKey:{
    type: String,
    required:false,
    default:"value"
  }
})
const emits = defineEmits(['update:value'])
const modelValue=ref(null)
const dataSource=shallowRef<any[]>([])
function  onChange(){
  emits("update:value",modelValue)
}
watch(()=>props.value,(newValue,_)=>modelValue.value=newValue)
const loadError=ref(false)
async function loadData(){
  try {
    let {data}= await useGet<any[]>(props.dataSourceUrl)
    dataSource.value=data??[]
  }catch (e){
    loadError.value=true
  }

}
onMounted(() => {
  loadData()
})
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-select status="error" style="width: 100%"  :placeholder="placeholder" v-if="loadError"/>
    <a-select status="warning" style="width: 100%"  :placeholder="placeholder" v-if="dataSource.length==0" />
    <a-select :disabled="disabled" style="width:100%" v-model:value="modelValue" @change="onChange"  :placeholder="placeholder" v-if="dataSource.length>0 && !loadError">
        <a-select-option v-if="isShowPlaceholderItem" :value="null">{{placeholder}}</a-select-option>
        <a-select-option v-for="(item) in dataSource" :value="item[valueKey]">{{item[labelKey]}}</a-select-option>
    </a-select>
  </a-space>
</template>

<style scoped lang="less">

</style>