<script  lang="ts">
export default {
  name: 'IconTextWidget',
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
  <svg t="1711784154211" class="icon" viewBox="0 0 1024 1024"
       version="1.1" xmlns="http://www.w3.org/2000/svg"
       p-id="63264" :width="width" :height="height">
    <path d="M859.428571 256a18.285714 18.285714 0 0 1-18.285714-18.285714V146.285714H182.857143v91.428572a18.285714 18.285714 0 0 1-36.571429 0v-109.714286a18.285714 18.285714 0 0 1 18.285715-18.285714h694.857142a18.285714 18.285714 0 0 1 18.285715 18.285714v109.714286a18.285714 18.285714 0 0 1-18.285715 18.285714z"
          :fill="color"
          p-id="63265"></path>
    <path d="M512 932.571429a18.285714 18.285714 0 0 1-18.285714-18.285715V128a18.285714 18.285714 0 0 1 36.571428 0V914.285714a18.285714 18.285714 0 0 1-18.285714 18.285715z"
          :fill="color"
          p-id="63266"></path>
    <path d="M694.857143 932.571429H329.142857a18.285714 18.285714 0 0 1 0-36.571429h365.714286a18.285714 18.285714 0 0 1 0 36.571429z"
          :fill="color"
          p-id="63267"></path></svg>
</template>

<style scoped lang="less">

</style>