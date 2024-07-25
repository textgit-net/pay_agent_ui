<script  lang="ts">
export default {
  name: 'IconTemplate',
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
  <svg t="1711774621298" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
       p-id="36129"  :width="width" :height="height">
    <path d="M128 128h352v256H128V128zM128 448h352v448H128V448zM544 640h352v256H544V640zM544 128h352v448H544V128z"
          p-id="36130" :fill="color"></path></svg>

</template>

<style scoped lang="less">

</style>