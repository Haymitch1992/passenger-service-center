import Vue from 'vue'
import App from './App.vue'
import dataV from '@jiaminghi/data-view'
import router from './router' //引入路由
import axios from 'axios'
import echarts from 'echarts'
import VueVideoPlayer from 'vue-video-player'
//引入中国地图依赖
import 'echarts/map/js/china'
import 'video.js/dist/video-js.css'
import _ from 'lodash'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'

Vue.use(VueVideoPlayer)

Vue.prototype._ = _

Vue.prototype.$echarts = echarts
Vue.use(dataV)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
