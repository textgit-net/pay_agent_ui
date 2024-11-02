<script setup lang="ts">
import { type StyleValue } from "vue"
import { message } from "ant-design-vue";
import {
    CopyFilled
} from '@ant-design/icons-vue';
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();


export interface PropsType {
  copytext: string;
  tipText: string;
  isShowText: boolean;
  text: string;
  iconStyle: Partial<StyleValue>;
  textStyle: Partial<StyleValue>;
}


const props = withDefaults(defineProps<Partial<PropsType>>(), {
  copytext: '',
  tipText: '复制',
  text: "复制",
  isShowText: false,
  iconStyle: () => ({
    color: "#1677ff"
  }),
  textStyle: () => ({
    color: "#1677ff"
  }),
});

const handleCopyText = async () => {
    await toClipboard(`${props.copytext}`);
    message.success('复制成功');
}

</script>

<template>
    <a-space @click="handleCopyText">
        <a-tooltip>
          <template #title>{{  props.tipText }}</template>
          <CopyFilled :style="props.iconStyle" class="icon" />
          <a v-if="props.isShowText" :style="props.textStyle">{{ props.text }}</a>
        </a-tooltip>
    </a-space>
</template>

<style lang="less" scoped>
  .icon {
    cursor: pointer;
  }
</style>
