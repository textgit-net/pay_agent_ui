<script  lang="ts">
export default {
  name: 'IconSwiperWidget',
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
  <svg t="1711785794148"
       class="icon"
       viewBox="0 0 1024 1024"
       version="1.1"
       xmlns="http://www.w3.org/2000/svg"
       p-id="95724" :width="width" :height="height">
    <path d="M987.429 841.143H36.57a18.286 18.286 0 0 1-18.285-18.286V201.143a18.286 18.286 0 0 1 18.285-18.286H987.43a18.286 18.286 0 0 1 18.285 18.286v621.714a18.286 18.286 0 0 1-18.285 18.286zM54.857 804.57h914.286V219.43H54.857z"
          p-id="95725"
          :fill="color" ></path>
    <path d="M658.286 768a54.857 54.857 0 1 1 54.857-54.857A54.857 54.857 0 0 1 658.286 768z m0-73.143a18.286 18.286 0 1 0 18.285 18.286 18.286 18.286 0 0 0-18.285-18.286zM365.714 768a54.857 54.857 0 1 1 54.857-54.857A54.857 54.857 0 0 1 365.714 768z m0-73.143A18.286 18.286 0 1 0 384 713.143a18.286 18.286 0 0 0-18.286-18.286zM457.143 713.143a54.857 54.857 0 1 0 109.714 0 54.857 54.857 0 1 0-109.714 0z"
          p-id="95726"
          :fill="color" ></path>
  </svg>
</template>

<style scoped lang="less">

</style>