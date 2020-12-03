<template>
  <v-expansion-panels
    multiple
    flat
    :value="[]"
  >
    <supplementary-info-comment
      v-if="displayExternalComment"
      :comment="question.externalComment"
      :label="$t('app.questionnaire.group.question.externalComment')"
      :hint="$t('app.questionnaire.group.question.externalCommentInfo')"
      :group="group"
      :question="question"
      save-to-prop="externalComment"
      @error="onError"
    />
    <supplementary-info-comment
      v-if="displayInternalComment"
      :comment="question.internalComment"
      :label="$t('app.questionnaire.group.question.internalComment')"
      :hint="$t('app.questionnaire.group.question.internalCommentInfo')"
      :group="group"
      :question="question"
      save-to-prop="internalComment"
      @error="onError"
    />
    <div v-if="!isReferenceQuestion">
      <supplementary-info-image
        v-if="displayPicture"
        :picture="question.picture"
        :label="$t('app.questionnaire.group.question.photos')"
        :group="group"
        :question="question"
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
import { QUESTION_TYPE } from '../../../../../data/questionTypes'

export default {
  emits: ['error'],
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
    isReferenceQuestion () {
      return this.question.type === QUESTION_TYPE.REFERENCE
    },
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
