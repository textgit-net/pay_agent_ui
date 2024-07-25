<script setup lang="ts">
import {PropType} from "vue";
import {ImageComponent, StyleAlignment} from "~/pages/designer/types/types.ts";

const props = defineProps({
  value:{
    type:Object as PropType<ImageComponent>,
    required:true
  },
})

</script>

<template>
  <img :src="value.src" alt=""/>
</template>

<style scoped lang="less">

</style>