<script setup lang="ts">
import record from "~/pages/company/components/Record.vue";


const status = ref(1)
const handleChange = (val) => {
  console.log(val)
  status.value = val
 
}
</script>

<template>
  <PageContainer>
    <a-tabs @change="handleChange">
      <a-tab-pane key="1" tab="待支付">
      </a-tab-pane>
      <a-tab-pane key="2" tab="已完成">
      </a-tab-pane>    
      <a-tab-pane key="3" tab="超时关闭">
      </a-tab-pane>   
       <a-tab-pane key="4" tab="审核中">
      </a-tab-pane>   
       <a-tab-pane key="5" tab="审核驳回">
      </a-tab-pane>
      
    </a-tabs>
    <record :status="status"></record>
  </PageContainer>
</template>
<style scoped lang="less">
</style>