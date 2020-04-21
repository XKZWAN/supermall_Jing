<template>
  <div class="goods">
    <goods-list-item v-for="(item,index) in goods" :key="index"/>
    {{goods}}
     <!-- <ul>
      <li>商品列表1</li>
      <li>商品列表2</li>
      <li>商品列表3</li>
      <li>商品列表4</li>
      <li>商品列表5</li>
      <li>商品列表6</li>
      <li>商品列表7</li>
      <li>商品列表8</li>
      <li>商品列表9</li>
      <li>商品列表10</li>
    </ul> -->
  </div>
</template>

<script>
import GoodsListItem from 'components/content/goods/GoodsListItem'
export default {
  name: 'GoodsList',
  props: {
    type: Array,
    default() {
      return []
    }
  },
  components: {
    GoodsListItem
  }
}
</script>

<style>

</style>