<script lang="ts">
export default {
  name: 'IconAccelerators',
  props:{
    width:{
      type:Number,
      default:16
    },
    height:{
      type:Number,
      default:16
    },
    color:{
      type:String,
      default:"#333"
    }
  }
}
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 48 48" fill="none" elementtiming="element-timing"><path d="M20.906 6.06267L22.3359 5.1094C23.3436 4.4376 24.6564 4.4376 25.6641 5.1094L27.094 6.06267C32.658 9.77199 36 16.0166 36 22.7037V33H12V22.7037C12 16.0166 15.342 9.77199 20.906 6.06267Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path><circle cx="24" cy="20" r="6" fill="none" stroke="#333" stroke-width="4" elementtiming="element-timing"></circle><path d="M12 22L6 28.2174V33H42V28.2174L36 22" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path><path d="M24 38V44" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path><path d="M16 40V42" :stroke="color" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path><path d="M32 40V42" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path></svg>
</template>

<style scoped lang="less">

</style>