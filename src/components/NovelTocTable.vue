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
  </v-data-table>
</template>

<script>
export default {
  name: "NovelTocTable",
  emits: ['updatePage'],
  props: {
    toc: Array,
    perPage: {
      type: Number,
      default: 50
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
  }
}
</script>

<style scoped>

</style>
