<template>
  <v-expansion-panels
    multiple
    flat
    :value="[]"
  >
    <supplementary-info-comment
      :comment="supplementaryInfo.externalComment"
      label="External Comment"
      hint="External comments will be available to the public"
      :group="group"
      :question="question"
      save-to-prop="externalComment"
      @error="error"
    />
    <supplementary-info-comment
      :comment="supplementaryInfo.internalComment"
      label="Internal Comment"
      hint="Internal comments will only be made available to internal stakeholders"
      :group="group"
      :question="question"
      save-to-prop="internalComment"
      @error="error"
    />
    <supplementary-info-image
      :picture="supplementaryInfo.picture"
      label="Photos"
      :group="group"
      :question="question"
      save-to-prop="images"
      @error="error"
    />
  </v-expansion-panels>
</template>

<script>
import SupplementaryInfoComment from './supplementary-info-comment.vue'
import SupplementaryInfoImage from './supplementary-info-image.vue'

export default {
  components: { SupplementaryInfoComment, SupplementaryInfoImage },

  props: {
    supplementaryInfoRule: {
      type: Object,
      required: true
    },
    question: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    }
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
