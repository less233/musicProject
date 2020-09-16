<template>
  <div class="my">
    <!-- 背景 -->
    <div class="bg">
      <img class="auto-img" :src="userInfo.backgroundUrl" alt />
    </div>

    <!-- 用户背景 -->
    <div class="user-info">
      <!-- 已登录显示 -->
      <div v-if="isLogin" class="islogin" @click="toPersonal">
        <div class="icon">
          <img class="auto-img" :src="userInfo.avatarUrl" alt />
        </div>
        <div class="nickname">{{userInfo.nickname}}</div>
      </div>

      <!-- 未登录显示 -->
      <div v-else class="nologin">
        <div class="icon">
          <van-icon name="contact" />
        </div>
        <div class="nickname">登录立想手机电脑多端同步</div>

        <van-button plain type="info" @click="toLogin">立即登录</van-button>
      </div>
    </div>

    <!-- 项目 -->
    <box-component
      v-for="(item,index) in classifyData"
      :key="index"
      :title="item.title"
      @click="goPage(item.name)"
    ></box-component>
  </div>
</template>

<script>
import "@/assets/less/mainLess/my.less";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("primaryModule");
import boxComponent from "@/components/boxComponent.vue";

export default {
  components: {
    boxComponent,
  },

  computed: {
    ...mapState(["userInfo", "isLogin"]),
  },

  data() {
    return {
      // 二级分类导航栏数据
      classifyData: [
        {
          title: "我的喜欢",
          name: {
            name: "List",
            query: {
              url: "/likelist",
              name: "我喜欢的音乐",
            },
          },
        },
        {
          title: "私人FM",
          name: {
            name: "Player",
            query: {
              url: "/personal_fm",
              name: "私人FM",
            },
          },
        },
        {
          title: "最近播放",
          name: {
            name: "List",
            query: {
              name: "最近播放",
            },
          },
        },
      ],
    };
  },

  methods: {
    // 登录
    toLogin() {
      console.log("111");
      this.$router.push({ name: "Login" });
    },

    toPersonal() {
      this.$toast.loading({ duration: 0 });
      setTimeout(() => {
        this.$toast.clear();
        this.$router.push({ name: "Personal" });
      }, 600);
    },

    // 跳转至指定页面
    goPage(name) {
      console.log("goPage");
      this.$toast.loading();
      setTimeout(() => {
        this.$toast.clear();
        this.$router.push(name);
      }, 600);
    },
  },
};
</script>