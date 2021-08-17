<template>
  <focus-area-single :md-block-taken="mdBlockTaken">
    <p v-html="contentText" :style="{fontSize:fontSize+'px'}"></p>
    <p v-intersect="onEndIntersect">&nbsp;</p>
    <v-overlay :value="loading">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-fab-transition>
      <v-btn fab elevation="2" fixed right bottom dark color="primary" @click.stop="moreActionsDialogOpen=true">
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
            <v-select v-model="fontSize" label="字号" :items="fontSizeSelections" style="max-width: 100px"
                      class="ml-4"></v-select>
            <v-select v-model="linePadding" label="行距" :items="linePaddingSelections" style="max-width: 100px"
                      class="ml-4"></v-select>
            <v-select v-model="mdBlockTaken" label="阅读宽度" :items="mdBlockTakenSelections" style="max-width: 100px"
                      class="ml-4"></v-select>
            <v-switch v-model="useFallback" label="Fallback模式" class="ml-4"></v-switch>
          </v-row>
          <novel-toc-table :toc="toc" :per-page="10" :novelId="+novelId" :view-type="viewType">
          </novel-toc-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </focus-area-single>
</template>

<script>
import NovelTocTable from "@/components/NovelTocTable"
import FocusAreaSingle from "@/components/FocusAreaSingle"

export default {
  name: "Read",
  components: {FocusAreaSingle, NovelTocTable},
  props: {
    novelId: [Number, String],
    viewType: String,// normal, fallback
    rawOrderId: [Number, String]
  },
  data() {
    return {
      enableIntersect: false,
      isEndIntersecting: false,
      novelInfo: null,
      loading: true,
      tinyLoading: false,
      moreActionsDialogOpen: false,
      contentArr: [],// orderId title content
      fontSizeSelections: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      linePaddingSelections: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      mdBlockTakenSelections: [2, 4, 6, 8, 12]
    }
  },
  watch: {
    routerHash() {
      this.getNovelInfo()
    },
    isEndIntersecting() {
      console.log('I noticed isEndIntersecting is ' + this.isEndIntersecting)
      this.checkGetNextChapter()
    }
  },
  computed: {
    fontSize: {
      get() {
        return parseInt(this.$store.state.readingFontSize)
      },
      set(value) {
        this.$store.commit('setReadingFontSize', value)
      }
    },
    linePadding: {
      get() {
        return parseInt(this.$store.state.readingLinePadding)
      },
      set(value) {
        this.$store.commit('setReadingLinePadding', value)
      }
    },
    mdBlockTaken: {
      get() {
        return parseInt(this.$store.state.readingMdBlockTaken)
      },
      set(value) {
        this.$store.commit('setReadingMdBlockTaken', value)
      }
    },
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
        text += '<span class="text-h6 font-weight-bold">' + str.title
            + '</span><div style="padding-top: ' + this.linePadding + 'px"></div>'
            + str.content.replace(/\n/g, '<div style="padding-top: ' + this.linePadding + 'px"></div>')
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
    onEndIntersect(entries, observer) {
      this.isEndIntersecting = entries[0].isIntersecting
      console.log('End Intersecting: ' + this.isEndIntersecting)
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
      if (!this.enableIntersect || !this.isEndIntersecting || this.fetchedOrderIdEnd >= this.novelInfo.toc.length - 1) return
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
