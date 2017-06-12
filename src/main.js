import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import MainPage from './components/MainPage'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/timeline/0' },
    { path: '/timeline', redirect: '/timeline/0' },
    { path: '/timeline/:routeIndex', component: MainPage, props: true }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
