<script  lang="ts">
export default {
  name: 'IconForwardArrow',
  props:{
    width:{
      type:Number,
      default:46
    },
    height:{
      type:Number,
      default:46
    },
    color:{
      type:String,
      default:"white"
    }
  }
}

</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1711701712155"
       class="icon" viewBox="0 0 1024 1024" version="1.1"
       p-id="5951" :width="width" :height="height">
    <path
        d="M128 800h20.6l38.4-62.4c41-65.4 89.8-125.6 151.6-153.2 48.8-21.8 93.4-37.8 173.4-40V704l384-256-384-256v160.6C386 358.2 295.8 394 225.4 465 120.8 570.4 128 703 128 736.4c0.2 17.8 0 43.4 0 63.6z"
        :fill="color"
        p-id="5952"/>
  </svg>

</template>

<style scoped lang="less">

</style>