<template>
  <v-app>
    <v-app-bar app :color="themeColor" dark>
      <v-app-bar-nav-icon @click="drawerOpen=!drawerOpen"></v-app-bar-nav-icon>
      <v-toolbar-title>Book Collab</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleDark">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawerOpen">
      <v-list nav>
        <v-list-item-group>
          <v-list-item v-for="(item,index) in navigationItems" :key="index" @click="navigateTo(item.routerName)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ item.text }}</v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </v-main>
    <app-snackbar></app-snackbar>
  </v-app>
</template>

<script>
import * as vuex from 'vuex'
import AppSnackbar from "@/components/AppSnackbar"

export default {
  name: 'App',
  components: {AppSnackbar},
  metaInfo: {
    title: 'Book Collab',
    titleTemplate: '%s | Book Collab',
  },
  data() {
    return {
      drawerOpen: false,
      navigationItems: [
        {icon: 'mdi-home', text: '主页', routerName: 'Index'},
        {icon: 'mdi-book', text: '书源', routerName: 'BookSource'},
        {icon: 'mdi-cogs', text: '设定', routerName: 'Settings'},
        {icon: 'mdi-scale-balance', text: 'DMCA', routerName: 'DMCA'},
      ]
    }
  },
  watch: {
    themeColor: {
      immediate: true,
      handler() {
        console.log('apply theme')
        this.applyTheme()
      }
    },
    $route() {
      if (window._czc) {
        let location = window.location
        let contentUrl = location.pathname + location.hash
        let refererUrl = '/'
        window._czc.push(['_trackPageview', contentUrl, refererUrl])
      }
    }
  },
  computed: {
    ...vuex.mapState([
      'themeColor'
    ])
  },
  mounted() {
    let umeng = document.createElement('script')
    umeng.src = 'https://v1.cnzz.com/z_stat.php?id=1280235112&web_id=1280235112'
    umeng.language = 'JavaScript'
    document.body.appendChild(umeng)
  },
  methods: {
    navigateTo(routerName, params = {}) {
      this.$router.push({name: routerName, params: params})
    },
    applyTheme() {
      this.$vuetify.theme.themes.light.primary = this.themeColor
    },
    toggleDark() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  }
}
</script>
