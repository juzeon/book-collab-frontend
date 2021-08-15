<template>
  <v-snackbar v-model="open" :timeout="3000">
    {{ text }}
    <template #action="{attrs}">
      <v-btn color="pink lighten-3" text v-bind="attrs" @click="open=false">关闭</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import * as vuex from 'vuex'
export default {
  name: "AppSnackbar",
  computed: {
    open: {
      set(value) {
        this.$store.commit('setSnackBarStatus', value)
      },
      get() {
        return this.$store.state.snackBarOpen
      }
    },
    ...vuex.mapState({text: 'snackBarText'})
  }
}
</script>

<style scoped>

</style>
