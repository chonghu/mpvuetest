import Vue from 'vue'
import App from './App'
import kyutil from './utils'

Vue.config.productionTip = false
// 全局变量
Vue.prototype.globalData = {}
App.mpType = 'app'

var Fly = require('flyio/dist/npm/wx')
var fly = new Fly()
// 添加拦截器
fly.interceptors.request.use((request) => {
  request.body.appId = 'wxc885092dbd66a397'
  // 用户的openId在获取之后添加到全局变量中如果存在，我们将它添加到请求参数里面
  let openId = Vue.prototype.globalData.openId
  if (openId) {
    request.body.openId = openId
  }
}
  , (config, promise) => {
  // 给所有请求添加自定义header
  config.headers['X-Tag'] = 'flyio'
  return config
})
// 配置请求基地址
fly.config.baseURL = 'https://a.9kylin.cn/'

Vue.prototype.$kyutil = kyutil
// 添加全局配置、拦截器等
Vue.prototype.$http = fly // 将fly实例挂在vue原型上

const app = new Vue(App)
app.$mount()
