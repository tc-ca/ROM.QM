<template>
  <v-expansion-panel
    v-show="question.isVisible"
  >
    <v-expansion-panel-header
      ripple
    >
      <template
        #actions
      >
        <v-icon
          v-if="expansion && isValid === false"
          color="red"
        >
          mdi-exclamation
        </v-icon>
        <v-icon v-if="expansion">
          mdi-menu-down
        </v-icon>
      </template>

      <div
        :style="{fontSize:'16px !important'}"
      >
        <!-- eslint-disable vue/no-v-html -->
        <span
          class="text-break"
          v-html="questionText"
        />
      </div>
      <!--eslint-enable-->
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
      <div :class="{'mt-5': expansion}">
        <response
          :question="question"
          :group="group"
          @change="onUserResponseChanged"
          @error="onError"
        />
      </div>

      <violation-info v-if="displayViolationInfo" />

      <section>
        <v-expansion-panel v-show="displayInternalComment">
          <v-expansion-panel-header class="subtitle-2">
            <span>
              Internal Comment
              <span
                v-if="isInternalCommentRequired"
                style="color: red"
              >(required)</span>
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
              v-model="question.internalComment.value"
              auto-grow
              outlined
              dense
              rows="1"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </section>
      <div>
        <v-expansion-panels
          hover
          focusable
          multiple
        >
          <question
            v-for="(childQuestion, questionIndex) in question.childQuestions"
            ref="groupQuestion"
            :key="questionIndex"
            :question="childQuestion"
            :group="group"
            :index="questionIndex"
            :in-repeated-group="inRepeatedGroup"
            :expansion="true"
            @error="onChildError"
          />
        </v-expansion-panels>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>

import { mapState } from 'vuex'
import Response from './response/response.vue'
// import SupplementaryInfo from './supplementary-info/supplementary-info.vue'
import ViolationInfo from './violation-info/violation-info.vue'

export default {
  name: 'Question',
  components: { Response, ViolationInfo },

  props: {
    question: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    inRepeatedGroup: {
      type: Boolean, required: true
    },
    expansion: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      displayViolationInfo: false,
      isValid: null
    }
  },
  computed: {
    questionText () {
      return `${this.index + 1}. ${this.question.text[this.lang]}`
    },
    displayInternalComment () {
      return this.question.internalComment.option !== '3'
    },
    displayExternalComment () {
      return this.question.externalComment.option !== '3'
    },
    displayPicture () {
      return this.question.picture.option !== '3'
    },
    isInternalCommentRequired () {
      return this.question.internalComment.option === '1'
    },
    isExternalCommentRequired () {
      return this.question.externalComment.option === '1'
    },
    isPictureRequired () {
      return this.question.picture.option === '1'
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
  mounted () {
    this.question.childQuestions.sort((a, b) => a.sortOrder - b.sortOrder)
  },
  methods: {
    onUserResponseChanged (args) {
      this.updateViolationInfo(args)
      this.updateDependants(args)
      this.isValid = this.getChildQuestionValidationState()
      this.$emit('responseChanged')
    },
    updateViolationInfo (args) {
      if (this.question.violationInfo.matchingType === 'equal') {
        this.displayViolationInfo = this.question.violationInfo.responseToMatch === args.value
      } else if (this.question.violationInfo.matchingType === 'notEqual') {
        this.displayViolationInfo = this.question.violationInfo.responseToMatch !== args.value
      }
    },
    updateDependants (args) {
      this.question.response = args.value
      if (this.question.dependants) {
        for (let i = 0; i < this.question.dependants.length; i++) {
          let dependentQuestion = this.question.dependants[i]
          this.updateChildQuestionOnDependencies(dependentQuestion)
        }
      }
    },
    updateChildQuestionOnDependencies (question) {
      for (let i = 0; i < question.dependencyGroups.length; i++) {
        let group = question.dependencyGroups[i]

        let groupMatch = true
        for (let j = 0; j < group.questionDependencies.length; j++) {
          let dependancy = group.questionDependencies[j]
          let dependsOnQuestion = dependancy.dependsOnQuestion
          if (dependancy.validationAction === 'equal') {
            if (!(dependsOnQuestion.response === dependancy.validationValue)) {
              groupMatch = false
              break
            }
          } else if (dependancy.validationAction === 'notEqual') {
            if (!(dependsOnQuestion.response !== dependancy.validationValue)) {
              groupMatch = false
              break
            }
          } else if (dependancy.validationAction === 'greaterThen') {
            if (!(+dependsOnQuestion.response > +dependancy.validationValue)) {
              groupMatch = false
              break
            }
          } else if (dependancy.validationAction === 'lessThen') {
            if (!(+dependsOnQuestion.response < +dependancy.validationValue)) {
              groupMatch = false
              break
            }
          } else if (dependancy.validationAction === 'lengthLessThen') {
            if (!dependsOnQuestion.response || !(dependsOnQuestion.response.length < +dependancy.validationValue)) {
              groupMatch = false
              break
            }
          } else if (dependancy.validationAction === 'lengthGreaterThen') {
            if (!dependsOnQuestion.response || !(dependsOnQuestion.response.length > +dependancy.validationValue)) {
              groupMatch = false
              break
            }
          }
        }

        if (group.ruleType === 'visibility') {
          question.isVisible = groupMatch
        } else if (group.ruleType === 'validation') {
          let rule = question.validationRules.find(rule => rule.name === group.childValidatorName)
          rule.enabled = groupMatch
        } else if (group.ruleType === 'validationValue' && groupMatch) {
          let rule = question.validationRules.find(rule => rule.name === group.childValidatorName)

          rule.value = group.questionDependencies[0].parentQuestion.response
        }
      }
    },
    onError (error) {
      this.question.validationState = !error
      this.isValid = this.question.validationState && this.getQuestionValidationState(this.question)
      this.$emit('error', error)
    },
    onChildError (error) {
      this.isValid = this.getQuestionValidationState(this.question)
      this.$emit('error', error)
    },
    getChildQuestionValidationState () {
      for (let i = 0; i < this.question.childQuestions.length; i++) {
        let childQuestion = this.question.childQuestions[i]
        if (childQuestion.isVisible && this.getQuestionValidationState(this.question.childQuestions[i]) === false) { return false }
      }
      return true
    },
    getQuestionValidationState (question) {
      if (question.isVisible) {
        if (question.validationState === false) {
          return false
        }
        for (let i = 0; i < question.childQuestions.length; i++) {
          if (this.getQuestionValidationState(question.childQuestions[i]) === false) {
            return false
          }
        }
      }
      return true
    }
  }
}

</script>

<style scoped>
/* .v-card {
  border: none !important;

}
.v-card__title {
  padding: 0px 4px 0px !important;
  margin: 0px !important;
  font-weight: normal !important;

}
.v-card__text {
  padding: 0px 4px 0px !important;
  margin: 0px !important;
} */
/* .v-expansion-panel-header--active::before {
  opacity: 0 !important;
} */

/* .cursor-auto {
  cursor: auto;
} */

</style>
