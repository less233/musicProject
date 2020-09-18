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
    <div class="contain">
      <div class="fill"></div>

      <!-- 我的音乐 -->
      <div class="classify">
        <div class="title">我的音乐</div>
        <div class="content">
          <div
            class="box fl"
            v-for="(item,index) in classifyData"
            :key="index"
            @click="goPage(item.name)"
          >
            <van-icon :name="item.icon" :color="item.iconColor" />
            <div class="text">{{item.title}}</div>
          </div>
        </div>
      </div>

      <!-- 最近播放 -->
      <div class="classify">
        <div class="title">最近播放</div>

        <div class="lately">
          <div
            class="box fl"
            v-for="(item,index) in latelyListData"
            :key="index"
            @click="goPage(item.name)"
          >
            <div class="left">
              <img class="auto-img" :src="item.img" alt />
              <div class="icon">
                <van-icon name="play" />
              </div>
            </div>
            <div class="right">
              <div class="van-multi-ellipsis--l2">{{item.title}}</div>
              <div>{{item.subhead}}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐歌单 -->
      <div class="classify">
        <div class="title">推荐歌单</div>

        <div class="lately personalize">
          <div
            class="box fl"
            v-for="(item,index) in personalizeData"
            :key="index"
            @click="toList(item)"
          >
            <div class="left">
              <img class="auto-img" :src="item.picUrl" alt />
            </div>
            <div class="right">
              <div class="van-ellipsis">{{item.name}}</div>
              <div class="van-ellipsis">{{item.copywriter}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/less/mainLess/my.less";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("primaryModule");

export default {
  computed: {
    ...mapState(["userInfo", "isLogin"]),
  },

  data() {
    return {
      // 二级分类导航栏数据
      classifyData: [
        {
          title: "我的喜欢",
          icon: "like",
          iconColor: "#ff553e",
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
          icon: "audio",
          iconColor: "#fff",
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
          icon: "graphic",
          iconColor: "#202028",
          name: {
            name: "List",
            query: {
              name: "最近播放",
            },
          },
        },
      ],

      // 最近播放
      latelyListData: [
        {
          title: "全部已播歌曲",
          subhead: "100首",
          img: "",
          name: {
            name: "List",
            query: {
              url: "/user/record",
              name: "全部已播歌曲",
            },
          },
        },
        {
          title: "歌单：云音乐热歌榜",
          subhead: "继续播放",
          img: "",
          name: {
            name: "List",
            query: {
              id: 1,
              url: "/playlist/detail",
              name: "云音乐热歌榜",
            },
          },
        },
      ],

      // 推荐歌单
      personalizeData: [],
    };
  },

  methods: {
    // 登录
    toLogin() {
      console.log("111");
      this.$router.push({ name: "Login" });
    },

    // 跳转至个人页面
    toPersonal() {
      this.$toast.loading({ duration: 0 });
      setTimeout(() => {
        this.$toast.clear();
        this.$router.push({ name: "Personal" });
      }, 600);
    },

    // 推荐歌单跳转到list面
    toList(item) {
      this.$toast.loading();
      setTimeout(() => {
        this.$toast.clear();
        this.$router.push({
          name: 'List',
          query: {
            url: "/playlist/detail",
            id: item.id,
            name: item.name,
          },
        });
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

    // 获取最近播放图片
    async getModel() {
      this.$toast.loading({ duration: 0 });

      await this.axios({
        method: "GET",
        url: "/user/record",
        params: {
          uid: this.userInfo.userid,
        },
      })
        .then((result) => {
          console.log(result);
          if (result.data.code != 200) return;
          this.latelyListData[0].img = result.data.allData[0].song.al.picUrl;
        })
        .catch((err) => {});

      await this.axios({
        method: "GET",
        url: "/recommend/resource",
        params: {
          cookie: localStorage.getItem("cookie"),
          uid: this.userInfo.userid,
        },
      })
        .then((result) => {
          console.log(result);
          if (result.data.code != 200) return;
          this.latelyListData[1].title = result.data.recommend[0].name;
          this.latelyListData[1].img = result.data.recommend[0].picUrl;
          this.latelyListData[1].name.query.id = result.data.recommend[0].id;
          this.latelyListData[1].name.query.name =
            result.data.recommend[0].name;
        })
        .catch((err) => {});
      this.$toast.clear();
    },

    // 获取最近歌单
    getPersonalize() {
      // this.$toast.loading({ duration: 0 });
      this.axios({
        method: "GET",
        url: "/personalized",
        params: {
          limit: 6,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log(result);

          if (result.data.code != 200) return;
          this.personalizeData = result.data.result;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },

  mounted() {
    this.getModel();
    this.getPersonalize();
  },
};
</script>