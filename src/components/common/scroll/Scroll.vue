<template>
  <!-- ref/children(一般绑定给子组件) -> -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    };
  },
  mounted() {
    // 这样处理不好，如果有很多wrapper，获取的wrapper不明确  querySelector获取的wrapper是第一个
    // this.scroll = new BScroll(document.querySelector('.wrapper'), {

    // })

    // 1. 创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      taps: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    });

    // 2. 监听滚动的位置
    if (this.probeType == 2 || this.probeType == 3) {
      this.scroll.on("scroll", position => {
        // console.log(position);
        this.$emit("scroll", position);
      });
    }

    // console.log(this.scroll);

    // 3. 监听上拉事件
    // this.scroll.on("pullingUp", () => {
    //   // console.log('上拉加载更多');
    //   this.$emit("pullingUp");
    // });

    //3. 监听scroll滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        // console.log('监听到滚动到底部');
        this.$emit('pullingUp')
      });
    }
  },
  methods: {
    // 先判断this.scroll是否已加载出来，如果未加载出来就进行调用， 会出现报错
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
};
</script>

<style>

</style>