<template>
  <div id="myc-nav" :style="{color:color}">
    <!-- 返回icon -->
    <div class="myc-left" @click="goBack">
      <van-icon class="myc-icon" name="down" />
    </div>

    <!-- 标题 -->
    <div class="myc-title">{{title}}</div>

    <!-- 标题插槽 -->
    <slot name="title"></slot>
  </div>
</template>

<script>
export default {
  name: "navComponent",

  props: {
    title: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "black",
    },
  },

  methods: {
    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },

    // 判断是否存在插槽
  },

  created() {
    console.log("slot", this.$scopedSlots);
  },
};
</script>

<style lang="less" scoped>
#myc-nav {
  height: 46px;
  display: flex;
  align-items: center;

  .myc-left {
    width: 46px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;

    .myc-icon {
      transform: rotate(90deg);
      font-size: 20px;
    }
  }

  .myc-title {
    font-size: 16px;
    font-weight: bold;
    
  }
}
</style>