<script  lang="ts">
export default {
  name: 'IconDoubleBottomOutlined',
  props:{
    width:{
      type:Number,
      default:14
    },
    height:{
      type:Number,
      default:14
    },
    color:{
      type:String,
      default:"#2a55e5"
    }
  }
}
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 48 48" fill="none" elementtiming="element-timing"><path d="M36 12L24 24L12 12" :stroke="color" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path><path d="M36 24L24 36L12 24" :stroke="color" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path></svg>
</template>

<style scoped lang="less">

</style>