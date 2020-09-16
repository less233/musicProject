<template>
  <div class="myc-box">
    <div ref="box" class="my-option box" @click="clickBox">
      <div class="text">{{title}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "boxComponent",

  props: {
    title: {
      type: String,
      default: "",
    },
  },

  methods: {
    clickBox() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="less" scoped>
.myc-box {
  .box {
    user-select: none;
    background-color: #e0ece4;
    height: 80px;
    margin: 15px 10px;
    border-radius: 10px;
    color: #444;
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .text {
      position: absolute;
      z-index: 9;
    }

    .point {
      width: 10px;
      height: 10px;
      position: absolute;
      background-color: rgba(238, 10, 36, 0.8);
      border-radius: 50%;
      top: 0;
      left: 0;
      transform: scale(1);
      visibility: hidden;
      z-index: 0;
    }
  }
}
</style>