<script setup lang="ts">
import {notification} from "ant-design-vue";
import {login} from "~/api/account/AccountInterface.ts";
import {getQueryParam} from "~/utils/tools.ts";
const token = useAuthorization()
const router = useRouter()
const loginName=ref("")
const password=ref("")
const state=reactive({
  isLoading:false
})
const submit=async function (){
  console.log("LoginName:"+loginName.value)
  if(!loginName.value && !password.value){
    notification.open({
      message: `系统提示`,
      duration:1,
      description:"请输入账号/密码",
      placement:'top',
    });
    return
  }
  state.isLoading=true
  login(loginName.value,password.value).then((res)=>{
    state.isLoading=false
    token.value=res.data.accessToken
    // 获取当前是否存在重定向的链接，如果存在就走重定向的地址
    const redirect = getQueryParam('redirect', '/')
    router.push({
      path: redirect,
      replace: true,
    })
  }).catch(e=>{
    state.isLoading=false
  })
}
</script>

<template>
  <section class="w3l-hotair-form">
    <h1>商户后台管理系统</h1>
    <div class="container">
      <div class="workinghny-form-grid">
        <div class="main-hotair">
          <div class="content-wthree">
            <h2>Log In</h2>
            <div class="form">
              <input v-model="loginName" autocomplete="off" type="text" class="text" name="text" placeholder="User Name" >
              <input v-model="password"  autocomplete="new-password" type="password" class="password" placeholder="User Password" >
              <a-button type="primary" size="large" class="button" :loading="state.isLoading" @click="submit" >Login</a-button>

            </div>
          </div>
          <div class="w3l_form align-self">
            <div class="left_grid_info">
              <img style="max-width: 100%" src="@/assets/images/login-left.png">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.w3l-hotair-form{
  position: relative;
  min-height: 100vh;
  z-index: 0;
  background: #0568C1;
  padding: 40px 40px;
  justify-content: center;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  align-items: center;
  h1{
    text-align: center;
    font-size: 40px;
    font-weight: 700;
    color: #fff;
  }
  h2 {
    font-size: 30px;
    line-height: 40px;
    margin-bottom: 5px;
    font-weight: 900;
    color: #272346;
    text-align: center;
  }
  input {
    -webkit-appearance: none;
    appearance: none;
    -webkit-border-radius: 36px;
    border-radius: 36px;
    outline: none;
    margin-bottom: 15px;
    font-size: 16px;
    color: #999;
    text-align: left;
    padding: 14px 20px;
    width: 100%;
    display: inline-block;
    box-sizing: border-box;
    border: none;
    outline: none;
    background: #f7fafc;
    border: 1px solid #e5e5e5;
    transition: .3s ease;
    -webkit-transition: .3s ease;
    -moz-transition: .3s ease;
    -ms-transition: .3s ease;
    -o-transition: .3s ease;
    &:focus{
      background: transparent;
      border: 1px solid #0568C1;
    }
  }
  .form {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .container {
    max-width: 890px;
    margin: 0 auto;
  }
  .button {
    font-size: 18px;
    color: #fff;
    width: 100%;
    -webkit-border-radius: 36px;
    border-radius: 36px;
    background: #0568C1;
    border: none;

  }
  .main-hotair {
    position: relative;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    margin: 40px 0;
    .content-wthree {
      flex-basis: 50%;
      -webkit-flex-basis: 50%;
      box-sizing: border-box;
      padding: 3em 3em;
      background: #fff;
      box-shadow: 2px 9px 49px -17px rgba(0, 0, 0, 0.1);
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
    .w3l_form {
      flex-basis: 50%;
      -webkit-flex-basis: 50%;
      background: #f4f9fd;
      background-size: cover;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      -ms-background-size: cover;
      padding: 40px;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      align-items: center;
      display: grid;
    }
  }

}

</style>