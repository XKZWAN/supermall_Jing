import { request2 } from "./request";
export function getDetail(id) {
  return request2({
    url: '/home/detail',
    params: {
      id
    }
  })
}



export class Goods {
  constructor(list) {
    this.columns = list.columns
    this.desc = list.shopInfo
    this.newPrice = list.price
    this.oldPrice = list.oldPrice
    this.discount = list.discountDesc
    this.title = list.title
    this.services = list.services

  }
}

// class Person {
//   constructor(name, age){      //构造函数
//     this.name = name
//     this.age =age
//   }
// }
// const p = new Person('why','18')