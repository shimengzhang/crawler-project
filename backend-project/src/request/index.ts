import axios from 'axios';
import qs from 'qs';

/**
 * 根据环境变量区分请求地址
 */
switch(process.env.NODE_ENV){
  case "production": // 生产环境
    axios.defaults.baseURL = "http://127.0.0.1:3000";
    break;
  case "test":// 测试环境
    axios.defaults.baseURL = "http://127.0.0.1:3000";
    break;
  default: // 开发环境
    axios.defaults.baseURL = "http://127.0.0.1:3000";
}

/**
 * 设置超时时间和跨域是否允许携带凭证
 */
axios.defaults.timeout = 10000; // 10s
axios.defaults.withCredentials = true;

/** 
 * 设置 POST 请求头，告知服务器请求主体的数据格式
 * 注：要看服务器要求什么格式，一般是 x-www-form-urlencoded
 * axios.post(url, data)
 * application/json: data 的格式 json 对象
 * application/x-www-form-urlencoded: data 的格式 xxx=xxx&xxx=xxx 这样的字符串格式
*/
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// transformRequest 只对 POST 起作用
axios.defaults.transformRequest = data=>qs.stringify(data)

/** 
 * 设置请求拦截器
 * 比如 TOKEN 校验（JWT），接收服务器返回的 token ，存储到 vuex、redux 或本地存储
 * 每一次向服务器发请求，应该把 token 带上，否则可能返回 403
*/
axios.interceptors.request.use((config)=>{
  // 成功拦截
  // 携带上 token，假设存在本地
  let token = localStorage.getItem('token')
  token && (config.headers.Authorization = token) // 和下面等价
  // token && (axios.defaults.headers['Authorization'] = token)
  return config;
}, (error)=>{
  // 失败拦截
  return Promise.reject(error)
});

/** 
 * 自定义响应成功的 HTTP 状态码
 * 这个方法默认是 status >= 200 && status < 300，也就是 2 开头的状态码，才返回 true
 * 很多公司一般都不配这个方法，因为接口处理一般很少出现 3 开头的码
*/
axios.defaults.validateStatus = status=>{
  return /^(2|3)\d{2}$/.test(String(status));
}
/** 
 * 设置响应拦截器
 * validateStatus 为 true，走成功拦截；为 false 走失败拦截
*/
axios.interceptors.response.use((response)=>{
  // 成功拦截
  // response 结构：data:[] status:2xx statusText:'OK' headers:{} config:{}->请求提供的配置信息
  return response.data;
},(error)=>{
  // 失败拦截
  let {response} = error;
  if(response){
    // 服务器最起码返回结果了
    switch(response.status){
      case 401: // 当前请求用户需要验证（一般是未登录）
        break;
      case 403: // 服务器拒绝执行，一般 token 过期，或 session 过期
        break;
      case 404: // 找不到地址
        break;
    }
  }else{
    // 服务器连结果都没有返回：服务器崩了，或客户端没有网
    if(!window.navigator.onLine){
      // 断网处理，可以跳转到断网页面
      return
    }
    // 服务器崩了
    return Promise.reject(error)
  }
  
})

export default axios;