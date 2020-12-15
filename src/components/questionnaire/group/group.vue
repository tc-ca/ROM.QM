<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <template #actions>
        <v-icon
          v-if="!valid"
          color="red"
        >
          mdi-exclamation
        </v-icon>
      </template>
      <v-row>
        <v-col
          cols="9"
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
            multiple
            focusable
            hover
          >
            <v-layout
              v-if="group.isRepeatable"
              class="pt-2"
              justify-end
            >
              <v-spacer />
              <div v-if="group.isRepeatable">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      rounded
                      v-bind="attrs"
                      v-on="on"
                      @click.native.stop="repeatGroup"
                    >
                      <v-icon
                        data-testid="repeatGroup"
                        normal
                        color="primary"
                      >
                        mdi-book-plus-multiple-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('app.questionnaire.group.repeatGroup') }}</span>
                </v-tooltip>
              </div>
              <div v-if="group.isRepeatable && repeatedGroup">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      rounded
                      v-bind="attrs"
                      v-on="on"
                      @click.native.stop="removeGroup"
                    >
                      <v-icon
                        data-testid="removeGroup"
                        normal
                        color="primary"
                      >
                        mdi-book-minus-multiple-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('app.questionnaire.group.deleteGroup') }}</span>
                </v-tooltip>
              </div>
            </v-layout>
            <question
              v-for="(question, questionIndex) in group.questions"
              ref="groupQuestion"
              :key="questionIndex"
              :question="question"
              :group="group"
              :index="questionIndex"
              :in-repeated-group="repeatedGroup"
              :expand="expand"
              @responseChanged="onResponseChanged"
              @error="onError"
              @group-subtitle-change="onSubtitleChanged"
              @reference-change="onReferenceChanged"
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
  emits: ['responseChanged'],
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
      type: Boolean,
      default: true
    }
  },

  data: function () {
    return {
      // indicates if the group was created by using the repeat function i.e. not original
      repeatedGroup: false,
      valid: true,
      groupSubtitle: ''
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
        if (this.expand) {
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
  },

  methods: {
    onDeleteRepeatedQuestion (question) {
      const index = this.group.questions.findIndex(q => q.guid === question.guid)
      if (index > -1) {
        this.group.questions.splice(index, 1)
        // Fix the sortOrder for all the questions after the original question
        for (let x = index; x < this.group.questions.length; x++) {
          this.group.questions[x].sortOrder -= 1
        }
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
          question.responseOptions.forEach(responseOption => {
            if (responseOption.selectedProvisionsTitles) {
              responseOption.selectedProvisionsTitles.forEach(title => {
                if (!this.groupSubtitle.includes(title)) {
                  if (this.groupSubtitle.trim().length > 0) this.groupSubtitle += ', '
                  this.groupSubtitle += title
                }
              })
            }
          })
        })
      }
    },
    repeatGroup () {
      this.$store.dispatch('repeatGroup', this.group)
    },
    removeGroup () {
      this.$store.dispatch('removeGroup', this.group)
    },
    onResponseChanged () {
      this.valid = this.areAllQuestionsValid(this.group.questions)
      this.$emit('responseChanged')
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
        if (question.isVisible) {
          if (question.validationState === false || !this.areAllQuestionsValid(question.childQuestions)) {
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
</style>
