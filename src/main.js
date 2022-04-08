import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import './assets/css/global.css' //导入全局样式表
import axios from "axios"
Vue.prototype.$http=axios //将axios挂载在vue的原型对象上，这样的话，每一个vue的组件都可以通过this直接访问到http从而去发起ajax请求
//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'//接口文档中提供的接口API地址

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
