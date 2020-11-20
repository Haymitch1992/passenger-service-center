import Vue from 'vue'
import App from './App.vue'
import dataV from '@jiaminghi/data-view'
import router from './router' //引入路由
import axios from 'axios'
import echarts from 'echarts'
//引入中国地图依赖
import 'echarts/map/js/china'
import _ from 'lodash'


 

Vue.prototype._ = _

Vue.prototype.$echarts = echarts
Vue.use(dataV)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
