<script lang="ts">
export default {
  name: 'IconSummary',
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
      default:"#333"
    }
  }
}
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" elementtiming="element-timing"><ellipse cx="24" cy="11" rx="20" ry="6" fill="transparent" :stroke="color" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></ellipse><path d="M10.7709 15.5C6.61878 16.5994 4 18.208 4 20C4 23.3137 12.9543 26 24 26C35.0457 26 44 23.3137 44 20C44 18.208 41.3812 16.5994 37.2291 15.5C33.7035 16.4335 29.0722 17 24 17C18.9278 17 14.2965 16.4335 10.7709 15.5Z" fill="transparent" :stroke="color" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path><path d="M10.7709 24.5C6.61878 25.5994 4 27.208 4 29C4 32.3137 12.9543 35 24 35C35.0457 35 44 32.3137 44 29C44 27.208 41.3812 25.5994 37.2291 24.5C33.7035 25.4335 29.0722 26 24 26C18.9278 26 14.2965 25.4335 10.7709 24.5Z" fill="transparent" :stroke="color" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path><path d="M10.7709 33.5C6.61878 34.5994 4 36.208 4 38C4 41.3137 12.9543 44 24 44C35.0457 44 44 41.3137 44 38C44 36.208 41.3812 34.5994 37.2291 33.5C33.7035 34.4335 29.0722 35 24 35C18.9278 35 14.2965 34.4335 10.7709 33.5Z" fill="transparent" :stroke="color" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" elementtiming="element-timing"></path></svg>
</template>

<style scoped lang="less">

</style>