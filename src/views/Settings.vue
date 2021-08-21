<template>
  <focus-area-single>
    <v-card class="pa-5">
      <v-card-title class="font-weight-bold text-h4 mb-6">设定</v-card-title>
      <v-row dense>
        <v-col cols="12" class="d-flex">
          <p class="text-h6">小说列表设定</p>
        </v-col>
        <v-col cols="12">
          <v-switch v-model="listingSingleColumn" label="启用单栏"></v-switch>
        </v-col>
        <v-col cols="12">
          <v-switch v-model="listingGoToTopAfterPageChange" label="翻页后返回顶部"></v-switch>
        </v-col>
        <v-col cols="12">
          <v-slider v-model="listingPerPage" step="10" min="10" max="500"
                    :label="`每页展示数量（${listingPerPage}）`"></v-slider>
        </v-col>
        <v-col cols="12" class="d-flex">
          <p class="text-h6">其他设定</p>
        </v-col>
        <v-col cols="12">
          <v-tooltip v-model="showAdminKeyRefreshRequest" right>
            <template #activator="{on,attrs}">
              <v-text-field v-model="adminKey" label="管理员Key" style="width: 35%"></v-text-field>
            </template>
            重新载入页面以套用
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card>
  </focus-area-single>
</template>

<script>
import FocusAreaSingle from "@/components/FocusAreaSingle"
import * as vuex from "vuex"


export default {
  name: "Settings",
  components: {FocusAreaSingle},
  metaInfo: {
    title: '设定'
  },
  data() {
    return {
      showAdminKeyRefreshRequest: false
    }
  },
  watch: {
    adminKey() {
      this.showAdminKeyRefreshRequest = true
    }
  },
  computed: {
    listingSingleColumn: {
      get() {
        return this.$store.state.listingSingleColumn
      },
      set(value) {
        this.$store.commit('setListingSingleColumn', value)
      }
    },
    listingPerPage: {
      get() {
        return this.$store.state.listingPerPage
      },
      set(value) {
        this.$store.commit('setListingPerPage', value)
      }
    },
    listingGoToTopAfterPageChange: {
      get() {
        return this.$store.state.listingGoToTopAfterPageChange
      },
      set(value) {
        this.$store.commit('setListingGoToTopAfterPageChange', value)
      }
    },
    adminKey: {
      get() {
        return this.$store.state.adminKey
      },
      set(value) {
        this.$store.commit('setAdminKey', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
