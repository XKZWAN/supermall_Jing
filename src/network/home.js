import { request } from "./request";

// 对首页数据请求的封装
export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    parms: {
      type,
      page
    }
  })
}
// 函数调用 -> 压入函数栈（保存函数调用过程中所有变量）
// 函数调用结束 -> 弹出函数栈（释放函数所有的变量）
// function test(params) {
//   const names = ['why', 'aaa']
// }
// test()