<template>
  <focus-area-single>
    <v-card flat outlined :loading="loading">
      <v-row no-gutters class="mx-6">
        <v-col cols="11">
          <v-text-field prepend-icon="mdi-magnify" v-model="searchText"></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn class="mt-3 ml-2">套用</v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters class="mx-6" v-for="(filterItem,index) in searchFilters" :key="'sf-'+index">
        <v-col cols="2">
          <p class="mt-1">{{ filterItem.text }}：</p>
        </v-col>
        <v-col cols="10">
          <v-chip close @click:close="removeFromSearchFilterList(index,chipItem)"
                  :color="filterItem.chipColor"
                  text-color="white" class="mr-1"
                  v-for="(chipItem,jndex) in filterItem.list" :key="'sf-'+index+'-'+jndex">
            {{ chipItem }}
          </v-chip>
          <v-dialog max-width="300px" v-model="filterItem.dialog">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon right absolute v-on="on" v-bind="attrs">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>新加入 {{ filterItem.text }}</v-card-title>
              <v-card-text>
                <v-text-field :label="filterItem.text"
                              v-model="filterItem.bufferedText">
                </v-text-field>
                <p v-if="index===2 || index===3">提示：用单个「#」表示无标签。</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="filterItem.dialog=false">取消</v-btn>
                <v-btn text @click="addToSearchFilterList(index,filterItem.bufferedText)">确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-text>
        <v-subheader>小说列表</v-subheader>
        <v-row>
          <v-col cols="6" v-for="(item,index) in novelListCurrent" :key="'nli-'+index">
            <novel-list-item :name="item.title" :novelId="item.id"
                             :tags="item.tags" :wordcount="item.wordcount"></novel-list-item>
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
      novelListAll: [],
      novelListAllFiltered: [],
      page: 1,
      perPage: 20,
      searchFilters: [
        {text: '必含关键词', list: [], dialog: false, bufferedText: '', chipColor: 'blue', searchTextAppend: ''},
        {text: '封印关键词', list: [], dialog: false, bufferedText: '', chipColor: 'orange', searchTextAppend: '-'},
        {text: '必含标签', list: [], dialog: false, bufferedText: '', chipColor: 'blue', searchTextAppend: '#'},
        {text: '封印标签', list: [], dialog: false, bufferedText: '', chipColor: 'orange', searchTextAppend: '-#'}
      ],
      searchText: ''
    }
  },
  computed: {
    novelListCurrent() {
      return this.novelListAllFiltered.slice((this.page - 1) * this.perPage, this.page * this.perPage)
    }
  },
  created() {
    this.getList()
  },
  watch: {
    novelListAll() {
      this.filterNovelList()
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.novelListAll = []
      this.$axios.get('novel/listAll').then(res => {
        this.novelListAll = res.data.data
        this.loading = false
      })
    },
    filterNovelList() {
      console.log('Now let\'s do filtering')
      this.loading = true
      let list = this.novelListAll
      for (let name of this.searchFilters[0].list) {
        list = list.filter(value => value.title.includes(name))
      }
      for (let name of this.searchFilters[1].list) {
        list = list.filter(value => !value.title.includes(name))
      }
      for (let name of this.searchFilters[2].list) {
        list = list.filter(value => {
          if (name === '#') {
            if (value.tags) {
              return false
            } else {
              return true
            }
          } else {
            if (value.tags) {
              return this.$helper.tagsToTagArr(value.tags).includes(name)
            } else {
              return false
            }
          }
        })
      }
      for (let name of this.searchFilters[3].list) {
        list = list.filter(value => {
          if (value.tags) {
            return !this.$helper.tagsToTagArr(value.tags).includes(name)
          } else {
            if (name === '#') {
              return false
            } else {
              return true
            }
          }
        })
      }
      console.log('OK, filtered arr length: ' + list.length)
      this.novelListAllFiltered = list
      this.loading = false
    },
    removeFromSearchFilterList(filterIndex, name) {
      this.searchFilters[filterIndex].list = this.searchFilters[filterIndex].list.filter(value => value !== name)
      this.updateSearchFilterListToText()
      this.filterNovelList()
    },
    addToSearchFilterList(filterIndex, name) {
      if (!name.length) {
        this.$helper.alert.error('内容不能为空')
        return
      }
      if (name.includes(',') || name.includes(' ') || name.includes('-')) {
        this.$helper.alert.error('内容不能包含「,」、「 」、「-」')
        return
      }
      if ((filterIndex === 2 || filterIndex === 3) && name.includes('#') && name !== '#') {
        this.$helper.alert.error('当标签包含「#」时，只允许用单个「#」表示无标签')
        return
      }
      if ((filterIndex === 0 || filterIndex === 1) && name.includes('#')) {
        this.$helper.alert.error('关键词不能包含「#」')
        return
      }
      if (this.searchFilters[filterIndex].list.includes(name)) {
        this.$helper.alert.error('内容已存在')
        return
      }
      this.searchFilters[filterIndex].list.push(name)
      this.searchFilters[filterIndex].bufferedText = ''
      this.updateSearchFilterListToText()
      this.searchFilters[filterIndex].dialog = false
      this.filterNovelList()
    },
    updateSearchFilterListToText() {
      let text = ''
      for (let [index, item] of this.searchFilters.entries()) {
        for (let name of item.list) {
          text += item.searchTextAppend + name + ' '
        }
      }
      text = text.trim()
      this.searchText = text
    }
  },
  components: {
    NovelListItem,
    FocusAreaSingle,
  },
}
</script>
