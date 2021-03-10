<template>
  <v-expansion-panel
    v-show="isVisible"
  >
    <v-expansion-panel-header disable-icon-rotate>
      <template #actions>
        <v-btn-toggle
          dense
          active-class="btn-toggle-active"
        >
          <v-tooltip
            v-if="group.isRepeatable"
            left
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                depressed
                fab
                v-bind="attrs"
                :disabled="readOnly"
                v-on="on"
                @click.native.stop="repeatGroup"
              >
                <v-icon
                  data-testid="repeatGroup"
                  color="blue"
                >
                  mdi-plus
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('app.questionnaire.group.repeatGroup') }}</span>
          </v-tooltip>

          <v-tooltip
            v-if="group.isRepeatable && repeatedGroup"
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                depressed
                fab
                v-bind="attrs"
                :disabled="readOnly"
                v-on="on"
                @click.native.stop="removeGroup"
              >
                <v-icon
                  data-testid="removeGroup"
                  color="blue"
                >
                  mdi-minus
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('app.questionnaire.group.deleteGroup') }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </template>
      <v-row>
        <v-col
          v-if="!valid"

          cols="auto"
        >
          <v-icon
            color="red"
          >
            mdi-exclamation
          </v-icon>
        </v-col>
        <v-col
          class="pl-1"
        >
          <h2 class="subtitle-1">
            {{ groupTitle }}
          </h2>
          <h3
            v-if="showGroupSubtitle"
            class="subtitle-1 text-truncate"
          >
            {{ groupSubtitle }}
          </h3>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
      <v-row>
        <v-col cols="12">
          <v-expansion-panels
            v-model="expansionPanelsValue"
            class="mt-3"
            multiple
            focusable
            hover
          >
            <question
              v-for="question in group.questions"
              ref="groupQuestion"
              :key="question.guid"
              :data-group-id="group.htmlElementId"
              :question="question"
              :group="group"
              :parent="group"
              :in-repeated-group="repeatedGroup"
              :expand="expand"
              :read-only="readOnly"
              @responseChanged="onResponseChanged"
              @error="onError"
              @group-subtitle-change="onSubtitleChanged"
              @reference-change="onReferenceChanged"
              @update-group-question-count="onUpdateGroupQuestionCount"
              @repeat-question="onRepeatQuestion"
              @delete-repeated-question="onDeleteRepeatedQuestion"
            />
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>

import { mapState } from 'vuex'
import Question from './question/question.vue'
import BuilderService from '../../../services/builderService'

