<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const props = defineProps({
  value: {
    type: String,
    required: false
  }
})
const emits = defineEmits(['update:value'])
const content = ref(props.value??"")// 定义content
function onTextChange(){
  emits("update:value",unref(content))

}
const editorOptions ={
  modules: {
    toolbar: [ // 工具栏配置
      ['bold', 'italic', 'underline', 'strike'], // 粗体、斜体、下划线、删除线
      ['image'],
      [{ 'header': 1 }, { 'header': 2 }], // 标题1和标题2
      [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 有序列表和无序列表
      [{ 'script': 'sub' }, { 'script': 'super' }], // 上标和下标
      [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
      [{ 'direction': 'rtl' }], // 文字方向
      [{ 'size': ['small', false, 'large', 'huge'] }], // 字号
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 标题等级
      [{ 'color': [] }, { 'background': [] }], // 字体颜色和背景色
      [{ 'font': [] }], // 字体
      [{ 'align': [] }], // 对齐方式
      ['clean'], // 清除格式
    ],
  },
}
</script>

<template>
  <div>
    <QuillEditor content-type="html" v-model:content="content"  @textChange="onTextChange" :options="editorOptions" />
  </div>
</template>

<style scoped lang="less">
.edit_container {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.ql-container{
  height: calc( 100% - 66px ) !important;
}
</style>
