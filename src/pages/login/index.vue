<script setup lang="ts">
import {message, notification} from "ant-design-vue";
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import {AuthToken, login} from "~/api/account/AccountInterface.ts";
import {getQueryParam} from "~/utils/tools.ts";
const token = useAuthorization()
const router = useRouter()
const state=reactive({
  isLoading:false
})

interface FormState {
  loginName: string;
  password: string;
}
const formState = reactive<FormState>({
  loginName: '',
  password: '',
});

const disabled = computed(() => {
  return !(formState.loginName && formState.password);
});


const onFinish = (values: any) => {
  submit();
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

const submit= async () => {

  // if(!loginName.value && !password.value){
  //   notification.open({
  //     message: `系统提示`,
  //     duration:1,
  //     description:"请输入账号/密码",
  //     placement:'top',
  //   });
  //   return
  // }
  state.isLoading=true
  try {
    let res  = await login(formState.loginName,formState.password)
    let authInfo: AuthToken = res.data
    
    token.value=authInfo.accessToken
    // 获取当前是否存在重定向的链接，如果存在就走重定向的地址
    if (authInfo.isNeedUpdatePassword) {
      message.warning('首次登录需要重置密码')
      router.push({
        path: '/setting-pwd',
        query: {
          loginName: formState.loginName,
          redirect: getQueryParam('redirect', '/')
        },
        replace: false,
      })
    } else if (authInfo.isNeedCheckGoogleVerify) {
      
      router.push({
        path: '/google-verify',
        query: {
          loginName: formState.loginName,
          redirect: getQueryParam('redirect', '/')
        },
        replace: false,
      })
    } else {
      router.push({
        path: getQueryParam('redirect', '/'),
        replace: true,
      })
    }

    
   
  } catch (error) {
    
  } finally {
    state.isLoading=false
  }
   
}
</script>

<template>
  <section class="w3l-hotair-form">
    <h1>代理后台管理系统</h1>
    <div class="container">
      <div class="workinghny-form-grid">
        <div class="main-hotair">
          <div class="content-wthree">
            <h2>登  录</h2>

          

            <div class="form">
              <a-form
                :model="formState"
                name="horizontal_login"
                layout="vertical"
                autocomplete="off"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
              >
                <a-form-item
                  label="用户名"
                  name="loginName"
                  :rules="[{ required: true, message: '请输入用户名!' }]"
                >
                  <a-input v-model:value="formState.loginName">
                    <template #prefix>
                      <UserOutlined class="site-form-item-icon" />
                    </template>
                  </a-input>
                </a-form-item>

                <a-form-item
                  label="登录密码"
                  name="password"
                  :rules="[{ required: true, message: '请输入登录密码!' }]"
                >
                  <a-input-password v-model:value="formState.password">
                    <template #prefix>
                      <LockOutlined class="site-form-item-icon" />
                    </template>
                  </a-input-password>
                </a-form-item>

                <a-form-item>
                  <a-button type="primary" size="large" class="button" :loading="state.isLoading" html-type="submit">立即登录</a-button>
                </a-form-item>
              </a-form>
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
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    font-size: 16px;
    letter-spacing: 2px;
    color: #fff;
    width: 100%;
    -webkit-border-radius: 36px;
    border-radius: 36px;
    background: #0568C1;
    border: none;
    margin-top: 20px;

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