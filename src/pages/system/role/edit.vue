<script setup lang="ts">
import {PlusOutlined,ArrowLeftOutlined,LeftOutlined} from  '@ant-design/icons-vue'
import {useProp} from "element-plus";
const router=useRouter()

const roleId=router.currentRoute.value?.query["id"]

const selectRoleItemKey=ref(null)
onMounted(()=>{

})

</script>

<template>
  <a-flex vertical :flex="1" :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-space :gap="10">
        <a  @click="router.back()"   style="font-size: 14px;font-weight: 600;color: #333"><LeftOutlined class="mr-1"/> 返回</a>
        <a-typography-text>{{roleId==null?'新增':'修改'}}角色权限</a-typography-text>
      </a-space>
    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

.permission{
  padding: 16px 17px;
  width: auto;
  .operation{
    margin-bottom: 17px;
    span {
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      margin-right: 16px;
    }
    a {
      color: #338aff;
      font-size: 14px;
      line-height: 22px;
      margin-right: 16px;
    }
  }
}
</style>
<style lang="less">

</style>
