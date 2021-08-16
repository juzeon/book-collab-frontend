<template>
  <focus-area-single>
    <v-card flat outlined :loading="loading">
      <v-row no-gutters class="mx-6">
        <v-col cols="11">
          <v-text-field prepend-icon="mdi-magnify" v-model="searchText"></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn class="mt-3 ml-2" @click="updateTextToSearchFilterList">套用</v-btn>
        </v-col>
      </v-row>
      <v-container class="px-2 py-0">
        <v-menu v-for="(element,orderName) in orderData" :key="'om-'+orderName">
          <template #activator="{on,attrs}">
            <v-btn text v-bind="attrs" v-on="on" class="float-right">{{ element.text }}：{{
                element.current.text
              }}
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item v-for="(item,index) in element.list" :key="'om-'+orderName+'-'+index"
                         @click="changeOrderData(orderName,item)">
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
      <v-row no-gutters style="clear: both" class="mx-6" v-for="(filterItem,index) in searchFilters" :key="'sf-'+index">
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
          <v-col class="col-sm-12 col-md-6" v-for="(item,index) in novelListCurrent" :key="'nli-'+index">
            <novel-list-item :name="item.title" :novelId="item.id"
                             :tags="item.tags" :wordcount="item.wordcount"></novel-list-item>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-pagination
        v-model="page"
        class="my-4"
        :length="Math.ceil(novelListAllFiltered.length/perPage)"
        @input="$vuetify.goTo(0)"
    ></v-pagination>
    <back-to-top-fab></back-to-top-fab>
  </focus-area-single>

</template>

<script>
import FocusAreaSingle from "@/components/FocusAreaSingle"
import NovelListItem from "@/components/NovelListItem"
import BackToTopFab from "@/components/BackToTopFab"

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
      orderData: {
        orderBy: {
          text: '排序依',
          current: {slug: 'time', text: '添加时间'},
          list: [
            {slug: 'time', text: '添加时间'},
            {slug: 'wordcount', text: '字数'}
          ]
        },
        orderType: {
          text: '排序按',
          current: {slug: 'desc', text: '降序'},
          list: [
            {slug: 'desc', text: '降序'},
            {slug: 'asc', text: '升序'}
          ]
        }
      },
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
      let list = this.novelListAll.slice()
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

      // 对此list进行排序
      list.sort((a, b) => {
        let cp1 = a
        let cp2 = b
        if (this.orderData.orderType.current.slug === 'desc') {
          cp1 = b
          cp2 = a
        }
        switch (this.orderData.orderBy.current.slug) {
          default:
          case 'time':
            return cp1.time - cp2.time
          case 'wordcount':
            return cp1.wordcount - cp2.wordcount
        }
      })

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
    },
    updateTextToSearchFilterList() {
      let arr = this.searchText.split(' ').filter(value => value.length !== 0)
      let filtersMap = [[], [], [], []]
      for (let name of arr) {
        console.log('look at ' + name)
        for (let [index, item] of this.searchFilters.slice().reverse().entries()) {
          console.log('check ' + index + ': ' + item.text + ' with ' + item.searchTextAppend)
          if (name.startsWith(item.searchTextAppend)) {
            console.log(name + ' starts with ' + item.searchTextAppend + ' at index ' + index)
            filtersMap[index].push(name.replace(item.searchTextAppend, ''))
            break
          }
        }
      }
      for (let [index, list] of filtersMap.slice().reverse().entries()) {
        this.searchFilters[index].list = list
      }
      this.filterNovelList()
      this.updateSearchFilterListToText()
    },
    changeOrderData(orderName, newCurrent) {
      this.orderData[orderName].current = newCurrent
      this.filterNovelList()
    }
  },
  components: {
    BackToTopFab,
    NovelListItem,
    FocusAreaSingle,
  },
}
</script>
