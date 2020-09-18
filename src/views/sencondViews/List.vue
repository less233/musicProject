<template>
  <div class="list">
    <!-- 导航栏 -->
    <nav-component :title="this.$route.query.name" color="white"></nav-component>

    <div class="contain">
      <div class="title-text" @click="playAll">
        <van-icon name="play-circle-o" />
        <div class="text">播放全部</div>
      </div>

      <div class="search-songs">
        <div
          class="hot-song"
          v-for="(item, index) in listDetail"
          :key="index"
          @click="playSong(item)"
        >
          <div class="serial">{{index+1}}</div>
          <div class="content">
            <div class="song">{{item.name}}</div>
            <div class="intro">{{item.ar[0].name}} - {{item.al.name==""?"未知":item.al.name}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部播放器 -->
    <aimp-component></aimp-component>
  </div>
</template>

<script>
import "@/assets/less/secondLess/list.less";
import navComponent from "@/components/navComponent.vue";
import aimpComponent from "@/components/aimpComponent.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("primaryModule");

export default {
  name: "list",

  components: {
    navComponent,
    aimpComponent,
  },

  computed: {
    ...mapState([
      "userInfo",
      "playerInfo",
      "musicInfFunc",
      "musicList",
      "historyList",
    ]),
  },

  data() {
    return {
      // 歌单id
      list: [],
      listDetail: [],

      imgId: "",
    };
  },

  methods: {
    ...mapMutations([
      "changePlayerInfo",
      "changeMusicInfo",
      "addMusicList",
      "unshiftMusicList",
    ]),

    //   获取数据
    async getData() {
      this.$toast.loading({ duration: 0 });
      let uid = this.userInfo.userid;
      let params;
      console.log(uid);

      if (this.$route.query.url == "/likelist") {
        params = {
          uid,
          cookie: localStorage.getItem("cookie"),
        };
      } else if (this.$route.query.url == "/recommend/songs") {
        params = {
          cookie: localStorage.getItem("cookie"),
        };
      } else if (this.$route.query.url == "/playlist/detail") {
        params = {
          id: this.$route.query.id,
          // cookie: localStorage.getItem("cookie"),
        };
      } else if (this.$route.query.url == "/user/record") {
        params = {
          uid,
        };
      } else if (this.$route.query.url == "/recommend/resource") {
        params = {
          cookie: localStorage.getItem("cookie"),
          uid,
        };
      }

      await this.axios({
        method: "GET",
        url: this.$route.query.url,
        params,
      })
        .then((result) => {
          this.$toast.clear();
          console.log("axios => 0", result);
          if (result.data.code != 200) return;

          if (this.$route.query.url == "/likelist") {
            // 我的喜欢歌曲数据处理
            this.imgId = result.data.checkPoint;
            this.list = result.data.ids;
          } else if (this.$route.query.url == "/recommend/songs") {
            // 每日推荐歌曲数据处理
            result.data.data.dailySongs.map((v) => {
              this.list.push(v.id);
            });
          } else if (this.$route.query.url == "/playlist/detail") {
            // 歌单数据处理
            result.data.playlist.trackIds.map((v) => {
              this.list.push(v.id);
            });
          } else if (this.$route.query.url == "/user/record") {
            // 全部已播歌曲数据处理
            result.data.allData.map((v) => {
              this.list.push(v.song.id);
            });
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.$toast.clear();
        });

      console.log(this.$route);
      this.getListDetail();
    },

    // 更新歌单顺序
    getListDetail() {
      console.log("12000", this.list);
      this.$toast.loading({ duration: 0 });

      let str = "";
      this.list.map((v) => {
        console.log(v);
        str += v + ",";
      });
      console.log(str);

      str = str.slice(0, -1);
      console.log(str);

      this.axios({
        method: "GET",
        url: "/song/detail",
        params: {
          ids: str,
        },
      })
        .then((result) => {
          this.$toast.clear();
          console.log("new list => ", result);
          if (result.data.code != 200) return;
          this.listDetail = result.data.songs;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 播放歌曲
    async playSong(item) {
      this.$toast.loading({ duration: 0 });
      // 修改播放器详情
      let playerOptions = {};
      playerOptions.src = this.musicURL + item.id;
      //   playerOptions.duration = item.duration;
      playerOptions.autoplay = true;

      // 添加歌曲到当前歌单中
      this.unshiftMusicList(item.id);

      await this.changePlayerInfo(playerOptions);

      // 修改音乐详情
      let musicOptions = {};
      musicOptions.ids = item.id;
      // musicOptions.songName = item.name;
      if (item.ar[0].name == "") {
        musicOptions.singerName = "佚名";
      } else {
        musicOptions.singerName = item.ar[0].name;
      }

      await this.changeMusicInfo(musicOptions);

      await this.musicInfFunc();

      setTimeout(() => {
        this.$toast.clear();
        this.toPlayer();
      }, 400);
    },

    // 跳转至播放器并播放
    toPlayer() {
      this.$router.push({ name: "Player" });
      this.playerInfo.audio.play();
    },

    // 全部播放
    playAll() {
      if (this.list.length == 0) {
        return this.$toast.loading({ message: "没有内容可以播放啦" });
      }
      this.addMusicList(this.list);

      console.log(this.musicList);
    },
  },

  mounted() {
    console.log("listroute =>", this.$route);
    if (this.$route.query.url) {
      this.getData();
    } else {
      // 最近播放
      this.list = this.historyList;
      this.getListDetail();
    }
  },
};
</script>