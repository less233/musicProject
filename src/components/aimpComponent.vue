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
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("primaryModule");

export default {
  name: "aimpComponent",

  computed: {
    ...mapState(["playerInfo", "musicInfo"]),
  },

  methods: {
    ...mapMutations(["changePlayerInfo"]),

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

    // 是否收藏
    changeLove() {
      console.log("love");
      let muted = !this.playerInfo.muted;
      this.changePlayerInfo({ muted });
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
}
</style>