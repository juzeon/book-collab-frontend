<template>
<v-btn v-show="show" v-scroll="onScroll" fab fixed right bottom icon class="primary" dark elevation="2" @click="toTop">
  <v-icon>mdi-chevron-up</v-icon>
</v-btn>
</template>

<script>
export default {
  name: "BackToTopFab",
  data(){
    return {
      show:false
    }
  },
  methods: {
    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.show = top > 20
    },
    toTop () {
      this.$vuetify.goTo(0)
    }
  }
}
</script>

<style scoped>

</style>
