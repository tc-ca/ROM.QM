<template>
  <v-expansion-panels
    multiple
    flat
    :value="[]"
  >
    <supplementary-info-comment
      v-if="displayExternalComment"
      :comment="selresponseoption.externalComment"
      :label="$t('app.questionnaire.group.question.externalComment')"
      :hint="$t('app.questionnaire.group.question.externalCommentInfo')"
      :group="group"
      :question="question"
      :read-only="readOnly"
      save-to-prop="externalComment"
      @error="onError"
    />
    <supplementary-info-comment
      v-if="displayInternalComment"
      :comment="selresponseoption.internalComment"
      :label="$t('app.questionnaire.group.question.internalComment')"
      :hint="$t('app.questionnaire.group.question.internalCommentInfo')"
      :group="group"
      :question="question"
      :read-only="readOnly"
      save-to-prop="internalComment"
      @error="onError"
    />
    <div
      v-if="!isReferenceQuestion"
      style="width: 100%"
    >
      <supplementary-info-files
        v-if="displayPicture"
        :picture="selresponseoption.picture"
        :label="$t('app.questionnaire.group.question.files')"
        :group="group"
        :question="question"
        :read-only="readOnly"
        save-to-prop="images"
        @error="onError"
      />
      <supplementary-info-image
        v-if="displayPicture"
        :picture="selresponseoption.picture"
        :label="$t('app.questionnaire.group.question.photos')"
        :group="group"
        :question="question"
        :read-only="readOnly"
        save-to-prop="images"
        @error="onError"
      />
    </div>
  </v-expansion-panels>
</template>

<script>
import { mapState } from 'vuex'
import SupplementaryInfoComment from './supplementary-info-comment.vue'
import SupplementaryInfoImage from './supplementary-info-image.vue'
import SupplementaryInfoFiles from './supplementary-info-files.vue'

import { QUESTION_TYPE } from '../../../../../data/questionTypes'

export default {
  emits: ['error'],
  name: 'SupplementaryInfo',
  components: { SupplementaryInfoComment, SupplementaryInfoImage, SupplementaryInfoFiles },

  props: {
    question: {
      type: Object,
      required: true
    },
    selresponseoption: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isReferenceQuestion () {
      return this.question.type === QUESTION_TYPE.REFERENCE
    },
    displayInternalComment () {
      return this.selresponseoption.internalComment.option !== 'n/a'
    },
    displayExternalComment () {
      return this.selresponseoption.externalComment.option !== 'n/a'
    },
    displayPicture () {
      return this.selresponseoption.picture.option !== 'n/a'
    },
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    })
  },
  methods: {
    onError (error) {
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
