<template>
  <div class="login">
    <!-- logo图标 -->
    <div class="logo">
      <span class="iconfont">&#xe502;</span>
    </div>

    <!-- 功能集合 -->
    <div class="function-gather">
      <!-- 按钮 -->
      <van-button :loading="loadReg" round @click="logging">一键登录</van-button>
      <van-button :loading="loadDisc" round plain hairline @click="toDiscover">立即体验</van-button>

      <!-- 第三方接口 -->
      <div class="thirdparty">
        <div class="tplb">
          <span class="iconfont">&#xe677;</span>
        </div>
        <div class="tplb">
          <span class="iconfont">&#xe658;</span>
        </div>
        <div class="tplb">
          <span class="iconfont">&#xe696;</span>
        </div>
        <div class="tplb">
          <span class="iconfont">&#xe673;</span>
        </div>
      </div>

      <!-- 协议 -->
      <div class="agreement">
        <div class="first">
          <div class="radio fl" @click="toggleAgree">
            <van-icon v-show="isAgree" name="success" />
          </div>
          <span>同意</span>
          <p>&lt;&lt;用户协议&gt;&gt;</p>
          <p>&lt;&lt;隐私政策&gt;&gt;</p>
          <p>&lt;&lt;儿童隐私政策&gt;&gt;</p>
        </div>
        <div>
          <!-- <p>&lt;&lt;中国联通认证服务协议&gt;&gt;</p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/accountLess/login.less";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("primaryModule");

export default {
  computed: {
    ...mapState(["isAgree"]),
  },

  data() {
    return {
      // // 是否同意协议
      // isAgree: false,
      // 登录按钮转圈圈
      loadReg: false,
      // 体验按钮转圈圈
      loadDisc: false,
    };
  },

  methods: {
    ...mapMutations(['changeAgree']),

    // 是否同意协议
    toggleAgree() {
      this.changeAgree();
    },

    // 立即体验
    toDiscover() {
      if (!this.isAgree) {
        this.$toast("请先同意用户协议");
        return;
      }

      new Promise((resolve, reject) => {
        this.loadDisc = true;
        setTimeout(() => {
          resolve();
        }, 500);
      }).then(() => {
        this.loadDisc = false;
        this.$router.push({ name: "Discover" });
      });
    },

    // 一键登录
    logging() {
      if (!this.isAgree) {
        this.$toast("请先同意用户协议");
        return;
      }

      new Promise((resolve, reject) => {
        this.loadReg = true;
        setTimeout(() => {
          resolve();
        }, 500);
      }).then(() => {
        this.loadReg = false;
        this.$router.push({ name: "Register" });
      });
    },
  },
};
</script>