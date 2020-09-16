<template>
  <div class="main">
    <!-- 导航标签 -->
    <van-nav-bar :border="false">
      <!-- 左边弹出层 -->
      <template #left>
        <div class="my-popup">
          <van-icon
            :style="{color:tabsActive==0?'white':'black'}"
            name="wap-nav"
            badge="23"
            @click="showMyPopup"
          />
        </div>
      </template>

      <!-- 标题导航栏 -->
      <template #title>
        <van-tabbar v-model="tabsActive" :fixed="false" @change="goPage">
          <van-tabbar-item
            :style="{color:tabsActive==0?'white':'black'}"
            v-for="(item, index) in tabbarData"
            :key="index"
          >{{item.title}}</van-tabbar-item>
        </van-tabbar>
      </template>

      <!-- 右边搜索框 -->
      <template #right>
        <van-icon
          :style="{color:tabsActive==0?'white':'black'}"
          class="my-search"
          name="search"
          @click="toSearch"
        />
      </template>
    </van-nav-bar>

    <!-- 弹出层标签 -->
    <van-popup v-model="myPopupShow" position="left" :style="{height:'100%'}">
      <!-- 弹出层背景图片 -->
      <div class="pop-bg">
        <img class="auto-img" :src="userInfo.backgroundUrl" alt />
      </div>

      <!-- 弹出层主要功能层 -->
      <div class="pop-contain">
        <!-- 已登录显示 -->
        <div v-if="this.isLogin">
          <div v-if="this.isLogin" class="islogin-box">
            <div class="user" @click="toPersonal">
              <div class="icon">
                <img :src="this.userInfo.avatarUrl" alt />
              </div>
              <div class="uname">{{this.userInfo.nickname}}</div>
            </div>
            <div class="check-ins" @click="checkins">
              <span class="iconfont">&#xe501;</span>
              <div class="text">签到</div>
            </div>
          </div>
          <van-button class="logout" type="danger" @click="logout">退出登录</van-button>
        </div>
        <!-- 未登录显示 -->
        <div v-else class="notlogin-box">
          <div class="prompt">手机电脑多端同步，尽享海量高品质音乐</div>
          <van-button color="#fe3a3b" round @click="toLogin">立即登录</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 加载提示 -->
    <van-loading v-if="isLoad" />

    <!-- 二级路由 -->
    <router-view />

    <!-- 底部播放器 -->
    <aimp-component></aimp-component>
  </div>
</template>

<script>
import "../assets/less/main.less";
import aimpComponent from "@/components/aimpComponent.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("primaryModule");

export default {
  components: {
    aimpComponent,
  },

  computed: {
    ...mapState(["isLogin", "userInfo"]),
  },

  data() {
    return {
      tabbarData: [
        {
          title: "我的",
          url: { name: "My" },
        },

        {
          title: "发现",
          url: { name: "Discover" },
        },

        // {
        //   title: "云村",
        //   url: { name: "CloudVillage" },
        // },

        // {
        //   title: "视频",
        //   url: { name: "Video" },
        // },
      ],

      myPopupShow: false,
      tabsActive: 1,
      isLoad: false,
    };
  },

  methods: {
    ...mapMutations(["changeLogin"]),

    //显示弹出层myPopupShow
    showMyPopup() {
      this.myPopupShow = true;
      console.log(this.userInfo);
    },

    // 跳转路由
    goPage(index) {
      this.$router.push(this.tabbarData[index].url);
    },

    // 签到
    checkins() {
      this.$toast("签到成功");
    },

    // 登录
    toLogin() {
      console.log("111");
      this.$router.push({ name: "Login" });
    },

    // 跳转至个人页面
    toPersonal() {
      this.isLoad = true;
      setTimeout(() => {
        this.isLoad = false;
        this.$router.push({ name: "Personal" });
      }, 800);
    },

    // 搜索
    toSearch() {
      this.$router.push({ name: "Search" });
    },

    // 退出登录
    logout() {
      this.changeLogin(false);
      localStorage.clear();
    },
  },

  mounted() {
    if (this.$route.name == "My") {
      this.tabsActive = 0;
    }
  },
};
</script>