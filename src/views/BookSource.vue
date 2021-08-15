<template>
  <focus-area-single>
    <v-container>
      <p class="text-h4">添加书源配置到「阅读」应用</p>
      <p>阅读是一款可以自定义来源阅读网络内容的工具，为广大网络文学爱好者提供一种方便、快捷舒适的试读体验。（来自「阅读」GitHub主页的介绍文字）</p>
      <p>您可以使用「阅读」（Legado APP）接入本站的API，请按以下步骤操作。</p>
      <p class="text-h6">1. 下载并安装「阅读」应用。</p>
      <p><a href="https://github.com/gedoor/legado/releases" target="_blank">GitHub</a></p>
      <p><a href="https://www.coolapk.com/apk/256030" target="_blank">酷安</a></p>
      <p class="text-h6">2. 添加主要书源</p>
      <p>主要书源包含为小说自动断章的功能，建议大部分情况使用。</p>
      <p>打开「阅读」，点击「我的」——「书源管理」——右上角选项图标——「建立书源」。</p>
      <p>复制下面的配置，然后点击右上角选项图标——「贴上源」</p>
      <v-btn text elevation="1" class="my-2" @click="copyToClip(bookSource)">复制到剪贴簿</v-btn>
      <code>
        {{ bookSource }}
      </code>
      <v-btn text elevation="1" class="my-2" @click="copyToClip(bookSource)">复制到剪贴簿</v-btn>
      <p>最后点击右上角保存图标。</p>
      <p class="text-h6">3. 添加备用书源</p>
      <p>在部分情况下，自动断章可能会出现问题，以致使用主要书源几乎无法阅读。备用书源通过字数断章。
        您可以添加备用书源，以便在主要书源无法使用时，通过「换源」操作切换到备用书源。</p>
      <p>备用书源的添加步骤与主要书源如出一辙。</p>
      <p>在「书源管理」页面，点击右上角选项图标——「建立书源」。</p>
      <p>复制下面的配置，然后点击右上角选项图标——「贴上源」</p>
      <v-btn text elevation="1" class="my-2" @click="copyToClip(bookSourceFallback)">复制到剪贴簿</v-btn>
      <code>
        {{bookSourceFallback}}
      </code>
      <v-btn text elevation="1" class="my-2" @click="copyToClip(bookSourceFallback)">复制到剪贴簿</v-btn>
      <p>最后点击右上角保存图标。</p>
      <p class="text-h6">4. 使用「阅读」的搜寻功能</p>
      <p>在「阅读」内，我们通过API提供基础搜寻功能。您可以使用以下语法：</p>
      <ul>
        <li>关键词：直接输入关键词使用关键词搜寻。例如：<code class="d-inline-block">魔法</code></li>
        <li>标签：输入「#」+标签名使用标签搜寻。例如：<code class="d-inline-block">#GL</code></li>
      </ul>
      <p>多个关键词或标签之间用空格分开。</p>
      <p>「阅读」内搜寻功能有限，如需获得更加精确的结果，请使用本站的在线搜寻。</p>
    </v-container>
  </focus-area-single>
</template>

<script>
import FocusAreaSingle from "@/components/FocusAreaSingle"

export default {
  name: "BookSource",
  components: {FocusAreaSingle},
  data() {
    return {
      bookSource: '',
      bookSourceFallback: '',
      publicPath: process.env.BASE_URL
    }
  },
  metaInfo: {
    title: '书源'
  },
  created() {
    this.getBookSources()
  },
  methods: {
    getBookSources() {
      console.log(this.publicPath)
      this.$pureAxios.get(this.publicPath + 'bookSource.json', {transformResponse: (res) => res}).then(res => {
        this.bookSource = res.data
      })
      this.$pureAxios.get(this.publicPath + 'bookSourceFallback.json', {transformResponse: (res) => res}).then(res => {
        this.bookSourceFallback = res.data
      })
    },
    copyToClip(text){
      this.$helper.copyToClipboard(text)
      this.$store.commit('openSnackBar','已复制到剪贴簿')
    }
  }
}
</script>

<style scoped>
code {
  display: block;
  white-space: pre-wrap
}
</style>
