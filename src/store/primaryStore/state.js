export const state = {
    // 登录界面是否同意协议
    isAgree: false,

    // 是否已经登录
    isLogin: false,


    // 用户数据
    userInfo: {
        // 用户ID
        userid: '',
        // 用户昵称
        nickname: '',
        // 用户头像
        avatarUrl: '',
        // 用户背景
        backgroundUrl: 'https://p2.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg'
    },

    // 播放器数据
    playerInfo: {
        // 与h5audio标签属性名一样
        audio: '',
        autoplay: false,
        src: 'https://music.163.com/song/media/outer/url?id=1293886117',
        loop: false,
        muted: false,
        duration: 100,
    },

    // 音乐详细数据
    musicInfo: {
        ids: '1293886117',
        picUrl: '',
        // 歌曲名字
        songName: '',
        // 歌手名字
        singerName: '佚名',
    },

    // 音乐列表
    musicList: [

    ],

    // 播放历史
    historyList: [

    ],

    // 获取歌曲信息方法
    musicInfFunc: null,

}