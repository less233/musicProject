<template>
  <div id="myc-aimp">
    <div class="left" @click="toPlayer">
      <div class="disc">
        <img :src="musicInfo.picUrl" alt />
      </div>
      <div class="easy-info">
        <div class="song">{{musicInfo.songName}}</div>
        <div class="singer">{{musicInfo.singerName}}</div>
      </div>
    </div>

    <div class="right">
      <div class="play" @click="changePlayState">
        <van-icon :name="this.playerInfo.autoplay?'pause-circle-o':'play-circle-o'" />
      </div>
      <div class="love" @click="changeLove">
        <van-icon name="bars" />
      </div>
    </div>

    <!-- 弹出层 -->
    <van-popup v-model="show" position="bottom">
      <div class="title-text">当前播放</div>

      <!-- 控制层 -->
      <div class="controls-box">
        <div class="left">
          <span class="iconfont">&#xe631;</span>
          <div class="text">随机播放</div>
        </div>

        <van-icon name="delete" @click="deleteList" />
      </div>

      <!-- 列表 -->
      <div class="list-box">
        <div class="song" v-for="(item,index) in playList" :key="index">
          <div class="van-ellispsis" :class="item.isActive?'active':null" @click="playSong(item)">
            <van-icon
              v-if="item.isActive"
              name="music-o"
              :class="playerInfo.autoplay?'animat':'paused'"
            />
            {{item.name}}
            <div class="singer">- {{item.ar[0].name==""?"佚名":item.ar[0].name}}</div>
          </div>

          <!-- x按钮 -->
          <van-icon name="cross" @click="deleteOne(index)" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("primaryModule");

export default {
  name: "aimpComponent",

  computed: {
    ...mapState([
      "musicInfo",
      "playerInfo",
      "musicList",
      "musicInfFunc",
      "historyList",
    ]),
  },

  data() {
    return {
      // 是否显示弹出层
      show: false,
      // 当前播放歌单
      playList: [],
    };
  },

  methods: {
    ...mapMutations([
      "changePlayerInfo",
      "addMusicList",
      "changeMusicInfo",
      "changeHistoryList",
    ]),

    //   去播放器
    toPlayer() {
      this.$router.push({ name: "Player" });
    },

    // 播放/暂停方法
    changePlayState() {
      console.log(this.playerInfo);
      this.changePlayerInfo({ autoplay: !this.playerInfo.autoplay });
      if (this.playerInfo.autoplay) {
        this.playerInfo.audio.play();
      } else {
        this.playerInfo.audio.pause();
      }
    },

    // 显示隐藏
    changeLove() {
      console.log("love");
      this.show = true;
      this.getPlayList();
    },

    // 获取当前播放列表
    getPlayList() {
      if (this.musicList.length == 0) return;
      this.$toast.loading({ duration: 0 });

      let str = "";
      this.musicList.map((v) => {
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
          console.log("play list => ", result);
          if (result.data.code != 200) return;
          this.playList = result.data.songs;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 删除当前歌单
    deleteList() {
      this.addMusicList([]);
      this.playList = [];
    },

    // 当前歌单中删除一首歌曲
    deleteOne(index) {
      console.log("onedelete", index);

      this.playList.splice(index, 1);
      let list = this.musicList;
      list.splice(index, 1);
      this.addMusicList(list);
    },

    // 判断当前播放的歌曲
    judgeNowPlay() {
      let nowMusicId = this.musicInfo.ids;

      this.playList.map((v) => {
        v.isActive == true ? (v.isActive = false) : null;
        if (v.id == nowMusicId) {
          v.isActive = true;
          return;
        }
      });
    },

    // 播放歌曲
    async playSong(item) {
      this.$toast.loading({ duration: 0 });

      let hlist = this.historyList;
      hlist.unshift(item.id);
      console.log("hlist", hlist);
      this.changeHistoryList(hlist);

      // 修改播放器详情
      let playerOptions = {};
      playerOptions.src = this.musicURL + item.id;
      //   playerOptions.duration = item.duration;
      playerOptions.autoplay = true;

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

      this.$toast.clear();
      this.playerInfo.audio.play();
      setTimeout(() => {
        console.log(this.playerInfo.audio.readyState);
        if (this.playerInfo.audio.readyState == 0) {
          this.playerInfo.audio.pause();
          this.changePlayerInfo({ autoplay: false });
        }
      }, 2000);
    },
  },
};
</script>

<style lang="less" scoped>
#myc-aimp {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 1px 0 0 0.5px #cccccc;
  z-index: 9999;

  .left {
    display: flex;
    align-items: center;

    .disc {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 0.5px 0 #f0f0f0;

      img {
        width: 100%;
        transform: scale(1.4);
      }
    }

    .easy-info {
      margin-left: 6px;

      .song {
        font-size: 14px;
        color: #333333;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 200px;
      }

      .singer {
        font-size: 12px;
        color: #7d7d7d;
        margin-top: 4px;
      }
    }
  }

  .right {
    width: 70px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
    font-size: 26px;
  }

  .van-popup {
    box-sizing: border-box;
    height: 480px;
    width: 92%;
    margin-left: 4%;
    margin-bottom: 22px;
    border-radius: 20px;
    color: #333333;
    padding: 15px;
    padding-right: 19px;
    overflow: hidden;
    position: fixed;
    z-index: 9999;

    .title-text {
      margin-top: 5px;
      font-size: 16px;
      font-weight: bold;
    }

    .controls-box {
      // background-color: red;
      margin: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #b7b7b7;

        .text {
          margin-left: 8px;
          color: #4d4d4d;
        }
      }

      .van-icon {
        font-size: 18px;
        color: #b7b7b7;
      }
    }

    .list-box {
      height: 380px;
      overflow: auto;

      .song {
        margin: 25px 0;
        font-size: 14px;
        color: #333333;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .van-icon {
          font-size: 18px;
          color: #b7b7b7;
        }

        .van-ellispsis {
          display: flex;
          align-items: center;
          flex: 1;

          .singer {
            font-size: 10px;
            color: #b7b7b7;
          }

          .van-icon {
            color: #f43e3e;
            margin-right: 8px;
          }
        }

        .active {
          color: #f43e3e;

          .singer {
            color: #f43e3e;
          }
        }
      }
    }
  }

  .animat {
    animation: turn 10s linear infinite normal none running;
  }

  .paused {
    animation: turn 10s linear infinite normal none paused;
  }

  @keyframes turn {
    0% {
      transform: rotateZ(0deg);
    }

    50% {
      transform: rotateZ(180deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }
  // 引用iconfont
  @font-face {
    font-family: "iconfont";
    src: url("../assets/icon/player/iconfont.eot");
    src: url("../assets/icon/player/iconfont.eot?#iefix")
        format("embedded-opentype"),
      url("../assets/icon/player/iconfont.woff2") format("woff2"),
      url("../assets/icon/player/iconfont.woff") format("woff"),
      url("../assets/icon/player/iconfont.ttf") format("truetype"),
      url("../assets/icon/player/iconfont.svg#iconfont") format("svg");
  }

  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>