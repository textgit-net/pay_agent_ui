<script setup lang="ts">
import {FolderOpenOutlined,CaretRightOutlined,FileAddOutlined,EditOutlined,DeleteOutlined}  from '@ant-design/icons-vue'
</script>

<template>
  <div>
    <div class="new-page-wrap cover-new-page-warp">
       <span class="add-group-button">
          <FolderOpenOutlined />
          添加分组
        </span>
    </div>
    <div class="page-group-wrap">
      <a-collapse
          class="page-manage-collapse"
          style=" position: relative;  cursor: pointer;border-bottom: 1px solid #d6d6d6;z-index: 1;"
          :bordered="false">
        <template #expandIcon="{ isActive }">
          <CaretRightOutlined :rotate="isActive ? 90 : 0" />
        </template>
        <a-collapse-panel>
          <template #header>
            <a-flex justify="space-between">
              <span>默认页面</span>
              <div class="button-handel" >
                <FileAddOutlined />
                <EditOutlined  class="ml-4"/>
                <DeleteOutlined class="ml-4" />
              </div>
            </a-flex>
          </template>
          <a-flex class="page-item" justify="space-between"  align="center">
            <span>默认页面</span>
            <div class="button-handel" >
              <FileAddOutlined />
              <EditOutlined  class="ml-4"/>
              <DeleteOutlined class="ml-4 mr-4" />
            </div>
          </a-flex>
          <div  class="add-page-tip">
            <FileAddOutlined/>添加页面
          </div>
        </a-collapse-panel>

      </a-collapse>
    </div>

  </div>
</template>

<style>
.page-manage-collapse.ant-collapse .ant-collapse-content{

}
.page-manage-collapse.ant-collapse  .ant-collapse-header {
  background-color: #fff;
}
.page-manage-collapse.ant-collapse .ant-collapse-content>.ant-collapse-content-box {
  padding: 0 !important;
}
.ant-collapse-item-active.active .add-page-tip {
  display: block;
}
.button-handel{
  display: none;
}
.page-item{
  border-bottom: 1px solid #e3e3e3;
  width: 100%;
  height: 48px
}
.page-item:hover .button-handel{
  display: block;
}
.ant-collapse-header:hover .button-handel{
  display: block;
}
</style>
<style scoped lang="less">
.page-group-wrap {
  position: absolute;
  top: 48px;
  width: 100%;
  bottom: 58px;
  line-height: 45px;
  text-indent: 28px;
  font-size: 14px;
  overflow-x: hidden;
  overflow-y: auto;
}
label,span{
  user-select: none;
}
.add-page-tip {
  display: block;
  margin: 10px auto;
  height: 40px;
  width: 251px;
  border: 1px dashed;
  line-height: 40px;
  text-align: center;
  text-indent: 0;
  border-radius: 2px;
  cursor: pointer;
  color: #4b4bc3;
  &:hover {
    border-color: #3091F2;
    color: #3091F2;
  }
}
.add-page-tip.cover-add-page-tip{
  width: 251px;
}
.new-page-wrap {
  position: absolute;
  top: 0;
  width: 300px;
  padding: 12px 0;
  text-align: center;
  background-color: #fff;
  color: #fff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom: 1px solid #d6d6d6;
  &.cover-new-page-warp{
    width: 269px;
    text-align: left;
    padding-left: 5px;
    box-sizing: border-box;
  }
  .add-group-button{
    color: #000;
    border: none;
    font-size: 14px;
    margin-left: 10px;
    display: inline-block;
    width: 134px;
    cursor: pointer;
    letter-spacing: normal;
    border-radius: 2px;
    background-color: #fff;

  }
}
</style>