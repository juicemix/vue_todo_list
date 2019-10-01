import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import UUID from 'vue-uuid'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import stores from '@/stores'

Vue.use(Buefy)
Vue.use(UUID)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.config.productionTip = false

const store = new Vuex.Store(stores)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
