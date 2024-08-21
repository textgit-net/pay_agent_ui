<script setup lang="ts">
import {PlusOutlined} from  '@ant-design/icons-vue'

import {
  getAccountRoleList,
  RoleInfoResponse
} from "~/api/account/AccountInterface.ts";
import PermissionPanel from "./components/PermissionPanel.vue";

const roles=shallowRef<RoleInfoResponse[]>([])



const loadRoles =async ()=>{
  let {data} =await getAccountRoleList()
  roles.value=data||[]
}
const selectRoleItemKey=ref(null)
onMounted(()=>{
   loadRoles()
})

</script>

<template>
  <a-flex vertical :flex="1" :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>角色权限</a-typography-text>
      </a-flex>
    </a-card>
    <div style="background: #ffffff;border-radius: 4px;flex: 1;width: 100%;display: flex;flex-direction: column">
      <div style="border-bottom: 1px solid #ebebeb;padding: 24px 24px 12px;">
        <a-button type="primary">
          <template #icon><PlusOutlined /></template>
          新增角色权限
        </a-button>
      </div>
      <a-flex :flex="1" style="flex: 1">
        <div class="role_list">
          <div class="role-list-item" :class="{'active':!selectRoleItemKey}"> 管理员</div>
        </div>
        <a-flex vertical style="flex: 1;width: 100%" class="permission">
          <div class="operation" >
            <span>{{!selectRoleItemKey?'管理员':''}}</span>
            <a >编辑角色权限</a>
          </div>
          <PermissionPanel/>
<!--          <div class="container" style=" max-height: 558px; overflow-y:auto;width: 100%">-->
<!--            <div class="module" v-for="(group) in permissionsResponse" >-->
<!--                <div class="module_name">-->
<!--                  <div class="module_label">{{group.name}}</div>-->
<!--                </div>-->
<!--                <div  class="module_permissions">-->
<!--                  <div  class="permission_item" v-for="(item) in group.metadataList">-->
<!--                        <div class="permission_label">-->
<!--                            <span>{{ item.description }}</span>-->
<!--                        </div>-->
<!--&lt;!&ndash;                        <div class="show_permission_desc">&ndash;&gt;-->
<!--&lt;!&ndash;                          <span>{{ item.description }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;                        </div>&ndash;&gt;-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--          </div>-->
        </a-flex>
      </a-flex>

    </div>

  </a-flex>
</template>

<style scoped lang="less">
 .role_list{
   border-right: 1px solid #ebebeb;
   display: flex;
   flex-direction: column;
   min-width: 153px;
   overflow-y: auto;
   .role-list-item{
     cursor: pointer;
     font-size: 14px;
     line-height: 22px;
     color:#333;
     padding: 12px 16px;
     &.active{
       background: #ebf3ff;
       color: #338aff;
     }
   }
 }
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
