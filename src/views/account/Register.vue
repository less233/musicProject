<template>
  <div class="register">
    <!-- 自定义导航栏组件 -->
    <nav-component :title="isRegister?'注册':'登录'"></nav-component>

    <!-- 输入框 -->
    <div class="account-box">
      <van-field v-model="userInfoL.phone" placeholder="请输入手机号" @blur="phoneRegister" />
      <van-field v-model="userInfoL.password" type="password" placeholder="请输入密码" />
      <van-field v-show="isRegister" v-model="userInfoR.nickname" placeholder="请输入昵称" />
      <van-field v-show="isRegister" v-model="userInfoR.captcha" placeholder="请输入验证码">
        <template #button>
          <van-button :disabled="isSent" size="mini" type="primary" @click="sentCode">{{sentText}}</van-button>
        </template>
      </van-field>
    </div>

    <!-- 提交切换按钮 -->
    <van-button round @click="sendInfo">{{isRegister?'注册':'登录'}}</van-button>
    <van-button round plain hairline @click="toggleStatus">{{isRegister?'登录':'注册'}}</van-button>
  </div>
</template>

<script>
import "../../assets/less/accountLess/register.less";
import navComponent from "@/components/navComponent.vue";
import { utils } from "../../assets/js/utils";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("primaryModule");

export default {
  components: {
    navComponent,
  },
  data() {
    return {
      // 用户登录资料
      userInfoL: {
        phone: "",
        password: "",
      },

      // 用户注册资料
      userInfoR: {
        nickname: "",
        captcha: "",
      },

      // 判断是否要注册
      isRegister: false,
      // 验证码发送状态
      isSent: true,
      // 验证码按钮文本
      sentText: "发送验证码",
    };
  },

  methods: {
    ...mapMutations(['changeLogin','changeUserInfo']),

    // 切换注册/登录状态
    toggleStatus() {
      this.isRegister = !this.isRegister;
    },

    // 手机号是否注册验证
    phoneRegister() {
      // 手机号为空跳出
      if (this.userInfoL.phone == "") {
        this.$toast("手机号不能为空");
        return;
      }

      let options = {
        testPhone: {
          value: this.userInfoL.phone,
          reg: /^1[3-9]\d{9}$/,
          errMsg: "手机号错误",
        },
      };

      // 手机号错误跳出
      if (!utils.verify(options)) {
        return;
      }

      if (this.isRegister) {
        this.axios({
          method: "GET",
          url: "/cellphone/existence/check",
          params: {
            phone: this.userInfoL.phone,
          },
        })
          .then((result) => {
            console.log(result);
            if (result.data.exist == 1) {
              this.$toast("手机号已注册");
              // 不给点击
              this.isSent = false;
            } else {
              this.isSent = false;
            }
          })
          .catch((err) => {});
      }
    },

    // 发送验证码
    sentCode() {
      this.isSent = true;
      let time = 10;
      this.sentText = `${time}s后重新发送`;

      // 调用发送验证码接口
      this.axios({
        method: "GET",
        url: "/captcha/sent",
        params: {
          phone: this.userInfoL.phone,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.$toast("发送成功");
        }
      });

      let timer = setInterval(() => {
        if (time == 0) {
          this.sentText = "发送验证码";
          this.isSent = false;
          return clearInterval(timer);
        }
        time--;
        this.sentText = `${time}s后重新发送`;
      }, 1000);
    },

    // 提交表单 登录/注册
    sendInfo() {
      if (this.isRegister) {
        // 注册功能
        let userInfo = this.userInfoR;
        userInfo = Object.assign(this.userInfoL, userInfo);
        console.log(userInfo);

        let options = {
          testPhone: {
            value: userInfo.phone,
            reg: /^1[3-9]\d{9}$/,
            errMsg: "手机号错误",
          },
          testPwd: {
            value: userInfo.password,
            reg: /^[\d\w]{6,16}$/,
            errMsg: "请确认密码格式为6-16位数字或字母",
          },
          nickName: {
            value: userInfo.nickname,
            reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
            errMsg: "请确认昵称格式为1-10位汉字或字母",
          },
        };

        // 验证不通过直接返回
        if (!utils.verify(options)) {
          return;
        }

        this.axios({
          method: "GET",
          url: "/captcha/verify",
          params: {
            phone: userInfo.phone,
            captcha: userInfo.captcha,
          },
        }).then((res) => {
          if (res.data.code == 200) {
            // 验证码验证通过
            this.axios({
              method: "GET",
              url: "/register/cellphone",
              params: {
                captcha: userInfo.captcha,
                phone: userInfo.phone,
                password: userInfo.password,
                nickname: userInfo.nickname,
              },
            }).then((result) => {
              console.log(result);
            });
          }
        });
      } else if (!this.isRegister) {
        // 登录功能
        this.$toast("点击了登录按钮");

        let userInfo = this.userInfoL;
        console.log(userInfo);

        let options = {
          testPhone: {
            value: userInfo.phone,
            reg: /^1[3-9]\d{9}$/,
            errMsg: "手机号错误",
          },
          testPwd: {
            value: userInfo.password,
            reg: /^[\d\w]{6,16}$/,
            errMsg: "请确认密码格式为6-16位数字或字母",
          },
        };

        // 验证不通过直接返回
        if (!utils.verify(options)) {
          return;
        }

        this.axios({
          method: "GET",
          url: "/login/cellphone",
          params: {
            phone: userInfo.phone,
            password: userInfo.password,
          },
        }).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            localStorage.setItem("cookie", res.data.cookie);
            this.changeLogin(true);
            let options = {};
            options.userid = res.data.account.id;
            options.nickname = res.data.profile.nickname;
            options.backgroundUrl = res.data.profile.backgroundUrl;
            options.avatarUrl = res.data.profile.avatarUrl;
            
            this.changeUserInfo(options);

            let optionsString = JSON.stringify(options)
            localStorage.setItem("profile", optionsString);
            console.log(options)

            this.$router.push({ name: "Discover" });
          }
        });
      }
    },
  },
};
</script>