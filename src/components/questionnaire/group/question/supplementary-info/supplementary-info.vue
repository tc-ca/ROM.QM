<template>
  <v-expansion-panels
    multiple
    flat
    :value="[]"
  >
    <supplementary-info-comment
      v-if="displayExternalComment"
      :comment="question.externalComment"
      label="External Comment"
      hint="External comments will be available to the public"
      :group="group"
      :question="question"
      save-to-prop="externalComment"
      @error="error"
    />
    <supplementary-info-comment
      v-if="displayInternalComment"
      :comment="question.internalComment"
      label="Internal Comment"
      hint="Internal comments will only be made available to internal stakeholders"
      :group="group"
      :question="question"
      save-to-prop="internalComment"
      @error="error"
    />
    <supplementary-info-image
      v-if="displayPicture"
      :picture="question.picture"
      label="Photos"
      :group="group"
      :question="question"
      save-to-prop="images"
      @error="error"
    />
  </v-expansion-panels>
</template>

<script>
import { mapState } from 'vuex'
import SupplementaryInfoComment from './supplementary-info-comment.vue'
import SupplementaryInfoImage from './supplementary-info-image.vue'

export default {
  name: 'SupplementaryInfo',
  components: { SupplementaryInfoComment, SupplementaryInfoImage },

  props: {
    question: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    }
  },
  computed: {
    displayInternalComment () {
      return this.question.internalComment.option !== 'n/a'
    },
    displayExternalComment () {
      return this.question.externalComment.option !== 'n/a'
    },
    displayPicture () {
      return this.question.picture.option !== 'n/a'
    },
    ...mapState({
      lang: state => {
        if (!state || !state.app) {
          return 'en-US'
        }
        return state.app.settings.lang
      }
    })
  },
  methods: {
    error (error) {
      this.$emit('error', error)
    }
  }
}
</script>

<style scoped>
/* TODO: submit a bug to vuetify github repo, as unable to override the expansion-panel-content-wrap when applying scope, no data id is applied */
/* .v-expansion-panel-content__wrap {
  padding: 0px !important;
}
div.v-expansion-panel-content__wrap {
  padding: 0px !important;
} */
</style>
