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
          <v-menu offset-y>
            <template #activator="{on,attrs}">
              <v-btn text v-bind="attrs" v-on="on">
                <v-icon>mdi-download</v-icon>
                下载
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
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn text class="ml-2" v-bind="attrs" v-on="on">
                <v-icon>mdi-eye</v-icon>
                预览
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="navigateToRead('normal')">
                <v-list-item-title>Normal模式</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navigateToRead('fallback')">
                <v-list-item-title>Fallback模式</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-dialog max-width="500px" v-model="updateTagsDialog">
            <template #activator="{on,attrs}">
              <v-btn text class="ml-2" v-show="adminKey.length" v-on="on" v-bind="attrs">
                <v-icon>mdi-tag-multiple</v-icon>
                标签
              </v-btn>
            </template>
            <v-card>
              <v-card-title>更改标签</v-card-title>
              <v-container>
                <v-text-field label="标签（英文逗号隔开）" v-model="inputTags"></v-text-field>
                <v-subheader>所有标签</v-subheader>
                <v-chip v-for="(item,index) in allTagArr" :key="'at-'+index" class="ml-1 mt-1"
                        @click="addTagToInputTags(item.name)">
                  <v-icon>mdi-tag</v-icon>
                  {{ item.name }} | {{ item.count }}
                </v-chip>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="updateTagsDialog=false">取消</v-btn>
                <v-btn text :loading="updateTagsLoading" @click="updateTags">确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog max-width="500px" v-model="updateSignifierDialog">
            <template #activator="{on,attrs}">
              <v-btn text class="ml-2" v-show="adminKey.length" v-on="on" v-bind="attrs">
                <v-icon>mdi-regex</v-icon>
                断章
              </v-btn>
            </template>
            <v-card>
              <v-card-title>更改断章正则</v-card-title>
              <v-container>
                <v-text-field label="用于标题的正则表达式" v-model="inputSignifier" :rules="[validateRegexp]"></v-text-field>
                <v-subheader>参考正则</v-subheader>
                <code>[1-9一二三四五六七八九十]+(章|回|幕|话|节|\.|、|:|：|，| )+</code>
              </v-container>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="updateSignifierDialog=false">取消</v-btn>
                <v-btn text :loading="updateSignifierLoading" @click="updateSignifier">确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
      <novel-toc-table :toc="toc" :updatePage="$vuetify.goTo(0)" :novelId="+novelId"></novel-toc-table>
    </div>
    <back-to-top-fab></back-to-top-fab>
  </focus-area-single>
</template>

<script>
import FocusAreaSingle from "@/components/FocusAreaSingle"
import BackToTopFab from "@/components/BackToTopFab"
import NovelTocTable from "@/components/NovelTocTable"
import * as vuex from 'vuex'
import * as QueryString from "querystring"

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
      downloadSelector: [
        {text: '下载带章节TXT', queryUri: ''},
        {text: '下载带章节TXT（Fallback）', queryUri: 'fallback=1'},
        {text: '下载原始TXT', queryUri: 'raw=1'}
      ],
      inputTags: '',
      updateTagsLoading: false,
      allTagArr: [],
      updateTagsDialog: false,
      updateSignifierDialog: false,
      updateSignifierLoading: false,
      inputSignifier: ''
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
    },
    ...vuex.mapState({
      adminKey: 'adminKey'
    })
  },
  watch: {
    novelId() {
      this.getNovelInfo()
    }
  },
  mounted() {
    this.getNovelInfo()
    this.getAllTags()
  },
  methods: {
    getNovelInfo() {
      this.loading = true
      this.novelInfo = null
      this.$axios.get('novel/' + this.novelId).then(res => {
        this.novelInfo = res.data.data
        this.inputTags = this.novelInfo.meta.tags || ''
        this.inputSignifier = ''
        this.loading = false
      })
    },
    navigateBack() {
      this.$router.push({name: 'Index'})
    },
    navigateToRead(viewType) {
      this.$router.push({name: 'Read', params: {novelId: this.novelId, viewType: viewType, rawOrderId: 0}})
    },
    getAllTags() {
      this.$axios.get('tag/listAll').then(res => {
        this.allTagArr = res.data.data
      })
    },
    addTagToInputTags(tag) {
      let arr = this.inputTags.split(',')
      if (!arr.includes(tag)) {
        arr.push(tag)
      }
      this.inputTags = arr.join(',')
    },
    updateTags() {
      this.updateTagsLoading = true
      this.$axios.post('admin/updateTags', QueryString.stringify({
        novelId: this.novelId,
        tags: this.inputTags
      })).then(res => {
        this.getNovelInfo()
        this.getAllTags()
        this.updateTagsLoading = false
        this.updateTagsDialog = false
      })
    },
    validateRegexp(text) {
      if (!text.length) {
        return '正则表达式不能为空'
      }
      try {
        new RegExp(text)
        return true
      } catch (e) {
        return '必须为有效的正则表达式'
      }
    },
    updateSignifier() {
      this.updateSignifierLoading = true
      this.$axios.post('admin/updateSignifier', QueryString.stringify({
        novelId: this.novelId,
        signifier: this.inputSignifier
      })).then(res => {
        this.getNovelInfo()
        this.updateSignifierLoading = false
        this.updateSignifierDialog = false
      })
    }
  },
  components: {NovelTocTable, BackToTopFab, FocusAreaSingle}
}
</script>

<style scoped>

</style>
