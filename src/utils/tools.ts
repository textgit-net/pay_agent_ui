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
let castKeys = ['isIgnoreDisable', 'limit', 'page', 'channelId']
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

//json扁平化
export function flatten (data: any): any{
  const result = {};
  console.log('Object.keys(x).length', )
  const isEmpty = (x) => Object.keys(x).length === 0;
  const recurse = (cur, prop) => {
      if (Object(cur) !== cur) {
          result[prop] = cur;
      } else if (Array.isArray(cur)) {
          const length = cur.length;
          for (let i = 0; i < length; i++) {
              recurse(cur[i], `${prop}[${i}]`);
          }
          if (length === 0) {
              result[prop] = [];
          }
      } else {
          if ( cur && !isEmpty(cur)) {
              Object.keys(cur).forEach((key) =>
                  recurse(cur[key], prop ? `${prop}.${key}` : key)
              );
          } else {
              result[prop] = {};
          }
      }
  };
  recurse(data, "");
  return result;
};

//json非扁平化
export function unflatten(data:any ):any {
  if (Object(data) !== data || Array.isArray(data)) {
      return data;
  }
  const regex = /\.?([^.\[\]]+)$|\[(\d+)\]$/;
  const props = Object.keys(data);
  let result, p;
  while ((p = props.shift())) {
      const match = regex.exec(p);
      let target;
      if (match.index) {
          const rest = p.slice(0, match.index);
          if (!(rest in data)) {
              data[rest] = match[2] ? [] : {};
              props.push(rest);
          }
          target = data[rest];
      } else {
          if (!result) {
              result = match[2] ? [] : {};
          }
          target = result;
      }
      target[match[2] || match[1]] = data[p];
  }
  return result;
};