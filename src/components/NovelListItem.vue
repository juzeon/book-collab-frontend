<template>
  <div>
    <v-dialog
        v-model="dialog"
        width="500">
      <v-card>
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
        <v-col cols="9">
          <p class="body-1 font-weight-bold">{{ name }}</p>
          <v-chip outlined label color="green" v-for="(item,index) in tagArr" :key="index">{{item}}</v-chip>
        </v-col>
      </v-row>
      <v-btn icon right style="position: absolute;right: 0;bottom: 0;" @click="dialog=!dialog">
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
    intro: String,
    novelId: Number,
    tags: String
  },
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    imgSrc() {
      return this.$helper.getCoverImg()
    },
    introWithBr() {
      return this.intro.replace(/\n/g, '<br/>')
    },
    tagArr(){
      if(this.tags){
        return this.$helper.tagsToTagArr(this.tags)
      }
      return []
    }
  },
  methods: {
    openNovel() {
      this.$router.push({name: 'Novel', params: {novelId: this.novelId}})
    }
  }
}
</script>

<style scoped>

</style>
