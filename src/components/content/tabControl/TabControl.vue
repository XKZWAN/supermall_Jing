<template>
  <div class="tab-control">
    <!-- 只是文字不一样的时候  没有必要slot标签 -->
    <div v-for="(item, index) in titles" :key="index" class="tab-control-item" :class="{active: index === currentIndex}" @click="itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      // 内部发生事件往外传
      this.$emit('tabClick', index)
    }
  },
}
</script>

<style>
  .tab-control {
    display: flex;
    text-align: center;
    font-size: 15px;
    background-color: #fff;
  }
  .tab-control-item {
    flex: 1;
    height: 40px;
    line-height: 40px;
  }
  .tab-control-item span {
    padding: 5px;
  }
  .active {
    /* 文字颜色高亮显示 */
    color: var(--color-high-text);
  }
  .active span {
    border-bottom: 3px solid var(--color-tint);
  }
</style>