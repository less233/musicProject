import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'lib-flexible/flexible'

import App from './App.vue'
import router from './router'
import store from './store'

import {
  Button,
  Icon,
  NavBar,
  Popup,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Dialog,
  Toast,
  Field,
  Loading,
  Slider,
  List,
  Cell,
  PullRefresh
} from 'vant'

Vue.use(Button)
  .use(NavBar)
  .use(Icon)
  .use(Popup)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Dialog)
  .use(Toast)
  .use(Field)
  .use(Loading)
  .use(Slider)
  .use(List)
  .use(Cell)
  .use(PullRefresh)

let originalPush = Router.prototype.push;
Router.prototype.push = function (url) {
  return originalPush.call(this, url).catch(err => err)
}

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

// 设置请求基础路径
// axios.defaults.baseURL = 'http://music.kele8.cn'
axios.defaults.baseURL = 'http://localhost:3000';

Vue.prototype.musicURL = 'https://music.163.com/song/media/outer/url?id=';

Vue.prototype.imgURL = 'http://p4.music.126.net/JzNK4a5PjjPIXAgVlqEc5Q==/';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')