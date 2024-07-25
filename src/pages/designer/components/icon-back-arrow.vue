<script  lang="ts">
export default {
  name: 'IconBackArrow',
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
  <svg t="1711770873709"
       class="icon"
       viewBox="0 0 1024 1024" version="1.1"
       xmlns="http://www.w3.org/2000/svg" p-id="30601"  :width="width" :height="height">
    <path d="M895.8 736.4c0-33.6 7.2-166.2-97.4-271.4-70.4-70.8-160.6-106.8-286.6-112.4V192L128 448l384 256V544.4c80 2.2 124.8 18.2 173.4 40C747.2 612 796 672.4 837 737.6l38.4 62.4H896c0-20.2-0.2-45.8-0.2-63.6z"
          :fill="color"
          p-id="30602">
    </path>
  </svg>
</template>

<style scoped lang="less">

</style>