<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="subtitle-2">
      <span>
        {{ title }}
        <span
          v-if="isPictureRequired"
          style="color: red"
        >(required)
        </span>
        <span v-else>(optional)</span>
      </span>
    </v-expansion-panel-header>
    <v-expansion-panel-content />
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PictureSlot',
  props: {
    title: {
      type: String,
      required: true
    },
    pictureReq: {
      type: Object,
      required: true
    }
  },
  computed: {
    isPictureRequired () {
      return this.pictureReq.option === '1'
    },
    ...mapState({
      lang: state => {
        if (!state || !state.app) {
          return 'en-US'
        }
        return state.app.settings.lang
      }
    })
  }
}
</script>

<style scoped>

</style>
