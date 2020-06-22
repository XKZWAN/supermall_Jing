<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl2" />
      <goods-list :goods="showGoods" />
    </scroll>
    <!-- 组件不能直接监听点击 -->
    <!-- .native 监听组件根元素的原生事件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
// 导入的文件要区分清楚 方便管理

import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommedView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/untils";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      // result: null
      banners: [],
      recommends: [],
      goods: {
        pop: { pageIndex: 0, list: [] },
        new: { pageIndex: 0, list: [] },
        sell: { pageIndex: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: true,
      tabOffestTop: 0,
      isTabFixed: false,
      saveY: 0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  destroyed() {
    console.log("home destroyed");
  },
  activated() {
    //再进来
    
    // console.log(this.saveY)
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.saveY, 0);

  },//那个scrollto是better-scroll插件的
  deactivated() {
    //离开
    // console.log(this.$refs.scroll.getScrollY());
    this.saveY = this.$refs.scroll.getScrollY();

    // console.log(this.saveY);
  },

  created() {
    //只写主要逻辑
    // 1. 请求多个数据
    // getHomeMultidata().then(res => {
    //   this.banners = res.data.banner.list
    //   this.recommends = res.data.recommend.list
    //   console.log(res);
    this.getHomeMultidata();
    // });
    // 2. 请求商品数据
    // getHomeGoods('pop',1).then(res=> {
    //   console.log(res);

    // });
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    // 1. 图片加载完成的事件监听
    // setTimeot在整个循环完成后执行
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    // 监听item中图片加载完成  最好不要在created中写

    this.$bus.$on("itemImageLoad", () => {
      // console.log('----------');
      // 1.
      // 2.
      // this.$refs.scroll.refresh();
      // console.log("----------");
      refresh();
    });
  },
  methods: {
    // 事件监听相关的方法
    // 防抖函数  func = this.$refs.Scroll.refresh()
    // debounce(func, delay) {
    //   let timer = null;
    //   return function(...args) {
    //     if (timer) clearTimeout(timer);
    //     timer = setTimeout(() => {
    //       func.apply(this, args);
    //     }, delay);
    //   };
    // },
    tabClick(index) {
      // console.log(index);
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      // console.log('backClick');
      this.$refs.scroll.scrollTo(0, 0);
    },
    contentScroll(position) {
      // console.log(position);
      // 1. 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;

      // 2. 决定tabControl是否吸顶（position：fixed）
      this.isTabFixed = -position.y > this.tabOffestTop;
    },
    loadMore() {
      // console.log('上拉加载更多');
      this.getHomeGoods(this.currentType);
      // 重新计算可滚动的区域
      // this.$refs.scroll.scroll.refresh( )
      // console.log('加载更多的方法');
    },
    swiperImageLoad() {
      // 获取tabControl的offsetTop
      // 所有的组件都有一个属性$el:用于获取组件中的元素
      this.tabOffestTop = this.$refs.tabControl2.$el.offsetTop;
    },
    // 网络请求相关的方法
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        // console.log(res);
        // this.result = res
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const pageIndex = this.goods[type].pageIndex + 1;
      getHomeGoods(type, pageIndex).then(res => {
        // console.log(res);

        this.goods[type].list.push(...res.list.homeFind); //...可以将数组中的元素一个一个取出来，然后push到数组中
        this.goods[type].pageIndex += 1; //页码 +1

        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
/* scoped属性 ： 对当前的属性起效果 */
/* #home {
   padding-top: 44px; 
   vh -> viewport height 视口   
    100vh：代表100%的视口
   
  height: 100vh;
} */
#home {
  /* padding-top: 44px; */
  /* vh -> viewport height 视口   
    100vh：代表100%的视口
   */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: white;
  /*  在使用浏览器原生滚动时， 为了让导航不跟随一起滚动  */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
/* .tab-control {
  	很多浏览器不支持
粘性定位，该定位基于用户滚动的位置。
它的行为就像 position:relative; 而当页面滚动超出目标区域时，
它的表现就像 position:fixed;,它会固定在目标位置。  
  position: sticky;

  top: 44px;

  z-index: 9;
} */
.content {
  /* height: 300px; */
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control {
  position: relative;
  /* 只对定位元素起效果 */
  z-index: 9;
}
/* .content{
  height: calc(100% - 93px) ;
  overflow: hidden;
  margin-top: 44px;
} */
</style>

