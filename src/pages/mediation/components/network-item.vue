<script setup lang="ts">
const props = defineProps({
  value: {
    type: Number,
    required: true
  }
})
import IconAdCSJ from "~/components/icons/icon-ad-csj.vue";
import IconAdSet from "~/components/icons/icon_ad_set.vue";
import IconAdBaidu from "~/components/icons/icon_ad_baidu.vue";
import IconAdKuAisHou from "~/components/icons/icon-ad-kuaishou.vue";
import IconAdSigMob from "~/components/icons/icon-ad-sigmob.vue";
</script>

<template>
  <a-space v-if="value==1"><IconAdCSJ :width="24" :height="15" />穿山甲</a-space>
  <a-space v-if="value==2"> <IconAdSet :width="18" :height="18" />优量汇</a-space>
  <a-space v-if="value==3"> <IconAdKuAisHou :width="18" :height="18"/>快手</a-space>
  <a-space v-if="value==4"> <IconAdMob :width="18" :height="18"/>Google AdMob</a-space>
  <a-space v-if="value==7"> <IconAdBaidu :width="30" :height="18"/>百度</a-space>
  <a-space v-if="value==10"> <IconAdUnity :width="18" :height="18" />Unity</a-space>
  <a-space v-if="value==9"> <IconAdSigMob  :width="56" :height="16"/>SigMob</a-space>
</template>

<style scoped lang="less">

</style>