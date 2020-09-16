<template>
  <div class="player">
    <!-- 抬头 -->
    <nav-component color="white">
      <template #title>
        <div class="title">
          <div class="song">{{musicInfo.songName}}</div>
          <div class="singer">{{musicInfo.singerName}}</div>
        </div>
      </template>
    </nav-component>

    <!-- 背景模糊 -->
    <div class="bg">
      <img :src="this.musicInfo.picUrl" class="auto-img" alt />
    </div>

    <!-- 遮罩层 -->
    <div class="mask"></div>

    <!-- 主要内容 -->
    <div class="contain">
      <!-- 歌词/留声机控制 -->
      <div class="cont" @click="changeShowLyric">
        <!-- 留声机 -->
        <div v-show="!showLyric" class="gramophone">
          <div class="point"></div>
          <div class="tonearm" :class="!playerInfo.autoplay?'active':null"></div>
          <div class="turntable" :class="playerInfo.autoplay?'animat':'paused'">
            <img class="auto-img" :src="musicInfo.picUrl" alt />
          </div>
        </div>

        <!-- 歌词 -->
        <div v-show="showLyric" class="lyric-box" ref="lyric" @touchmove="scrollStop">
          <div class="lyric">
            <div
              class="row"
              :class="index==row?'active':null"
              v-for="(item,index) in lyric"
              :key="index"
              :ref="row==index?'row':null"
            >{{item}}</div>
          </div>
        </div>
      </div>

      <!-- 功能控制 -->
      <div class="func">
        <!-- 进度条上方功能控制 -->
        <div class="func-control">
          <span class="iconfont">&#xe64e;</span>
          <span class="iconfont">&#xe650;</span>
          <span class="iconfont">&#xe63e;</span>
          <span class="iconfont">&#xe652;</span>
          <span class="iconfont">&#xe6cb;</span>
        </div>

        <!-- 进度条控制 -->
        <div class="progress-control">
          <div class="start-time time">{{startTime}}</div>
          <van-slider :max="maxValue" v-model="value" @change="changeProgress" />
          <div class="end-time time">{{endTime}}</div>
        </div>

        <!-- 播放控制 -->
        <div class="play-control">
          <!-- 切换播放模式 -->
          <div @click="changePlayFunc">
            <!-- 顺序播放 -->
            <span v-show="playFunc==1" class="iconfont">&#xe67b;</span>
            <!-- 随机播放 -->
            <span v-show="playFunc==2" class="iconfont">&#xe631;</span>
            <!-- 单曲循环 -->
            <span v-show="playFunc==3" class="iconfont">&#xe63d;</span>
          </div>
          <!-- 上一首 -->
          <span class="iconfont" @click="prev">&#xe685;</span>
          <!-- 播放/暂停 -->
          <van-icon
            class="play"
            :name="playerInfo.autoplay?'pause-circle-o':'play-circle-o'"
            @click="changePlay"
          />
          <!-- 下一首 -->
          <span class="iconfont" @click="next">&#xe613;</span>
          <!-- 显示弹出层 -->
          <span class="iconfont" @click="showPopup">&#xe6c5;</span>
        </div>
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
import "../assets/less/player.less";
import navComponent from "@/components/navComponent.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("primaryModule");

