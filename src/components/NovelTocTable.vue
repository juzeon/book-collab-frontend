<template>
  <v-data-table
      dense
      class="mt-5"
      :headers="tableHeader"
      :items="toc"
      :items-per-page="perPage"
      :footer-props="{'items-per-page-options':[10,25,50,100,200,-1],showFirstLastPage:true}"
      @update:page="$emit('updatePage')"
  >
    <template #top>
      <p class="mx-2">目录</p>
    </template>
    <template #item.title="{ item }">
      <v-btn text class="no-uppercase" @click="clickTitle(item.orderId)">{{ item.title }}</v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "NovelTocTable",
  emits: ['updatePage','clickTitle'],
  props: {
    toc: Array,
    perPage: {
      type: Number,
      default: 50
    },
    novelId: Number,
    viewType: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return {
      tableHeader: [
        {text: 'OrderID', value: 'orderId'},
        {text: '标题', value: 'title', sortable: false},
        {text: '字数', value: 'wordcount'}
      ]
    }
  },
  methods: {
    navigateToRead(orderId) {
      this.$router.push({name: 'Read', params: {novelId: this.novelId, viewType: this.viewType, rawOrderId: orderId}})
    },
    clickTitle(orderId){
      this.navigateToRead(orderId)
      this.$emit('clickTitle')
    }
  }
}
</script>

<style scoped>
.no-uppercase {
  text-transform: none;
}
</style>
