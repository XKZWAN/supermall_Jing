<template>
  <div id="hy-swiper">
    <!-- 触摸事件 touchstart、touchmove、touchend -->
    <div class="swiper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
      <slot></slot>
    </div>
    <slot name="indicator"></slot>
    <div class="indicator">
      <slot name="indicator" v-if="showIndicator && slideCount>1">
        <div
          v-for="(item,index) in slideCount"
          class="indi-item"
          :class="{active: index === currentIndex-1}"
          :key="index"
        ></div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Swiper",
  props: {
    interval: {
      type: Number,
      default: 3000
    },
    animDuration: {
      //延迟
      type: Number,
      default: 2000
    },
    moveRatio: {
      //比例 用户滚动图片的比例
      type: Number,
      default: 0.25
    },
    showIndicator: {
      //轮播图是否展示
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      slideCount: 0, //元素个数
      totalWidth: 0, //swiper的宽度
      currentIndex: 1, //当前的index
      scrolling: false //是否正在滚动
    };
  },
  // 初始化页面完成后使用mounted可以直接操作DOM界面
  mounted() {
    setTimeout(() => {
      // 1. 操作DOM，在前后添加Slide
      this.handleDom();

      // 2. 开启定时器
      this.startTimer();
    }, 1000);
  },
  methods: {
    // 定时操作
    startTimer: function() {
      this.playTimer = window.setInterval(() => {
        //playTimer可以在data中定义
        this.currentIndex++;
        this.scrollContent(-this.currentIndex * this.totalWidth);
      }, this.interval);
    },
    stopTimer: function() {
      // clearInterval() 方法可取消由 setInterval() 函数设定的定时执行操作。
      // clearInterval() 方法的参数必须是由 setInterval() 返回的 ID 值。
      // 注意: 要使用 clearInterval() 方法, 在创建执行定时操作时要使用全局变量：
      window.clearInterval(this.playTimer);
    },

    // 滚动到正确位置
    scrollContent: function(currentPosition) {
      // 0. 设置正在滚动
      this.scrolling = true;

      // 1. 开始滚动动画
      this.swiperStyle.transition = "transform" + this.animDuration + "ms";
      this.setTransform(currentPosition);

      // 2. 判断滚动到的位置
      this.checkPosition();

      // 3. 滚动完成
      this.scrolling = false;
    },

    // 校验正确的位置
    checkPosition: function() {
      window.setTimeout(() => {
        // 1.校验正确的位置
        this.swiperStyle.transition = "0ms";
        if (this.currentIndex >= this.slideCount + 1) {
          this.currentIndex = 1;
          this.setTransform(-this.currentIndex * this.totalWidth);
        } else if (this.currentIndex <= 0) {
          this.currentIndex = this.slideCount;
          this.setTransform(-this.currentIndex * this.totalWidth);
        }

        // 2. 结束移动后的回调
        this.$emit("transitionend", this.currentIndex - 1);
      }, this.animDuration);
    },

    // 设置滚动的位置
    setTransform: function(position) {
      this.swiperStyle.transform = `translate3d(${position}px, 0, 0)`;
      this.swiperStyle[
        "-webkit-transform"
      ] = `translate3d(${position}px), 0, 0`;
      this.swiperStyle["ms-transform"] = `translate3d(${position}px), 0, 0`;
    },

    // 操作DOM，在DOM前后添加Slide
    handleDom: function() {
      // 1. 获取要操作的元素  querySelector() 方法仅仅返回匹配指定选择器的第一个元素。
      let swiperEl = document.querySelector(".swiper"); //最好不要这样做
      let slidesEls = swiperEl.getElementsByClassName("slide");
      // 2. 保存个数
      this.slideCount = slidesEls.length;
      // console.log(swiperEl);

      // 3. 如果大于1个，那么在前后分别添加一个slide
      if (this.slideCount > 1) {
        let cloneFirst = slidesEls[0].cloneNode(true);
        // cloneNode() 方法 拷贝所有属性和值。
        let cloneLast = slidesEls[this.slideCount - 1].cloneNode(true);
        swiperEl.insertBefore(cloneLast, slidesEls[0]); //insertBefore() 方法可在已有的子节点前插入一个新的子节点。
        swiperEl.appendChild(cloneFirst); //appendChild() 方法可向节点的子节点列表的末尾添加新的子节点。
        this.totalWidth = swiperEl.offsetWidth;

        this.swiperStyle = swiperEl.style;
        // console.log(this.swiperStyle);
      }
      // 4. 让swiper元素，显示第一个（目前是显示前面添加的最后一个元素）
      this.setTransform(-this.totalWidth);
    },
    // 拖动事件的处理
    touchStart: function(e) {
      // 1. 如果正在滚动，不可以拖动
      if (this.scrolling) {
        return;
      }
      // 2. 停止计时器
      this.stopTimer();
      // 3. 保存开始滚动的位置
      this.startX = e.touches[0].pageX;
    },
    // 当手指在屏幕上滑动的时候连续地触发
    touchMove: function(e) {
      // 1. 计算用户拖动的距离
      this.currentX = e.touches[0].pageX;
      // console.log(e);

      this.distance = this.currentX - this.startX;
      // console.log(this.distance);

      let currentPosition = -this.currentIndex * this.totalWidth;
      // console.log(currentPosition);

      let moveDistance = this.distance + currentPosition;
      // console.log(moveDistance);

      // 2. 设置当前的位置
      this.setTransform(moveDistance);
      // console.log(this.setTransform);
    },

    // 当手指从屏幕上离开的时候触发。
    touchEnd: function(e) {
      // 1. 获取移动的距离
      let currentMove = Math.abs(this.distance);
      // console.log(currentMove);
      
      // 2. 判断最终的距离
      if (this.distance === 0) {
        return;
      } else if ((this.distance > 0) && (currentMove > (this.totalWidth * this.moveRatio))) {
        //右边移动超过0.5
        this.currentIndex--;
        // console.log((this.distance > 0) && (currentMove > (this.totalWidth * this.moveRatio)));
        
      } else if ((this.distance < 0) && (currentMove > (this.totalWidth * this.moveRatio))) {
        //向左移动超过0.5
        this.currentIndex++;
      }

      // 3. 移动到正确的位置
      this.scrollContent(-this.currentIndex * this.totalWidth);
      // console.log(this.scrollContent);
      

      // 4. 移动到正确的位置
      this.startTimer();
    },

    // 控制上一个，下一个
    previous: function() {
      this.changeItem(-1);
      console.log(this.changeItem);
      
    },
    next: function() {
      this.changeItem(1);
    },
    changeItem: function(num) {
      // 1.移除定时器
      this.stopTimer();
      // 2. 修改index和位置
      this.currentIndex += num;
      this.scrollContent(-this.currentIndex * this.totalWidth);
      // 3. 添加定时器
      this.startTimer();
    }
  }
};
</script>

<style>
#hy-swiper {
  /* overflow 属性规定当内容溢出元素框时发生的事情。 
     hidden: 	内容会被修剪，并且其余内容是不可见的。 */
  overflow: hidden;
  position: relative;
}
.swiper {
  display: flex;
}
.indicator {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  bottom: 8px;
}
.indi-item {
  /* box-sizing: border-box;为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。 */
  box-sizing: border-box;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: white;
  line-height: 8px;
  text-align: center;
  font-size: 12px;
  margin: 0 5px;
}
.indi-item.active {
  background-color: rgba(212, 62, 46, 1);
}
</style>