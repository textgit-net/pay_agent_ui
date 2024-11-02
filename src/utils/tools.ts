import { get } from 'lodash-es'
import router from '@/router'
import queryString from 'query-string'

export function getQueryParam(param: string | string[], defaultVal = '') {
  const query = router.currentRoute.value?.query ?? {}
  const val = get(query, param) ?? defaultVal
  return decodeURIComponent(val)
}

// 处理地址添加参数【不刷接口】
export function updateParamsToUrl (query: any = {}) {
  query = JSON.parse(JSON.stringify(query))
  // 获取当前URL
  let url = window.location.href;
  let search = window.location.search;
  let searchJson = queryString.parse(search)
  let newSearchJson = Object.assign(searchJson, query)
  console.log('window.location', window.location, searchJson)
  // 修改query参数
  let newQuery = queryString.stringify(query)
  // 拼接新的URL
  if (newQuery) {
    let newUrl = url.split('?')[0] + '?' + newQuery ;
    // 修改地址栏URL
    
    history.replaceState(null, null, newUrl);
  }
}

// 获取Url参数
// 强制转类型的字段
let castKeys = ['isIgnoreDisable', 'limit', 'page']
export function getParamsFromUrl () {
  let search = window.location.search;
  let json = queryString.parse(search)
  if (json) {
    for (let key in json) {
      if (castKeys.includes(key)) {
        json[key] = eval(json[key] as string)
      }
    }
  }
  return json ?? null
}