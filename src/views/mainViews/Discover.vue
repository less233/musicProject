<template>
  <div class="discover" @click="personal">
    <!-- 轮播图标签 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in bannerData" :key="index" @click="goBanner(item.url)">
        <div class="contain">
          <img :src="item.pic" class="auto-img" />
          <label>{{item.typeTitle}}</label>
        </div>
      </van-swipe-item>
    </van-swipe>

    <!-- 二级分类导航栏标签 -->
    <box-component
      v-for="(item,index) in classifyData"
      :key="index"
      :title="item.title"
      @click="goPage(item.name)"
    ></box-component>
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

      ind: 1,
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

    personal() {
      this.ind++;
      this.axios({
        method: "GET",
        url: "/personal_fm",
        params: {
          cookie: localStorage.getItem("cookie"),
          offset: this.ind,
        },
      }).then((result) => {
        console.log("FM ===> ", result);
      });
    },
  },

  created() {
    this.getBannerData();
  },
};
</script>