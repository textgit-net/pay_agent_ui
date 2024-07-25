<script  lang="ts">
export default {
  name: 'IconComboWidget',
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
  <svg t="1711786229018"
       class="icon"
       viewBox="0 0 1024 1024"
       version="1.1"
       xmlns="http://www.w3.org/2000/svg"
       p-id="107870" :width="width" :height="height">
    <path d="M880.36 926.41H143.64c-25.43 0-46.05-20.62-46.05-46.05V143.64c0-25.43 20.62-46.05 46.05-46.05h736.73c25.43 0 46.05 20.62 46.05 46.05v736.73c-0.01 25.42-20.63 46.04-46.06 46.04z m-690.68-92.09h644.64V189.68H189.68v644.64z"
          :fill="color"
          p-id="107871"></path>
    <path d="M746.41 398.98H625.02V277.59c0-25.43-20.62-46.05-46.05-46.05h-267.9c-25.43 0-46.05 20.62-46.05 46.05v267.89c0 25.43 20.62 46.05 46.05 46.05h124.18c-1.4 4.4-2.77 8.85-2.77 13.71v107.69c0 25.43 20.62 46.05 46.05 46.05h267.89c25.43 0 46.05-20.62 46.05-46.05V445.02c-0.02-25.43-20.63-46.04-46.06-46.04z m-389.3-75.34h175.82v175.8H357.11v-175.8z m343.25 343.25h-175.8v-61.65c0-4.86-1.37-9.31-2.77-13.71h57.18c25.43 0 46.05-20.62 46.05-46.05v-54.41h75.34v175.82z"
          :fill="color"
          p-id="107872"></path>
  </svg>
</template>

<style scoped lang="less">

</style>