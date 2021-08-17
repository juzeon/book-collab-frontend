<template>
  <v-container>
    <v-row>
      <v-col cols="12" :md="mdBlockTaken" :offset-md="mdOffsetBlock">
        <slot></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "FocusAreaSingle",
  props: {
    mdBlockTaken: {
      type: Number,
      default: 10
    }
  },
  computed: {
    mdOffsetBlock() {
      return (12 - this.mdBlockTaken) / 2
    }
  }
}
</script>

<style scoped>

</style>
