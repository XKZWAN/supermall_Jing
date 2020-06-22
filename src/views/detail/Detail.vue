<template>
  <div id="detail">
    <detail-nav-bar/>
    <detail-swiper :top-images="topImages" />
    <!-- <div v-for="n in 10">{{n}}</div> 数字遍历-->
    <detail-base-info :goods = "goods"/>

  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import {getDetail, Goods} from "network/detail"
import DetailBaseInfo from './childComps/DetailBaseInfo'

import DetailSwiper from './childComps/DetailSwiper'
export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo
  },
  data() {
    return {
      id: null,
      topImages: [],
      goods: null
    }
  },
  created() {
    // console.log(this.$route.params);
    // 1. 保存传入的id
    this.id = this.$route.params.id
    // 2. 根据id请求详情数据
    getDetail(this.id).then(res => {
      //1.  获取顶部的图片轮播数据
      console.log(res);
      const data = res.list
      this.topImages = data.topImages

      // 2.获取商品信息
      // this.goods = new Goods(data.columns, data.shopInfo, data.price, data.oldPrice, data.discountDesc,data.title,data.services)
       this.goods = new Goods(data)
    })
  },
}
</script>

<style>

</style>