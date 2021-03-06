// 不要使用default,default只能导出一个
import axios from 'axios'

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8000',
    timeout: 5000
  })

  // 2. axios的拦截器
  // 2.1 请求拦截的作用
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log(err);
  })

  // 2.2 响应拦截
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res.data //拦截了数据之后要把数据返回回去
  }, err => {
    console.log(err);

  })

  // 3. 发送真正的网络请求
  return instance(config)

}
export function request2(config) {
  const instance2 = axios.create({
    baseURL: 'http://127.0.0.1:1000',
    timeout: 5000
  })
  instance2.interceptors.request.use(config => {
    return config
  }, err => {
    console.log(err);
  })

  // 2.2 响应拦截
  instance2.interceptors.response.use(res => {
    // console.log(res);
    return res.data //拦截了数据之后要把数据返回回去
  }, err => {
    console.log(err);
  })

  return instance2(config)
}