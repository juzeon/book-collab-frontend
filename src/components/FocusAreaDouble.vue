<template>
  <v-container class="box">
    <slot></slot>
  </v-container>
</template>

<script>
export default {
  name: "FocusAreaDouble",
}
</script>

<style scoped>
.box {
  /*column-width: 35vw;*/
  column-count: 2;
  column-rule: 2px dashed grey; /* 列之间的分隔线 */
  column-gap: 40px; /* 列之间的间距 */
  max-width: 95%;
  overflow-y: hidden;
  height: calc(99vh - 64px);
  /*column-width: 600px;*/ /* 列的宽度,宽度足够大的话,可能只会显示2列/1列 (不常用,可使用column-count) */
}
</style>
