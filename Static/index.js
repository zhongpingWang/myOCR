import Vue from 'vue'
//import store from './store'
import router from './router/index'
import "./css/index.less"

// import filters from './vueComm/filters'
// import directives from './vueComm/directives'
// //注册组件
// import "./vueComm/components/elementUI/importElementUI"
// import "./vueComm/components/regComponents"

//注册全局通用方法
// import Comm from "./js/comm"
// Vue.prototype.Comm = Comm

import jquery from "jquery"
window.$ = jquery;

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


window.$eventBus = new Vue();

import RouterApp from './src/App';

new Vue({
    el: '#app',
    router,
    render: h => h(RouterApp)
})