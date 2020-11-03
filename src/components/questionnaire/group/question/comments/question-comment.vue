<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="subtitle-2">
      <span>
        {{ title }}
        <span
          v-if="isCommentRequired"
          style="color: red"
        >(required)
        </span>
        <span v-else>(optional)</span>
      </span>
      <!-- <v-icon
              v-if="!comment.validationState"
              color="red"
            >
              mdi-exclamation
            </v-icon>  -->
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-textarea
        v-model="comment.value"
        auto-grow
        outlined
        dense
        rows="1"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'QuestionComment',

  props: {
    title: {
      type: String,
      required: true
    },
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    isCommentRequired () {
      return this.comment.option === '1'
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

<style scoped></style>
