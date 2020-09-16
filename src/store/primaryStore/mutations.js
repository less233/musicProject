export const mutations = {
    // 改变是否同意协议状态
    changeAgree(state) {
        state.isAgree = !state.isAgree;
    },

    // 改变登录状态
    // status: boolean
    changeLogin(state, status) {
        state.isLogin = status;
    },

    // 改变用户信息
    changeUserInfo(state, options) {
        for (let key in state.userInfo) {
            state.userInfo[key] = options[key]
        }
    },

    // 改变播放器信息
    // options格式
    // 类型:对象
    // key: 对应state.playerInfo[key]
    changePlayerInfo(state, options) {
        for (let key in options) {
            state.playerInfo[key] = options[key];
        }
    },

    // 获取音乐信息
    changeMusicInfo(state, options) {
        for (let key in options) {
            state.musicInfo[key] = options[key];
        }
    },

    // 添加到播放列表中
    addMusicList(state, options) {
        state.musicList = options;
    },

    // 单曲添加到播放列表中
    unshiftMusicList(state, options) {
        state.musicList.unshift(options);
    },

    // 改变播放历史
    changeHistoryList(state, options) {
        state.historyList = options
    },

    // 赋给方法
    changeMusicInfFunc(state, option) {
        state.musicInfFunc = option;
    }
}