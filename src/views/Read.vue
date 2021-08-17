<template>
  <focus-area-double>
    <p v-html="contentText"></p>
    <p v-intersect="onRightIntersect" class="float-right">&nbsp;</p>
    <v-overlay :value="loading">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-fab-transition>
      <v-btn fab elevation="2" fixed left bottom dark color="primary" @click.stop="moreActionsDialogOpen=true">
        <v-progress-circular indeterminate v-show="tinyLoading"></v-progress-circular>
        <v-icon v-show="!tinyLoading">mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog v-model="moreActionsDialogOpen">
      <v-card>
        <v-card-title>更多操作</v-card-title>
        <v-btn icon absolute right top @click="moreActionsDialogOpen=false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-text>
          <v-row class="ml-1">
            <v-btn @click="navigateToNovel" class="mt-3">
              <v-icon>mdi-arrow-left</v-icon>
              退出
            </v-btn>
            <v-switch v-model="useFallback" label="Fallback模式" class="ml-4"></v-switch>
          </v-row>
          <novel-toc-table :toc="toc" :per-page="10" :novelId="+novelId" :view-type="viewType">
          </novel-toc-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </focus-area-double>
</template>

<script>
import FocusAreaDouble from "@/components/FocusAreaDouble"
import NovelTocTable from "@/components/NovelTocTable"

export default {
  name: "Read",
  components: {NovelTocTable, FocusAreaDouble},
  props: {
    novelId: [Number, String],
    viewType: String,// normal, fallback
    rawOrderId: [Number, String]
  },
  data() {
    return {
      enableIntersect: false,
      isRightIntersecting: false,
      novelInfo: null,
      loading: true,
      tinyLoading: false,
      moreActionsDialogOpen: false,
      contentArr: [],// orderId title content
    }
  },
  watch: {
    routerHash() {
      this.getNovelInfo()
    },
    isRightIntersecting() {
      console.log('I noticed isRightIntersecting is ' + this.isRightIntersecting)
      this.checkGetNextChapter()
    }
  },
  computed: {
    orderId() {
      return parseInt(this.rawOrderId)
    },
    toc() {
      return this.novelInfo?.toc || []
    },
    useFallback: {
      get() {
        return this.viewType === 'fallback'
      },
      set(value) {
        this.$router.push({
          name: 'Read',
          params: {
            novelId: this.novelId,
            viewType: this.useFallback ? 'normal' : 'fallback',
            rawOrderId: 0
          }
        })
      }
    },
    contentText() {
      console.log('I generated content text with arr length ' + this.contentArr.length)
      let text = ''
      for (let str of this.contentArr) {
        text += '<b>' + str.title + '</b><br/>' + str.content.replace(/\n/g, '<br/>')
      }
      return text
    },
    fetchedOrderIdBegin() {
      if (this.contentArr.length) {
        return this.contentArr[0].orderId
      } else {
        return this.orderId
      }
    },
    fetchedOrderIdEnd() {
      if (this.contentArr.length) {
        return this.contentArr[this.contentArr.length - 1].orderId
      } else {
        return this.orderId
      }
    },
    routerHash() {
      return this.novelId + this.viewType + this.rawOrderId
    }
  },
  mounted() {
    this.getNovelInfo()
  },
  methods: {
    onRightIntersect(entries, observer) {
      this.isRightIntersecting = entries[0].isIntersecting
      console.log('Right Intersecting: ' + this.isRightIntersecting)
    },
    getNovelInfo() {
      this.enableIntersect = false
      this.loading = true
      this.contentArr = []
      this.moreActionsDialogOpen = false
      this.$axios.get('novel/' + this.novelId + (this.useFallback ? '?fallback=1' : '')).then(res => {
        this.novelInfo = res.data.data
        this.loading = false
        console.log('Done get novel info')
        this.getChapter(this.orderId)
      })
    },
    navigateToNovel() {
      this.$router.push({name: 'Novel', params: {novelId: this.novelId}})
    },
    getChapter(orderId) {
      this.enableIntersect = false
      this.tinyLoading = true
      this.$axios.get('novel/' + this.novelId + '/chapter/' + orderId + (this.useFallback ? '?fallback=1' : '')).then(res => {
        this.contentArr.push({orderId: orderId, title: res.data.data.title, content: res.data.data.content})
        this.contentArr.sort((a, b) => {
          return a.orderId - b.orderId
        })
        this.tinyLoading = false
        this.enableIntersect = true
        console.log('Done get chapter with orderId ' + orderId)
        setTimeout(() => {
          this.checkGetNextChapter()
        }, 100)
      })
    },
    checkGetNextChapter() {
      if (!this.enableIntersect || !this.isRightIntersecting || this.fetchedOrderIdEnd >= this.novelInfo.toc.length - 1) return
      console.log(`FIRE getting next chapter`)
      this.getChapter(this.fetchedOrderIdEnd + 1)
    }
  },
  metaInfo: {
    title: '阅读'
  },
}
</script>

<style scoped>

</style>
