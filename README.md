## 音乐API

```txt
    请求基础路径 http://music.kele8.cn
    音乐id请求基础路径:  https://music.163.com/song/media/outer/url?id=
```

```txt
    检测手机号码是否注册
    接口地址: /cellphone/existence/check
    请求类型: GET
    参数: phone:手机号码
```

```txt
    发送验证码
    接口地址: /captcha/sent
    请求类型: GET
    参数: phone:手机号码
```

```txt
    验证验证码
    接口地址: /captcha/verify
    请求类型: GET
    参数:
    phone:手机号码
    captcha: 验证码
```

```txt
    注册(不可用)
    接口地址: /register/cellphone
    请求类型: GET
    参数:
    captcha: 验证码
    phone : 手机号码
    password: 密码
    nickname: 昵称
```

```txt
    获取歌曲详情
    接口地址: /song/detail
    请求类型: GET
    参数:
    ids: 音乐 id
```

```txt
    热搜列表(详细)
    接口地址: /search/hot/detail
    请求类型: GET
```

```txt
    搜索
    接口地址: /search
    请求类型: GET
    参数:
    keywords : 关键词
```

```txt
    喜欢音乐列表( 需要登录 )
    接口地址: /likelist
    请求类型: GET
    参数:
    uid: 用户 id
```

```txt
    获取歌词
    接口地址: /lyric
    请求类型: GET
    参数:
    id: 音乐 id
```

```txt
    获取推荐歌曲( 需要登录 )
    接口地址: /recommend/songs
    请求类型: GET
    参数:
```

```txt
    获取用户播放记录
    接口地址: /user/record
    请求类型: GET
    参数:
    uid : 用户 id
    type : type=1 时只返回 weekData, type=0 时返回 allData
```