<template>
  <div id="app">
    <!-- 一级路由 -->
    <keep-alive exclude="list">
      <router-view />
    </keep-alive>

    <audio
      ref="audio"
      :loop="this.playerInfo.loop"
      :muted="this.playerInfo.muted"
      :src="this.playerInfo.src"
    ></audio>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("primaryModule");

export default {
  computed: {
    ...mapState(["playerInfo", "musicInfo"]),
  },

  methods: {
    ...mapMutations([
      "changeLogin",
      "changeUserInfo",
      "changePlayerInfo",
      "changeMusicInfo",
      "changeMusicInfFunc",
    ]),

    // 判断是否登录
    login() {
      let had = localStorage.getItem("cookie");
      let profile = localStorage.getItem("profile");
      profile = JSON.parse(profile);

      // 判断是否拥有合法字符串
      if (had) {
        this.changeLogin(true);
        this.changeUserInfo(profile);
      } else {
        this.changeLogin(false);
      }
    },

    // 获取歌曲信息
    getMusicInfo() {
      if (this.musicInfo.ids == "") {
        return;
      } else {
        console.log("have");
        this.axios({
          // withCredentials: true,
          method: "GET",
          url: "/song/detail",
          params: {
            ids: this.musicInfo.ids,
            // cookie: localStorage.getItem("cookie"),
          },
        })
          .then((res) => {
            console.log("musicdetail", res);
            if (res.data.code != 200) return;

            let options = {};
            options.songName = res.data.songs[0].name;
            options.singerName = res.data.songs[0].ar[0].name;
            options.picUrl = res.data.songs[0].al.picUrl;

            this.changeMusicInfo(options);
          })
          .catch((err) => {});
      }
    },
  },

  created() {
    this.login();
    this.changeMusicInfFunc(this.getMusicInfo);
  },

  mounted() {
    console.log("app.updated");
    this.changePlayerInfo({ audio: this.$refs.audio });
    this.$nextTick(() => {
      this.getMusicInfo();
    });
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

.fl {
  float: left;
}

.fr {
  float: right;
}

.auto-img {
  width: 100%;
  display: block;
}
</style>
