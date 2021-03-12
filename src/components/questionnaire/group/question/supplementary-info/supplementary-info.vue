<template>
  <v-list
    dense
    nav
    color="#f5f5f5"
  >
    <supplementary-info-comment
      v-if="displayExternalComment"
      :comment="selresponseoption.externalCommentRequirement"
      :comment-text="question.result ? question.result.externalComment : ''"
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
      :comment="selresponseoption.internalCommentRequirement"
      :comment-text="question.result ? question.result.internalComment : ''"
      :label="$t('app.questionnaire.group.question.internalComment')"
      :hint="$t('app.questionnaire.group.question.internalCommentInfo')"
      :group="group"
      :question="question"
      :read-only="readOnly"
      save-to-prop="internalComment"
      @error="onError"
    />
    <supplementary-info-files
      v-if="displayFile"
      :file="question.result ? question.result.files : []"
      :file-requirement="selresponseoption.fileRequirement"
      :label="$t('app.questionnaire.group.question.supplementaryFile.label')"
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
  </v-list>
</template>

<script>
import { mapState } from 'vuex'
import SupplementaryInfoComment from './supplementary-info-comment.vue'
import SupplementaryInfoFiles from './supplementary-info-files.vue'
import SupplementaryInfoImage from './supplementary-info-image.vue'
import { questionHasSupplementaryInfo } from '../../../../../utils.js'

export default {
  emits: ['error'],
  name: 'SupplementaryInfo',
  components: { SupplementaryInfoComment, SupplementaryInfoFiles, SupplementaryInfoImage },

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
    displayInternalComment () {
      return questionHasSupplementaryInfo(this.question) && this.selresponseoption && this.selresponseoption.internalCommentRequirement !== 'n/a'
    },
    displayExternalComment () {
      return questionHasSupplementaryInfo(this.question) && this.selresponseoption && this.selresponseoption.externalCommentRequirement !== 'n/a'
    },
    displayFile () {
      return questionHasSupplementaryInfo(this.question) && this.selresponseoption && this.selresponseoption.fileRequirement !== 'n/a'
    },
    displayPicture () {
      return questionHasSupplementaryInfo(this.question) && this.selresponseoption && this.selresponseoption.picture.option !== 'n/a'
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
