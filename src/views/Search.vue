<template>
  <div class="search">
    <!-- 抬头 -->
    <nav-component>
      <template #title>
        <van-field v-model="searchValue" placeholder="请输入关键字" @blur="searchSong" />
      </template>
    </nav-component>

    <div class="hot">
      <!-- 热搜榜 -->
      <div v-if="searchValue==''" class="search-hot">
        <div class="label">热搜榜</div>

        <div
          class="hot-song"
          v-for="(item, index) in hotData"
          :key="
      index"
          @click="clickHotSong(item.searchWord)"
        >
          <div class="serial">{{index+1}}</div>
          <div class="content">
            <div class="song">
              {{item.searchWord}}
              <b v-if="item.iconType==1" style="color:#fa3b3e;">
                <i>HOT</i>
              </b>
              <b v-else-if="item.iconType==5" style="color:#fa3b3e;">
                <van-icon style="transform: rotate(180deg);" name="down" />
              </b>
              <b v-else-if="item.iconType==2" style="color:#26ae26;">
                <i>NEW</i>
              </b>
            </div>
            <div class="intro">{{item.content}}</div>
          </div>
          <div class="score">{{item.score}}</div>
        </div>
      </div>

      <!-- 搜索到的数据 -->
      <div v-else class="search-songs">
        <div
          class="hot-song"
          v-for="(item, index) in searchData"
          :key="index"
          @click="playSong(item)"
        >
          <div class="serial">{{index+1}}</div>
          <div class="content">
            <div class="song">{{item.name}}</div>
            <div
              class="intro"
            >{{item.artists[0].name}} - {{item.album.name==""?"未知":item.album.name}}</div>
            <div class="intro">{{item.alias[0]}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <aimp-component></aimp-component>
  </div>
</template>

<script>
import "../assets/less/search.less";
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
    ...mapState(["playerInfo", "musicInfo", "musicInfFunc"]),
  },

  data() {
    return {
      // 热搜榜数据
      hotData: [],
      // 搜索到的数据
      searchData: [],

      searchValue: "",
    };
  },

  methods: {
    ...mapMutations([
      "changePlayerInfo",
      "changeMusicInfo",
      "unshiftMusicList",
    ]),

    //   获取热搜列表
    searchHot() {
      this.$toast.loading({ forbidClick: true });

      this.axios({
        method: "GET",
        url: "/search/hot/detail",
      })
        .then((result) => {
          console.log(result);
          this.$toast.clear();

          if (result.data.code != 200) return;

          this.hotData = result.data.data;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 点击热搜榜
    clickHotSong(value) {
      this.searchValue = value;
      this.searchSong();
    },

    // 搜索歌曲
    searchSong() {
      if (this.searchValue == "") return;

      this.$toast.loading();

      this.axios({
        method: "GET",
        url: "/search",
        params: {
          keywords: this.searchValue,
        },
      })
        .then((result) => {
          console.log("serach =>", result);
          this.$toast.clear();
          if (result.data.code != 200) return;

          this.searchData = result.data.result.songs;
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    // 播放歌曲
    async playSong(item) {
      
      let hlist = this.historyList;
      hlist.unshift(item.id);
      console.log("hlist", hlist);
      this.changeHistoryList(hlist);

      // 修改播放器详情
      let playerOptions = {};
      playerOptions.src = this.musicURL + item.id;
      playerOptions.duration = item.duration;
      playerOptions.autoplay = true;

      // 添加歌曲到当前歌单中
      this.unshiftMusicList(item.id);

      await this.changePlayerInfo(playerOptions);

      // 修改音乐详情
      let musicOptions = {};
      musicOptions.ids = item.id;
      // musicOptions.songName = item.name;
      if (item.artists[0].name == "") {
        musicOptions.singerName = "佚名";
      } else {
        musicOptions.singerName = item.artists[0].name;
      }

      await this.changeMusicInfo(musicOptions);

      await this.musicInfFunc();
      this.searchValue = "";

      this.toPlayer();
    },

    // 跳转至播放器并播放
    toPlayer() {
      this.$router.push({ name: "Player" });
      this.playerInfo.audio.play();
    },
  },

  created() {
    this.searchHot();
  },
};
</script>