<template>
  <focus-area-single>
    <v-card flat outlined>
      <v-card-text>
        <v-subheader>小说列表</v-subheader>
        <v-progress-linear indeterminate v-show="loading"></v-progress-linear>
        <v-row>
          <v-col cols="6" v-for="(item,index) in bookList" :key="index">
            <novel-list-item :name="item.title" :intro="item.intro" :id="item.id"></novel-list-item>
          </v-col>
        </v-row>
      </v-card-text>

    </v-card>
  </focus-area-single>

</template>

<script>
import FocusAreaSingle from "@/components/FocusAreaSingle"
import NovelListItem from "@/components/NovelListItem"

export default {
  name: 'Index',
  metaInfo: {
    title: '主页'
  },
  data() {
    return {
      loading: true,
      bookList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$axios.get('novel/list').then(res => {
        this.bookList = res.data.data
        this.loading = false
      })
    }
  },
  components: {
    NovelListItem,
    FocusAreaSingle,
  },
}
</script>
