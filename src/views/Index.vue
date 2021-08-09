<template>
  <focus-area-single>
    <v-card flat outlined>
      <v-card-text>
        <v-subheader>小说列表</v-subheader>
        <v-progress-linear indeterminate></v-progress-linear>
        <v-row no-gutters>
          <v-col cols="6">
            <base-book-list-item name="书名书名书名" intro="简介简介简介" :id="1"></base-book-list-item>
          </v-col>
          <v-col cols="6">
            <base-book-list-item name="书名书名书名" intro="简介简介简介" :id="1"></base-book-list-item>
          </v-col>
        </v-row>
      </v-card-text>

    </v-card>
  </focus-area-single>

</template>

<script>
import FocusAreaSingle from "@/components/FocusAreaSingle"
import BaseBookListItem from "@/components/BaseBookListItem"

export default {
  name: 'Index',
  metaInfo: {
    title: '主页'
  },
  data() {
    return {
      loading: true
    }
  },
  methods:{
    getList(){
      this.$axios.get('novel/list').then(res =>{
        
      })
    }
  },
  components: {
    BaseBookListItem,
    FocusAreaSingle,
  },
}
</script>