export default {
  components: {
    navComponent,
  },

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
      // 当前播放歌单
      playList: [],
      // 歌词
      lyric: [],
      lyricTime: [],

      // 控制条范围
      value: 0,
      maxValue: 100,
      // 歌曲时间
      startTime: "00:00",
      endTime: "00:00",
      // 是否显示弹出层
      show: false,
      // 是否显示歌词
      showLyric: false,
      // 播放顺序
      // 1：顺序播放
      // 2：随机播放
      // 3：单曲xunhuan
      playFunc: 3,
      // 当前歌词行
      row: 0,
      // 节流阀
      flag: true,
      // 延时器
      timer: null,
    };
  },

  methods: {
    ...mapMutations([
      "changePlayerInfo",
      "addMusicList",
      "changeMusicInfo",
      "changeHistoryList",
    ]),

    // 是否显示歌词
    changeShowLyric() {
      this.showLyric = !this.showLyric;
    },

    // 改变播放进度
    changeProgress(value) {
      // console.log(this.playerInfo.audio.currentTime);
      this.playerInfo.audio.currentTime = value;
    },

    // 播放/暂停
    changePlay() {
      let options = {};
      options.autoplay = !this.playerInfo.autoplay;
      this.changePlayerInfo(options);
      if (options.autoplay) {
        this.playerInfo.audio.play();
      } else {
        this.playerInfo.audio.pause();
      }
    },

    // 更新播放位置
    updateTime() {
      this.value = this.playerInfo.audio.currentTime;
      this.maxValue = this.playerInfo.audio.duration;

      this.startTime = `${parseInt(this.value / 60)
        .toString()
        .padStart(2, "0")}:${parseInt(this.value % 60)
        .toString()
        .padStart(2, "0")}`;
      this.endTime = `${parseInt(this.maxValue / 60)
        .toString()
        .padStart(2, "0")}:${parseInt(this.maxValue % 60)
        .toString()
        .padStart(2, "0")}`;

      // 更新播放歌词高亮行
      this.lyricTime.forEach((val, ind) => {
        let s = val.indexOf("[");
        let m = val.indexOf(":");
        let l = val.indexOf(".");
        let time = val.slice(s + 1, m) * 60 + val.slice(m + 1, l) * 1;
        if (this.value >= time) {
          return (this.row = ind);
        }
      });
    },

    // 显示弹出层
    showPopup() {
      this.show = true;
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

      setTimeout(() => {
        this.$toast.clear();
        this.playerInfo.audio.play();
        this.getLyric();
        this.playerInfo.audio.onstalled = function () {
          console.log("不可用");
        };
      }, 400);
    },

    // 获取歌词
    getLyric() {
      this.lyric = [];
      this.lyricTime = [];

      this.axios({
        method: "GET",
        url: "/lyric",
        params: {
          id: this.musicInfo.ids,
        },
      })
        .then((result) => {
          console.log("歌词===> ", result);
          if (result.data.code != 200) return;

          if (result.data.nolyric) return this.lyric.push("纯音乐，请欣赏");

          if (result.data.lrc.lyric == "")
            return this.lyric.push("暂时没有歌词");

          let reg = /\[.*?\]/g;
          let res;
          let arr = [];
          let timeArr = [];

          while ((res = reg.exec(result.data.lrc.lyric)) != null) {
            timeArr = res[0].split(/^\[\]$/g);

            this.lyricTime.push(timeArr[0]);
          }

          arr = result.data.lrc.lyric.split(/\n/g);
          for (let key in arr) {
            let end = arr[key].lastIndexOf("]");
            this.lyric.push(arr[key].slice(end + 1));
          }

          console.log(this.lyricTime, timeArr);
          console.log("歌词数组 +++++++> ", this.lyric);
        })
        .catch((err) => {});
    },

    // 判断当前歌曲是否播放完毕
    isEnded() {
      this.playerInfo.audio.onended = () => {
        console.log("播放完毕");
        this.changePlayerInfo({ autoplay: false });
        // 播放完毕自动执行播放下一首
        if (this.playFunc == 3) {
          this.playerInfo.audio.play();
          this.changePlayerInfo({ autoplay: true });
        } else {
          this.next();
        }
      };
    },

    // 上一曲
    prev() {
      if (this.playFunc == 1 || this.playFunc == 3) {
        // 顺序播放\单曲循环
        for (let index in this.playList) {
          console.log(index);
          if (this.playList[index].isActive) {
            if (index == 0) {
              index = this.playList.length;
            }
            return this.playSong(this.playList[index - 1]);
          }
        }
      } else if (this.playFunc == 2) {
        // 随机播放
        let index = Math.floor(Math.random() * this.playList.length);
        console.log("index", index);
        if (this.playList[index].isActive) return this.next();
        return this.playSong(this.playList[index]);
      }
    },

    // 下一曲
    next() {
      if (this.playFunc == 1 || this.playFunc == 3) {
        // 顺序播放\单曲循环
        for (let index in this.playList) {
          console.log(index);
          if (this.playList[index].isActive) {
            if (index == this.playList.length - 1) {
              index = -1;
            }
            index++;
            console.log("index", index);
            return this.playSong(this.playList[index]);
          }
        }
      } else if (this.playFunc == 2) {
        // 随机播放
        let index = Math.floor(Math.random() * this.playList.length);
        console.log("index", index);
        if (this.playList[index].isActive) return this.next();
        return this.playSong(this.playList[index]);
      }
    },

    // 改变播放方法
    changePlayFunc() {
      if (this.playFunc == 3) return (this.playFunc = 1);
      this.playFunc++;
    },

    // 自动滚动歌词
    rollLyric() {
      let step;
      this.timer = setInterval(() => {
        if (this.$refs.lyric.scrollTop == this.$refs.row[0].offsetTop) {
          clearInterval(this.timer);
          return;
        }

        step =
          (this.$refs.row[0].offsetTop - 380 - this.$refs.lyric.scrollTop) / 10;
        step = step <= 0 ? Math.ceil(step) : Math.floor(step);
        this.$refs.lyric.scrollTop += step;
      }, 30);
    },

    // 滚动事件
    scrollStop() {
      console.log("scroll");
    },
  },

  activated() {
    this.getPlayList();
    this.isEnded();

    if (this.flag) {
      this.flag = false;
      this.playerInfo.audio.ontimeupdate = () => {
        this.updateTime();
        this.judgeNowPlay();
        this.rollLyric();
      };
      setTimeout(() => {
        this.flag = true;
      }, 1000);
    }

    this.getLyric();
  },
};
</script>