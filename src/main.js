import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import {Helper} from '@/plugins/helper'
import axios from 'axios'
import {appConfig} from "@/plugins/config"
import VueMeta from "vue-meta"
import {appAxios} from "@/plugins/appAxios"

Vue.config.productionTip = false

Vue.use(VueMeta)

Vue.prototype.$config = appConfig
Vue.prototype.$helper = new Helper()
Vue.prototype.$axios = appAxios
Vue.prototype.$pureAxios = axios.create()

new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