export default {
  emits: ['update-group-count'],
  components: { Question },

  props: {
    group: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    expand: {
      type: Object,
      required: true
    },
    readOnly: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      // indicates if the group was created by using the repeat function i.e. not original
      repeatedGroup: false,
      valid: true,
      groupSubtitle: '',
      questionCount: 0
    }
  },
  computed: {
    activegroupHasReferenceQuestion () {
      return (!!BuilderService.findReferenceQuestion(this.group))
    },
    showGroupSubtitle () {
      if (this.groupSubtitle !== '') {
        if (this.group.isRepeatable === true || this.activegroupHasReferenceQuestion) return true
      }
      return false
    },
    groupTitle () {
      return `${this.group.title[this.lang]}`
    },
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      }
    }),
    expansionPanelsValue: {
      get () {
        if (this.expand.value) {
          let indexes = []
          for (let i = 0; i < this.group.questions.length; i++) {
            indexes.push(i)
          }
          return indexes
        } else {
          return []
        }
      },
      set () { }
    },
    isVisible () {
      return this.group.isVisible && this.questionCount > 0
    }
  },
  watch: {
    isVisible () {
      this.$emit('update-group-count')
    }
  },
  created () {
    // on repeat the last item in the array gets created hence the need for this method to update the group.order
    // uncomment console.log to obersve behavior
    // console.log(this.group.title + ' created index: ' + this.index)
    const index = this.index
    const group = this.group
    this.$store.dispatch('updateGroupOrder', { group, index })
    this.$store.dispatch('updateGroupHtmlElementId', { group })
    this.repeatedGroup = group.domSuffix !== '#000'

    this.group.questions.sort((a, b) => a.sortOrder - b.sortOrder)
  },
  updated () {
    // on update group.order is updated with shifted position/index in the array
    // uncomment console.log to obersve behavior
    // console.log(this.group.title + ' updated index: ' + this.index)
    const index = this.index
    const group = this.group
    this.repeatedGroup = group.domSuffix !== '#000'

    this.$store.dispatch('updateGroupOrder', { group, index })
    this.$store.dispatch('updateGroupHtmlElementId', { group })
    // important count must also be set on updated as the item in the array is shifted when group copy function is used.
    if (this.$refs.groupQuestion) {
      this.questionCount = this.$refs.groupQuestion.filter(x => x.isVisible === true).length
    }
  },
  mounted () {
    // sets the default value based on visibility of the component
    if (this.$refs.groupQuestion) {
      this.questionCount = this.$refs.groupQuestion.filter(x => x.isVisible === true).length
    }
  },

  methods: {
    onRepeatQuestion (questionGuid) {
      let questionIdx = this.group.questions.findIndex(q => q.guid === questionGuid)
      if (questionIdx > -1) {
        let questionnaire = this.$store.getters['getQuestionnaire']
        let nQuestion = BuilderService.GenerateRepeatedQuestion(questionnaire, this.group.questions[questionIdx])
        if (nQuestion) {
          for (let x = questionIdx + 1; x < this.group.questions.length; x++) {
            this.group.questions[x].sortOrder = this.group.questions[x].sortOrder + 1
          }
          this.group.questions.splice(questionIdx + 1, 0, nQuestion)
        } else {
          alert('Something went wrong, check the console')
          console.log(JSON.stringify(this.group))
          console.log(JSON.stringify(this.question))
        }
      } else {
        alert('Something went wrong, check the console')
        console.log(JSON.stringify(this.group))
        console.log(JSON.stringify(this.question))
      }
    },
    onDeleteRepeatedQuestion (question) {
      const questionIdx = this.group.questions.findIndex(q => q.guid === question.guid)
      if (questionIdx > -1) {
        for (let x = questionIdx + 1; x < this.group.questions.length; x++) {
          this.group.questions[x].sortOrder = this.group.questions[x].sortOrder + 1
        }
        this.group.questions.splice(questionIdx, 1)
        // this.group.questions.sort((a, b) => a.sortOrder - b.sortOrder)
      } else {
        alert('Something went very wrong, check the console')
        console.log(JSON.stringify(this.group))
        console.log(JSON.stringify(this.question))
      }
    },
    onReferenceChanged () {
      if (this.activegroupHasReferenceQuestion) {
        const rQ = BuilderService.findReferenceQuestion(this.group)
        if (rQ && rQ.response) {
          this.groupSubtitle = `REFERENCE ID: ${rQ.response}`
          this.group.questions.forEach(q => {
            if (q.guid !== rQ.guid) {
              q.violationInfo.referenceID = rQ.response
            }
          })
          this.$refs.groupQuestion.forEach(gq => {
            gq.updateReferenceID()
          })
        }
      }
    },
    onSubtitleChanged () {
      if (this.activegroupHasReferenceQuestion) return
      this.groupSubtitle = ''
      if (this.group && this.group.questions) {
        this.group.questions.forEach(question => {
          if (question.responseOptions) {
            for (let x = 0; x < question.responseOptions.length; x++) {
              if (question.responseOptions[x].selectedProvisionsTitles && question.response === question.responseOptions[x].value) {
                question.responseOptions[x].selectedProvisionsTitles.forEach(title => {
                  if (!this.groupSubtitle.includes(title)) {
                    if (this.groupSubtitle.trim().length > 0) this.groupSubtitle += ', '
                    this.groupSubtitle += title
                  }
                })
              }
            }
          }
        })
      }
    },
    repeatGroup () {
      this.$store.dispatch('repeatGroup', this.group)
    },
    removeGroup () {
      // need to the update-group-count event in the removal as the events in the isVisibility watch are not emitted
      // when a groups is removed, note this event is not need the above repeatGroup Method
      this.$emit('update-group-count', -1)
      this.$store.dispatch('removeGroup', this.group)
    },
    onResponseChanged () {
      this.valid = this.areAllQuestionsValid(this.group.questions)
      // this.$emit('responseChanged')
    },
    resetError () {
      this.onError()
    },
    onError () {
      this.valid = this.areAllQuestionsValid(this.group.questions)
    },
    areAllQuestionsValid (questions) {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i]
        if (question.isVisibleByDefault) {
          if (question.validationState === false || !this.areAllQuestionsValid(question.childQuestions)) {
            return false
          }
        }
      }
      return true
    },
    onUpdateGroupQuestionCount () {
      if (this.$refs.groupQuestion) {
        this.questionCount = this.$refs.groupQuestion.filter(x => x.isVisible === true).length
      }
    }
  }
}
</script>

<style scoped>
/* makes acitve class same color as non active, else the button will looked like its pressed at all times */
.btn-toggle-active{
  color:#f5f5f5 !important;
}
</style>
