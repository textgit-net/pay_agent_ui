import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { AxiosLoading } from './loading'
import { STORAGE_AUTHORIZE_KEY, useAuthorization } from '~/composables/authorization'
import { ContentTypeEnum, RequestEnum } from '~#/http-enum'
import router from '~/router'
import {ResponseBody} from "~/utils/constant.ts";

export interface RequestConfigExtra {
  token?: boolean
  customDev?: boolean
  loading?: boolean
}
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API ?? '/',
  timeout: 60000,
  headers: { 'Content-Type': ContentTypeEnum.JSON },
})
const axiosLoading = new AxiosLoading()
const deleteKeys = ['tabKey', 'timestamp']
async function requestHandler(config: InternalAxiosRequestConfig & RequestConfigExtra): Promise<InternalAxiosRequestConfig> {
  // 处理请求前的url
  if (
    import.meta.env.DEV
    && import.meta.env.VITE_APP_BASE_API_DEV
    && import.meta.env.VITE_APP_BASE_URL_DEV
    && config.customDev
  ) {
    //  替换url的请求前缀baseUrl
    config.baseURL = import.meta.env.VITE_APP_BASE_API_DEV
  }
  const token = useAuthorization()

  if (token.value && config.token !== false) {
    config.headers.set(STORAGE_AUTHORIZE_KEY, token.value)
  }
   
  const params = Object.assign({}, config.params);
  for (const key in params) {
    if (!params[key]) {
      delete params[key];
    }
    if (deleteKeys.includes(key)) {
      delete params[key];
    }
  }
  config.params = params

  // 增加多语言的配置
  const { locale } = useI18nLocale()
  config.headers.set('Accept-Language', locale.value ?? 'zh-CN')
  if (config.loading)
    axiosLoading.addLoading()
  return config
}

function responseHandler(response: any): ResponseBody<any> | AxiosResponse<any> | Promise<any> | any {
  if(response.data.code!=0){
    return errorHandler({
      toJSON(): object {
        return {}
      },
      isAxiosError: false,
      status: response.data.code,
      cause: undefined,
      name: "",
      stack: "",
      response:response,
      code: "",
      request:response.request,
      message:response.data.msg
    })
  }
  return response.data
}

function errorHandler(error: AxiosError): Promise<any> {
  console.log('error',  error)
  const token = useAuthorization()
  const notification = useNotification()
  const { data, status, statusText } = error.response as AxiosResponse<ResponseBody>

  if(status === 200 &&data?.code === 500){
    notification?.error({
      message: '500',
      description: data?.msg || statusText,
      duration: 3,
    })
  }

  if (status === 401) {
    // notification?.error({
    //   message: '401',
    //   description: data?.msg || statusText,
    //   duration: 3,
    // })
    /**
     * 这里处理清空用户信息和token的逻辑，后续扩展
     */
    token.value = null
    router
        .push({
          path: '/login',
          query: {
            redirect: router.currentRoute.value.fullPath,
          },
        })
        .then(() => {})
  }
  else if (status === 403) {
    // notification?.error({
    //   message: '403',
    //   description: data?.msg || statusText,
    //   duration: 3,
    // })
  }
  else if (status === 500) {
    notification?.error({
      message: '500',
      description: data?.msg || statusText,
      duration: 3,
    })
  }
  else {
    // notification?.error({
    //   message: '服务错误',
    //   description: data?.msg || statusText,
    //   duration: 3,
    // })
  }
  return Promise.reject(data)
}
interface AxiosOptions<T> {
  url: string
  params?: T
  data?: T
}
instance.interceptors.request.use(requestHandler)

instance.interceptors.response.use(responseHandler, errorHandler)

export default instance
function instancePromise<R = any, T = any>(options: AxiosOptions<T> & RequestConfigExtra): Promise<ResponseBody<R>> {
  const { loading } = options
  return new Promise((resolve, reject) => {
    instance.request(options).then((res) => {
      resolve(res as any)
    }).catch((e: Error | AxiosError) => {
      reject(e)
    })
      .finally(() => {
        if (loading)
          axiosLoading.closeLoading()
      })
  })
}
export function useGet< R = any, T = any>(url: string, params?: T, config?: AxiosRequestConfig & RequestConfigExtra): Promise<ResponseBody<R>> {
  const options = {
    url,
    params,
    method: RequestEnum.GET,
    ...config,
  }
  return instancePromise< R, T >(options)
}

export function usePost< R = any, T = any>(url: string, data?: T,params?:any, config?: AxiosRequestConfig & RequestConfigExtra): Promise<ResponseBody<R>> {
  const options = {
    url,
    data:data,
    params:params,
    method: RequestEnum.POST,
    ...config,
  }
  return instancePromise< R, T >(options)
}

export function usePut< R = any, T = any>(url: string, data?: T,params?:any, config?: AxiosRequestConfig & RequestConfigExtra): Promise<ResponseBody<R>> {
  const options = {
    url,
    data:data,
    params:params,
    method: RequestEnum.PUT,
    ...config,
  }
  return instancePromise<R, T>(options)
}

export function useDelete< R = any, T = any>(url: string, data?: T, config?: AxiosRequestConfig & RequestConfigExtra): Promise<ResponseBody<R>> {
  const options = {
    url,
    data,
    method: RequestEnum.DELETE,
    ...config,
  }
  return instancePromise<R, T>(options)
}
