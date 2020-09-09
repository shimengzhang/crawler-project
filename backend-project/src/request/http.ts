import qs from 'qs';

let baseURL = ''

let baseURLArr = [{
  type: 'development',
  url: 'http://127.0.0.1:3000'
},{
  type: 'test',
  url: 'http://127.0.0.1:3000'
},{
  type: 'production',
  url: 'http://127.0.0.1:3000'
}]

baseURLArr.forEach(item=>{
  if(process.env.NODE_ENV === item.type){
    baseURL = item.url;
  }
})

interface optionsType extends RequestInit {
  params?: {};
  headers?: any;
  type?: string;
}

export default function request(url:string, options:optionsType = {}) {
  url = baseURL + url;
  /** 
   * GET 系列请求
  */
  !options.method ? options.method = 'GET': null;
  if(options.hasOwnProperty('params')){
    if(/^(GET|DELETE|HEAD|OPTION)$/i.test(options.method)){
      const ask = url.includes('?')?'&':'?';
      url += `${ask}${qs.stringify(options.params)}`
    }
    delete options.params; // 因为 params 不是 fetch 自带的配置项，所以需要删除
  }

  /** 
   * 合并配置项
  */
  options = Object.assign({
    // 允许跨域携带资源凭证  
    // axios 设置 true 就可以
    // fetch 有三个值可设置，include: 同源和跨域都可以；same-origin: 同源可以(默认值); omit: 都拒绝
    credentials: 'include',
    // 设置请求头
    headers: {}
  }, options);

  // 允许接受的头类型，不加也可以
  options.headers.Accept = 'application/json';

  /** 
   * token 的校验(fetch 没有拦截器，就自己写)
  */
  const token = localStorage.getItem('token');
  token && (options.headers.Authorization = token);

  /** 
   * POST 请求处理
  */
  if(/^POST|PUT$/i.test(<string>options.method)){
    !options.type?options.type = 'urlencoded': null;
    if(options.type === 'urlencoded'){
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.body = qs.stringify(options.body)
    }
    if(options.type === 'json'){
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body)
    }
  }

  // 处理响应结果
  // 注意：fetch 和 axios 不同，fetch是只要服务器返回了，不管状态码是什么都走成功方法
  return fetch(url, options).then(response=>{
    // 返回的结果可能是非 200 状态码
    if(!/^(2|3)\d{2}$/.test(String(response.status))){
      switch(response.status){
        case 401: // 当前请求用户需要验证（一般是未登录）
          break;
        case 403: // 服务器拒绝执行，一般 token 过期，或 session 过期
          localStorage.removeItem('token')
          // 跳转到登录页
          break;
        case 404: // 找不到地址
          break;
      }
      // 不想单独处理的非正常状态码
      return Promise.reject(response)
    }
    return response.json();
  }).catch(error=>{
    if(!window.navigator.onLine){
      // 断网处理，可以跳转到断网页面
      return
    }
    // 服务器崩了
    return Promise.reject(error)
  })
}