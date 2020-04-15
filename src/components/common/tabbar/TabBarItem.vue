<template>
  <!-- 所有的item都展示同一个图片，同一个文字 -->
  <!-- 不要把要添加在slot中的样式直接写在slot标签中 -->
  <div class="tab-bar-item" @click="itemClick">
    <!-- 不活跃的时候展示 -->
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>

    <!-- 活跃状态的时候展示 -->
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>

    <!-- <div :class="{active:isActive}"> -->
      <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>

    <!-- <slot :class="{active:isActive}" name="item-text"></slot>  -->
    <!-- <img src="../../assets/img/tabbar/home.svg" alt />
    <div>首页</div>-->
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'tomato'
    }
  },
  data() {
    return {
      // isActive: true
    }
  },
  computed: {
    isActive() {
      //判断现在活跃的path是否包括这个path
      // /home -> item1(/home) =true
      // /home -> item1(/catetory) =false
      // /home -> item1(/cart) =false
      // /home -> item1(/profile) =false

      // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
      // console.log(this.$route.path.indexOf(this.path));
      
      return this.$route.path.indexOf(this.path) !== -1

    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {}
    }
  },
  methods: {
    itemClick() {
      // console.log('itemClick');
      this.$router.replace(this.path);
    }
  }
};
</script>

<style>
.tab-bar-item {
  /* 均等分 */
  flex: 1;
  height: 49px;
  text-align: center;
  font-size: 14px;
}
.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  /* 去掉图片默认的3px */
  vertical-align: middle;
  margin: 3px;
}
/* .active {
  color: tomato;
} */
</style>