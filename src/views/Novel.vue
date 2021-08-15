<template>
  <focus-area-single>
    <v-row class="mt-3" v-show="loading">
      <v-progress-circular indeterminate class="mx-auto"></v-progress-circular>
    </v-row>
    <div v-show="!loading">
      <v-card class="pa-3">
        <v-row>
          <v-btn icon class="ml-2 mt-2" @click="navigateBack">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-img :src="coverImgSrc"></v-img>
          </v-col>
          <v-col cols="9">
            <p class="text-h4">{{ novelTitle }}</p>
            <p class="body-1" v-html="novelIntro"></p>
          </v-col>
        </v-row>
        <v-row class="mx-2 mb-1">
          <v-chip outlined label color="green" v-for="(item,index) in tagArr" :key="index" class="mx-1">标签 | {{
              item
            }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-chip outlined label color="blue">字数 | {{ novelWordcount }}</v-chip>
        </v-row>
        <v-card-actions>
          <v-menu>
            <template #activator="{on,attrs}">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(item,index) in downloadSelector" :key="index">
                <v-list-item-title>
                  <a target="_blank" :href="$config.baseUrl+'novel/download/'+novelId+'?'+item.queryUri">
                    {{ item.text }}
                  </a>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn icon class="ml-2">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-data-table
          dense
          class="mt-5"
          :headers="tableHeader"
          :items="toc"
          :items-per-page="50"
          :footer-props="{'items-per-page-options':[50,100,200,-1],showFirstLastPage:true}"
          @update:page="$vuetify.goTo(0)"
      >
        <template #top>
          <p class="mx-2">目录</p>
        </template>
      </v-data-table>
    </div>
    <back-to-top-fab></back-to-top-fab>
  </focus-area-single>
</template>

<script>
import FocusAreaSingle from "@/components/FocusAreaSingle"
import BackToTopFab from "@/components/BackToTopFab"

export default {
  name: "Novel",
  metaInfo() {
    return {
      title: this.novelTitle
    }
  },
  props: {
    novelId: [Number, String]
  },
  data() {
    return {
      loading: true,
      novelInfo: null,
      tableHeader: [
        {text: 'OrderID', value: 'orderId'},
        {text: '标题', value: 'title', sortable: false},
        {text: '字数', value: 'wordcount'}
      ],
      downloadSelector: [
        {text: '下载带章节TXT', queryUri: ''},
        {text: '下载带章节TXT（Fallback）', queryUri: 'fallback=1'},
        {text: '下载原始TXT', queryUri: 'raw=1'}
      ]
    }
  },
  computed: {
    novelTitle() {
      return this.novelInfo?.meta?.title || '小说'
    },
    coverImgSrc() {
      return this.$helper.getCoverImg()
    },
    tagArr() {
      if (this.novelInfo?.meta?.tags) {
        return this.$helper.tagsToTagArr(this.novelInfo.meta.tags)
      }
      return []
    },
    toc() {
      return this.novelInfo?.toc || []
    },
    novelIntro() {
      return this.novelInfo?.meta?.intro?.replace(/\n/g, '<br/>') || ''
    },
    novelWordcount() {
      return this.novelInfo?.meta?.wordcount ? this.$helper.transNumber(this.novelInfo.meta.wordcount) : -1
    }
  },
  watch: {
    novelId() {
      this.getNovelInfo()
    }
  },
  created() {
    this.getNovelInfo()
  },
  methods: {
    getNovelInfo() {
      this.loading = true
      this.novelInfo = null
      this.$axios.get('novel/' + this.novelId).then(res => {
        this.novelInfo = res.data.data
        this.loading = false
      })
    },
    navigateBack() {
      this.$router.push({name: 'Index'})
    }
  },
  components: {BackToTopFab, FocusAreaSingle}
}
</script>

<style scoped>

</style>
