<template>
  <base-focus-area-single>
    <v-card>
      <v-subheader>小说列表</v-subheader>
      <v-progress-linear indeterminate></v-progress-linear>
    </v-card>
  </base-focus-area-single>

</template>

<script>
import BaseFocusAreaSingle from "@/components/BaseFocusAreaSingle"

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
  components: {
    BaseFocusAreaSingle,
  },
}
</script>
