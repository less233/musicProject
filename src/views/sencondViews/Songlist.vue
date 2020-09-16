<template>
  <div class="song-list">
    <!-- nav导航栏 -->
    <navComponent title="歌单广场"></navComponent>

    <!-- 主要内容 -->
    <div class="list-contain">
      <!-- 歌单 -->
      <div class="list-content">
        <div
          class="box fl"
          v-for="(item,index) in recommendList"
          :key="index"
          @click="goList(item)"
        >
          <div class="img-box">
            <img class="auto-img" :src="item.picUrl" alt />
          </div>

          <div class="title-box van-multi-ellipsis--l2">{{item.name}}</div>
        </div>
      </div>
    </div>

    <!-- 底部播放器 -->
    <aimpComponent></aimpComponent>
  </div>
</template>

<script>
import "@/assets/less/secondLess/songlist.less";
import navComponent from "@/components/navComponent.vue";
import aimpComponent from "@/components/aimpComponent.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("primaryModule");

export default {
  components: {
    navComponent,
    aimpComponent,
  },

  computed: {
    ...mapState(["userInfo"]),
  },

  data() {
    return {
      // 推荐歌单
      recommendList: [],
    };
  },

  methods: {
    //   获取推荐歌单
    getRecommendList() {
      this.$toast.loading({ duration: 0 });

      this.axios({
        method: "GET",
        url: "/personalized",
        params: {
          limit: 30,
          cookie: localStorage.getItem("cookie"),
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("recommendResult ===> ", result);
          if (result.data.code != 200) return;

          this.recommendList = result.data.result;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 跳转到list
    goList(item) {
      this.$router.push({
        name: "List",
        query: { url: "/playlist/detail", id: item.id, name: "歌单" },
      });
    },
  },

  created() {
    this.getRecommendList();
  },
};
</script>