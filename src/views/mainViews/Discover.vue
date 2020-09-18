<template>
  <div class="discover">
    <!-- 轮播图标签 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in bannerData" :key="index" @click="goBanner(item.url)">
        <div class="contain">
          <img :src="item.pic" class="auto-img" />
          <label>{{item.typeTitle}}</label>
        </div>
      </van-swipe-item>
    </van-swipe>

    <!-- 圆形图标入口标签 -->
    <div class="ball-list">
      <div class="auto-scroll clearfix">
        <div
          class="ball fl"
          v-for="(item,index) in ballData"
          :key="index"
          @click="goPage(item.route)"
        >
          <div class="icon">
            <img class="auto-img" :src="item.iconUrl" alt />
          </div>
          <div class="text">{{item.name}}</div>
        </div>
      </div>
    </div>

    <!-- 发现好歌单标签 -->
    <div class="found-good">
      <div class="title">发现好歌单</div>
      <div class="good-list">
        <div class="auto-scroll clearfix">
          <div class="good fl" v-for="(item,index) in goodplayList" :key="index" @click="goPage(item.route)">
            <div class="img">
              <img class="auto-img" :src="item.coverImgUrl" alt />
              <div class="count">{{item.playCount}}</div>
            </div>
            <div class="text van-multi-ellipsis--l2">{{item.description}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/mainLess/discover.less";
import boxComponent from "@/components/boxComponent.vue";

export default {
  components: {
    boxComponent,
  },

  data() {
    return {
      // 轮播图数据
      bannerData: [],

      // 圆形图标入口列表
      ballData: [],

      // 二级分类导航栏数据
      classifyData: [
        {
          title: "每日推荐",
          name: {
            name: "List",
            query: {
              url: "/recommend/songs",
              name: "每日推荐",
            },
          },
        },
        {
          title: "歌单",
          name: {
            name: "Songlist",
          },
        },
        // {
        //   title: "排行榜",
        //   name: {
        //     name: "Rankinglist",
        //   },
        // },
      ],

      // 发现好歌单
      goodplayList: [],
    };
  },

  methods: {
    // 轮播路由跳转
    goBanner(options) {
      console.log(options);
    },

    // 获取轮播图数据
    getBannerData() {
      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          type: 1,
        },
      }).then((result) => {
        console.log(result);
        if (result.data.code == 200) {
          this.bannerData = result.data.banners;
        } else {
        }
      });
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

    // 获取圆形图标
    getBall() {
      this.axios({
        method: "GET",
        url: "/homepage/dragon/ball",
        params: {
          cookie: localStorage.getItem("cookie"),
        },
      })
        .then((result) => {
          console.log("FM ===> ", result);
          if (result.data.code != 200) return;
          this.ballData = result.data.data;
          for (var i = 0; i < this.classifyData.length; i++) {
            this.ballData[i].route = this.classifyData[i].name;
          }
        })
        .catch((err) => {});
    },

    // 获取发现好歌单
    getGoodplayList() {
      this.axios({
        method: "GET",
        url: "/top/playlist",
        params: {
          limit: 6,
        },
      })
        .then((result) => {
          console.log("good", result);
          if (result.data.code != 200) return;

          this.goodplayList = result.data.playlists;

          this.goodplayList.map((v) => {
            v.route = {
              name: "List",
              query: {
                id: v.id,
                url: "/playlist/detail",
                name: v.name,
              },
            };
          });
        })
        .catch((err) => {});
    },
  },

  created() {
    this.getBannerData();
    this.getBall();
    this.getGoodplayList();
  },
};
</script>