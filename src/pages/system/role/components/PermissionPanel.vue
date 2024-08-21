<script setup lang="ts">


import {getPermissionResource, PermissionsGroup} from "~/api/account/AccountInterface.ts";

const permissionsResponse=shallowRef<PermissionsGroup[]>([])

const loadPermissionsResponse =async ()=>{
  let {data} =await getPermissionResource()
  permissionsResponse.value=data||[]
}
onMounted(()=>{
  loadPermissionsResponse()
})
</script>

<template>
  <div class="container" style=" max-height: 558px; overflow-y:auto;width: 100%">
    <div class="module" v-for="(group) in permissionsResponse" >
      <div class="module_name">
        <div class="module_label">{{group.name}}</div>
      </div>
      <div  class="module_permissions">
        <div  class="permission_item" v-for="(item) in group.metadataList">
          <div class="permission_label">
            <span>{{ item.description }}</span>
          </div>
          <!--                        <div class="show_permission_desc">-->
          <!--                          <span>{{ item.description }}</span>-->
          <!--                        </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container,.module{
  width: 100%;
}
.module{
  display: flex;
  .module_name{
    width: 175px;
  }
  .module_permissions{
    .permission_item{
      .show_permission_desc{
        padding-left: 0;
        color: rgb(153, 153, 153);
      }
    }
  }
}
.container{
  width: 751px;
  background: #fff;
  border: 1px solid #ebebeb;
  border-bottom-width: 0px;
  overflow-y: auto;
}
.module{
  display: flex;
  .module_name {
    width: 175px;
    align-items: center;
    background: #fafafa;
    border-bottom: 1px solid #ebebeb;
    border-right: 1px solid #ebebeb;
    display: flex;
    padding: 14px 16px;
    .module_label{
      color: #333;
      flex-wrap: wrap;
      font-size: 12px;
      font-weight: 600;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .module_permissions{
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .permission_item{
      border-bottom: 1px solid #ebebeb;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 4px 16px;
      width: 50%;

      .permission_label{
        color: #333;
        font-size: 12px;
        line-height: 20px;
      }
      .show_permission_desc{
        padding-left: 0;
        color: rgb(153, 153, 153);

        font-size: 12px;
        line-height: 20px;
        //padding-left: 22px;
      }
    }
  }
}
</style>
<style>
.container .module .module_permissions .permission_item:last-child:nth-child(odd), .container .module .module_permissions .permission_item:only-child {
  width: 100%;
}
</style>