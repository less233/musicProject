<template>
  <div class="personal">
    <nav-component />

    <!-- 个人背景 -->
    <div class="bg">
      <img src="https://p2.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg" alt="">

      <!-- 头像 -->
      <div class="touxiang">
        <img :src="this.userInfo.avatarUrl" alt="">
      </div>
      <!-- 昵称 -->
      <div class="nickname">
        {{this.userInfo.nickname}}
      </div>
    </div>

    
  </div>
</template>

<script>
import "../../assets/less/accountLess/personal.less";
import navComponent from "@/components/navComponent.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("primaryModule")

export default {
  components: {
    navComponent
  },

  computed: {
    ...mapState(['userInfo'])
  },

  data() {
    return {

    }
  }
};
</script>
