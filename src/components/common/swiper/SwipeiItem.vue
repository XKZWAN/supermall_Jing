<template>
  <div class="slide">
    <slot></slot>
  </div>

</template>

<script>
export default {
  name: "Slide"
}
</script>

<style>
  .slide {
    width: 100%;
    /* flex-shrink的默认值为1，如果没有显示定义该属性，将会自动按照默认值1在所有因子相加之后计算比率来进行空间收缩。 */
    flex-shrink: 0;
  }

  .slide img{
    width: 100%;
  }
</style>