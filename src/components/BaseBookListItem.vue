<template>
<v-card height="130" class="ma-1" hover>
  <v-row>
    <v-col cols="4">
      <v-img height="110" class="fill-height ml-2" src="https://api.skyju.cc/mobile-acg/api.php?method=get"></v-img>
    </v-col>
    <v-col>
      <p class="text-h6">{{name}}</p>
      <p class="body-2 text-truncate">{{intro}}</p>
    </v-col>
  </v-row>
</v-card>
</template>

<script>
export default {
  name: "BaseBookListItem",
  props:{
    name:String,
    intro:String,
    id:Number
  }
}
</script>

<style scoped>

</style>
