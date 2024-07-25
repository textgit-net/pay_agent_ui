<script setup lang="ts">

</script>

<template>
<div>
  <div class="header-component header-component-height">
      <div class="header-center">
         <div class="app-name editName">
           <span>双十一模版4</span>
         </div>
        <div class="app-style editName">

        </div>
        <div class="history-wrap-box">
          <div class="history-label">
            <span>版本历史</span>
          </div>
        </div>
      </div>
  </div>
  <div class="header">
    <a-button style="width: 100px;">预览</a-button>
    <a-button style="width: 100px;" class="ml-4" type="primary">保存</a-button>
  </div>
</div>
</template>

<style scoped lang="less">
label,span{
  user-select: none;
}
.header, .header-component.header-component-height {
  height: 60px;
  line-height: 60px;
}
.header-component {
  position: fixed;
  top: 0;
  width: 100%;
  margin: 0 auto;
  height: 70px;
  line-height: 70px;
  background-color: #fff;
  color: #000;
  z-index: 10;
  box-shadow: 0 0 5px 0 #a5a5a5;
}
.header{
  position: fixed;
  z-index: 12;
  right: 23px;
  top: 0;
}
.chainEditName, .editName{
  display: inline-block;
  color: #59607b;
  text-align: center;
  height: 70px;
}
.header-center{
  position: absolute;
  left: 50%;
  top: 0;
  height: 60px;
  margin-left: -130px;
  .app-name{
    position: relative;
  }
  .app-style{
    display: inline-block;
    vertical-align: top;
    margin-left: 20px;
    margin-right: 12px;
    height: 70px;
    line-height: 65px;
  }
  .history-wrap-box{
    display: inline-block;
    vertical-align: top;
    height: 70px;
    .history-label:after, .history-label:before {
      content: "";
      position: absolute;
      left: -9px;
      background: #fff;
      z-index: 1;
      width: 18px;
      height: 18px;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      -o-transform: rotate(45deg);
    }
    .history-label {
      display: inline-block;
      width: 68px;
      line-height: 18px;
      background: #eef0f7;
      border-radius: 2px;
      color: #59607b;
      font-size: 12px;
      position: relative;
      text-align: center;
      &:before {
        top: -14px;
      }
      &:after {
        bottom: -14px;
      }
      span{
        padding-left: 6px;
        position: relative;
      }
    }

  }
}

.editName{
  span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    max-width: 130px;
    height: 60px;
  }
}
.icon-btn{
  font-size: 16px;
  margin-right: 8px;
  vertical-align: middle;
  position: relative;
  top: -2px;
}
</style>