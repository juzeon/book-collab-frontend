import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import VueMeta from 'vue-meta'

Vue.config.productionTip = false

Vue.use(VueMeta)

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
