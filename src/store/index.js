import Vue from 'vue'
import Vuex from 'vuex'

import {
  primaryModule
} from './primaryStore/modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    primaryModule
  }
})