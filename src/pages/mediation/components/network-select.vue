<script setup lang="ts">
import AdNetworkItem from "~/pages/mediation/components/network-item.vue";

const props = defineProps({
  value: {
    type: Number,
    required: false
  }
})

watch(()=>props.value,(newVal,_)=>{
  modelValue.value=newVal
})
const emits = defineEmits(['update:value',"onChange"])
const modelValue=ref(props.value)
function  onChange(){
  emits("update:value",modelValue)
  emits("onChange",modelValue)
}




</script>

<template>
  <a-select v-model:value="modelValue"  @change="onChange" placeholder="请选择广告平台">
    <a-select-option :value="1">
      <ad-network-item :value="1"/>
    </a-select-option>
    <a-select-option :value="2">
      <ad-network-item :value="2"/>
    </a-select-option>
    <a-select-option :value="3">
      <ad-network-item :value="3"/>
    </a-select-option>
    <a-select-option :value="4">
      <ad-network-item :value="4"/>
    </a-select-option>
    <a-select-option :value="7">
      <ad-network-item :value="7"/>
    </a-select-option>
    <a-select-option :value="10">
      <ad-network-item :value="10"/>
    </a-select-option>
    <a-select-option :value="9">
      <ad-network-item :value="9"/>
    </a-select-option>
  </a-select>
</template>

<style scoped lang="less">

</style>