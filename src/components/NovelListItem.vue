<template>
  <div>
    <v-dialog
        v-model="dialog"
        width="500">
      <v-card :loading="loading">
        <v-card-title class="text-h5 lighten-2">简介</v-card-title>
        <v-card-text v-html="introWithBr"></v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">了解</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card height="130" class="ma-1" hover>
      <v-row @click="openNovel">
        <v-col cols="3">
          <v-img height="110" class="fill-height ml-2" :src="imgSrc"></v-img>
        </v-col>
        <v-col cols="9" style="position: relative">
          <p class="body-1 font-weight-bold">{{ name }}</p>
          <div style="position: absolute;left: 0;bottom: 0;" class="mb-3 ml-3">
            <v-chip outlined label color="blue" x-small>{{ $helper.transNumber(wordcount) }}字</v-chip>
            <v-chip outlined label color="green" v-for="(item,index) in tagArr" :key="index" x-small>{{ item }}</v-chip>
          </div>
        </v-col>
      </v-row>
      <v-btn icon right style="position: absolute;right: 0;bottom: 0;" @click="openDetailDialog">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "NovelListItem",
  props: {
    name: String,
    novelId: Number,
    tags: String,
    wordcount: Number
  },
  data() {
    return {
      dialog: false,
      novelInfo: null,
      loading: true
    }
  },
  computed: {
    imgSrc() {
      return this.$helper.getCoverImg()
    },
    introWithBr() {
      return this.novelInfo?.meta?.intro?.replace(/\n/g, '<br/>') || '加载中...'
    },
    tagArr() {
      if (this.tags) {
        return this.$helper.tagsToTagArr(this.tags)
      }
      return []
    }
  },
  methods: {
    openNovel() {
      this.$router.push({name: 'Novel', params: {novelId: this.novelId}})
    },
    openDetailDialog() {
      this.dialog = true
      this.getNovelInfo()
    },
    getNovelInfo() {
      this.loading = true
      this.$axios.get('novel/' + this.novelId).then(res => {
        this.novelInfo = res.data.data
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
