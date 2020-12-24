<template>
  <v-expansion-panel
    v-show="isVisible"
    ref="qPanel"
    :active="isPanelActive"
    :class="getClassName"
  >
    <v-expansion-panel-header
      ripple
    >
      <template
        #actions
      >
        <v-icon
          v-if="expand && isValid === false"
          color="red"
        >
          mdi-exclamation
        </v-icon>
        <v-icon v-if="expand">
          mdi-menu-down
        </v-icon>
      </template>

      <div
        :style="{fontSize:'16px !important'}"
      >
        <span class="text-break">{{ questionText }}</span>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content
      eager
    >
      <v-layout
        v-if="isQuestionToolbarVisible"
        class="pt-2"
        justify-end
      >
        <v-spacer />
        <div v-if="question.isSamplingAllowed">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                rounded
                v-bind="attrs"
                v-on="on"
                @click="clickSampling"
              >
                <v-icon
                  normal
                  color="primary"
                >
                  mdi-book-open-page-variant-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('app.questionnaire.group.question.sampling.samplingTooltip') }}</span>
          </v-tooltip>
        </div>
        <div v-if="question.isRepeatable">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ml-2"
                rounded
                v-bind="attrs"
                v-on="on"
                @click="repeatQuestion"
              >
                <v-icon
                  normal
                  color="primary"
                >
                  mdi-book-plus-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('app.questionnaire.group.question.repeatable.repeatQuestion') }}</span>
          </v-tooltip>
        </div>
        <div v-if="question.isRepeated">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ml-2"
                rounded
                v-bind="attrs"
                v-on="on"
                @click="deleteRepeatedQuestion"
              >
                <v-icon
                  normal
                  color="primary"
                >
                  mdi-book-minus-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('app.questionnaire.group.question.repeatable.deleteQuestion') }}</span>
          </v-tooltip>
        </div>
      </v-layout>
      <div :class="{'mt-6': expand}">
        <response
          :question="question"
          :group="group"
          @change="onUserResponseChanged"
          @error="onError"
        />
      </div>
      <div v-if="displaySamplingRecord">
        <sampling-record
          :question="question"
        />
      </div>
      <div v-if="displayViolationInfo && !isReferenceQuestion">
        <div>
          <v-card
            class="mx-auto"
          >
            <v-sheet class="pa-4">
              <v-text-field
                v-model="question.violationInfo.referenceID"
                :disabled="isViolationInfoReferenceIdDisabled"
                :label="$t('app.questionnaire.group.question.referenceId')"
                :placeholder="$t('app.questionnaire.group.question.referenceIdPlaceHolder')"
                outline
              />
              <v-text-field
                v-model="question.violationInfo.violationCount"
                :label="$t('app.questionnaire.group.question.violationCount')"
                :placeholder="$t('app.questionnaire.group.question.violationCountPlaceHolder')"
                outline
              />
            </v-sheet>
            <v-sheet class="pa-4">
              <v-text-field
                v-model="selectedResponseOption.searchProvisions"
                label="Search"
                outlined
                hide-details
                clearable
                clear-icon="mdi-close-circle-outline"
              />
            </v-sheet>
            <v-sheet class="pa-4">
              <div class="text-left">
                <v-btn
                  v-for="item in selProvisions"
                  :key="item.key"
                  small
                  style="margin-right: 5px; margin-bottom: 5px"
                  rounded
                  color="primary"
                  dark
                  @click="onSelectedProvisionClick(item)"
                >
                  <v-icon
                    small
                    left
                    dark
                  >
                    mdi-close
                  </v-icon>{{ getSelectedProvisionText(item) }}
                </v-btn>
              </div>
            </v-sheet>
            <v-card-text>
              <v-treeview
                v-model="selProvisions"
                selectable
                item-key="id"
                selection-type="leaf"
                :search="selectedResponseOption.searchProvisions"
                :filter="selectedResponseOption.filterProvisions"
                :items="provisions"
              >
                <template v-slot:label="{ item }">
                  <div class="truncated">
                    <div>{{ item.title[lang] }}</div>
                  </div>
                </template>
              </v-treeview>
            </v-card-text>
          </v-card>
        </div>
      </div>

      <br>

      <supplementary-info
        v-if="displaySupplementaryInfo && !isReferenceQuestion"
        :question="question"
        :selresponseoption="selectedResponseOption"
        :group="group"
        @error="onError"
      />

      <div v-if="!isReferenceQuestion">
        <v-expansion-panels
          v-model="expansionPanelsValue"
          hover
          focusable
          multiple
        >
          <question
            v-for="childQuestion in question.childQuestions"
            ref="groupQuestion"
            :key="childQuestion.guid"
            :question="childQuestion"
            :group="group"
            :in-repeated-group="inRepeatedGroup"
            :expand="expand"
            @error="onChildError"
            @repeat-question="onRepeatChildQuestion"
            @delete-repeated-question="onDeleteChildRepeatedQuestion"
          />
        </v-expansion-panels>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import _ from 'lodash'
import { mapState, mapGetters } from 'vuex'
import Response from './response/response.vue'
import SupplementaryInfo from './supplementary-info/supplementary-info.vue'
import { QUESTION_TYPE } from '../../../../data/questionTypes'
import { buildTreeFromFlatList, hydrateItems, setNewGUID, GetAllChildrenQuestions } from '../../../../utils.js'
import BuilderService from '../../../../services/builderService'
import SamplingRecord from './sampling/sampling-record'

export default {
  emits: ['error', 'responseChanged', 'group-subtitle-change', 'reference-change', 'delete-repeated-question', 'update-group-question-count'],
  name: 'Question',
  components: { Response, SupplementaryInfo, SamplingRecord },

  props: {
    question: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    },
    inRepeatedGroup: {
      type: Boolean, required: true
    },
    expand: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      displayViolationInfo: false,
      displaySupplementaryInfo: false,
      isValid: null,
      selectedResponseOption: [],
      selResponses: [],
      provisions: [],
      selProvisions: [],
      isReferenceQuestion: false,
      isReferenceQuestionInGroup: false,
      isViolationInfoReferenceIdDisabled: false,
      displaySamplingRecord: false
    }
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'getFlatListOfAllQuestions'
      // ...
    ]),
    ...mapState({
      lang: state => {
        return 'en'
      },
      provisionFilter: state => {
        return state.questionnaire.provisionFilter
      }
    }),
    questionText () {
      // return `${this.index + 1}. ${this.question.text[this.lang]}`
      return `${this.question.text[this.lang]}`
    },
    getClassName () {
      let c = this.$store.state.errors.errorNotification.qid === this.question.guid ? 'selected' : ''
      if (this.$refs.textArea) this.$refs.textArea.focus()
      return c
    },
    isPanelActive () {
      return this.$store.state.errors.errorNotification.qid === this.question.guid
    },
    isQuestionToolbarVisible () {
      if (this.question.isReferenceQuestion) return false
      if (this.question.isSamplingAllowed || this.question.isRepeatable || this.question.isRepeated) return true
      return false
    },
    expansionPanelsValue: {
      get () {
        if (this.expand) {
          let indexes = []
          for (let i = 0; i < this.question.childQuestions.length; i++) {
            indexes.push(i)
          }
          return indexes
        } else {
          return []
        }
      },
      set () { }
    },
    filteredInByProvisionSearch () {
      if (this.provisionFilter === null) {
        // no active search display all questions
        return true
      }
      if (this.provisionFilter && this.provisionFilter.length > 0) {
        // active search check to see if question should be shown or not
        let dependants = []
        let dependsArray = []

        if (this.question.dependants) {
          dependants = this.question.dependants.map(x => x.guid)
        }

        if (this.question.dependencyGroups) {
          dependsArray = []
          this.question.dependencyGroups.forEach(x => {
            x.questionDependencies.forEach(y => {
              dependsArray.push(y.dependsOnQuestion.guid)
            })
          })
        }

        let childrenGuids = GetAllChildrenQuestions(this.question).map(x => x.guid)

        const foundInQuestion = this.provisionFilter.some(p => p.questions.includes(this.question.guid))
        const foundInDependants = this.provisionFilter.some(p => p.questions.some(q => dependants.includes(q)))
        const foundInDepends = this.provisionFilter.some(p => p.questions.some(q => dependsArray.includes(q)))
        const foundInChildren = this.provisionFilter.some(p => p.questions.some(q => childrenGuids.includes(q)))

        return foundInQuestion || foundInDependants || foundInDepends || foundInChildren
      }
      // search resulted in no provisions found therefore hide all questions
      return false
    },
    isVisible () {
      return this.question.isVisible && this.filteredInByProvisionSearch
    }
  },
  watch: {
    selProvisions: {
      handler () {
        this.selectedResponseOption.selectedProvisions = this.selProvisions
        this.selectedResponseOption.selectedProvisionsTitles = this.getSelectedProvisionsId()
        this.$emit('group-subtitle-change')
      },
      deep: true
    },
    isVisible (value, oldValue) {
      if (value === true) {
        this.$emit('update-group-question-count', 1)
      } else {
        this.$emit('update-group-question-count', -1)
      }
    }
  },
  mounted () {
    this.question.childQuestions.sort((a, b) => a.sortOrder - b.sortOrder)
    this.updateReferenceID()
    this.selProvisions = this.selectedResponseOption.selectedProvisions
  },
  methods: {
    repeatQuestion ($event) {
      $event.stopPropagation()
      if (!this.isReferenceQuestion && this.question.isRepeatable) {
        this.$emit('repeat-question', this.question.guid)
      }
    },
    deleteRepeatedQuestion ($event) {
      $event.stopPropagation()
      if (!this.isReferenceQuestion && !this.question.isRepeatable && this.question.isRepeated) {
        this.$emit('delete-repeated-question', this.question)
      }
    },
    onRepeatChildQuestion (cQuestionGuid) {
      if (this.question.childQuestions) {
        let questionIdx = this.question.childQuestions.findIndex(cq => cq.guid === cQuestionGuid)
        if (questionIdx > -1) {
          let nQuestion = _.cloneDeep(this.question.childQuestions[questionIdx])
          setNewGUID(nQuestion)
          let questionnaire = this.$store.getters['getQuestionnaire']
          nQuestion.id = BuilderService.getNextQuestionId(questionnaire)
          nQuestion.isRepeatable = false
          nQuestion.isRepeated = true
          nQuestion.sortOrder = this.question.childQuestions[questionIdx].sortOrder + 1
          for (let x = questionIdx + 1; x < this.question.childQuestions.length; x++) {
            this.question.childQuestions[x].sortOrder = this.question.childQuestions[x].sortOrder + 1
          }
          this.question.childQuestions.splice(questionIdx + 1, 0, nQuestion)
        }
      }
    },
    onDeleteChildRepeatedQuestion (cQuestion) {
      if (this.question.childQuestions) {
        const index = this.question.childQuestions.findIndex(cq => cq.guid === cQuestion.guid)
        if (index > -1) {
          this.question.childQuestions.splice(index, 1)
          // Fix the sortOrder for all the questions after the original question
          for (let x = 0; x < this.question.childQuestions.length; x++) {
            this.question.childQuestions[x].sortOrder = x + 1
          }
          this.question.childQuestions.sort((a, b) => a.sortOrder - b.sortOrder)
        }
      }
    },
    clickSampling ($event) {
      $event.stopPropagation()
      if (!this.isReferenceQuestion) {
        this.displaySamplingRecord = !this.displaySamplingRecord
      } else {
        this.displaySamplingRecord = false
      }
    },
    updateReferenceID () {
      this.isReferenceQuestion = (this.question.type === QUESTION_TYPE.REFERENCE)
      // this.displaySupplementaryInfo = this.isReferenceQuestion
      if (!this.isReferenceQuestion) {
        const rQ = BuilderService.findReferenceQuestion(this.group)
        if (rQ) {
          this.isViolationInfoReferenceIdDisabled = false
          this.isReferenceQuestionInGroup = true
          this.question.violationInfo.referenceID = rQ.response
          this.isViolationInfoReferenceIdDisabled = true
          this.isViolationInfoReferenceIdDisabled = true
        }
      } else {
        this.isReferenceQuestionInGroup = true
      }
    },
    getSelectedProvisionText (item) {
      let provison = ''
      let findDeep = function (data, str) {
        return data.some(function (e) {
          if (e.id === str) {
            provison = e.title.en.split('-')[0]
            return e
          } else if (e.children) return findDeep(e.children, str)
        })
      }
      findDeep(this.provisions, item)
      return provison
    },
    getSelectedProvisionsId () {
      let list = []
      if (this.selectedResponseOption && this.selectedResponseOption.selectedProvisions) {
        this.selectedResponseOption.selectedProvisions.forEach(p => {
          list.push(this.getSelectedProvisionText(p).trim().toUpperCase())
        })
      }
      return list
    },
    onSelectedProvisionClick (item) {
      this.selProvisions = this.selProvisions.filter(i => i !== item)
      // this.$emit('group-subtitle-change', this.getSelectedProvisionsId())
    },
    loadProvisions (responseOption) {
      // legs in store should be key, value form
      let dictionnairyOfProvisions = this.$store.state.legislations.legislations
      let provisions = hydrateItems(responseOption.provisions, dictionnairyOfProvisions)

      // we need to get the parent nodes to have an actual tree or list will be flat
      const parentIds = provisions.map(x => x.parentLegislationId)
      const uniqueParentIds = [...new Set(parentIds)]
      let parentProvisions = hydrateItems(uniqueParentIds, dictionnairyOfProvisions)
      const rootNodeId = '-1'

      // set the parent parent to non existant or else we will build up further the tree
      parentProvisions.forEach(x => {
        x.parentLegislationId = rootNodeId
      })

      const childrenAndAsscociatedParentProvision = provisions.concat(parentProvisions)
      let data = _.cloneDeep(childrenAndAsscociatedParentProvision)

      const ids = data.map(x => x.id)
      const parentids = data.map(x => x.parentLegislationId)

      const uniqueIds = [...new Set(ids)]

      for (var i = 0; i < ids.length; i++) {
        if (uniqueIds.includes(parentids[i])) {
          // parent found
          continue
        } else {
          // if you dont have a parent we will just set it to the root node
          data[i].parentLegislationId = rootNodeId
        }
      }

      // create a root node, set to id -1 and set parentLegislationId to null for the below algorithm buildTreeFromFlatList to know its the root
      data.push({ id: rootNodeId,
        parentLegislationId: null,
        'title': {
          'en': 'root',
          'fr': 'root'
        } })

      const root = buildTreeFromFlatList(data, 'parentLegislationId')

      this.provisions = root.children
    },
    onViolationsChange (args) {
      this.question.violationResponse = args
      // this.$emit('group-subtitle-change', this.getSelectedProvisionsId())
    },
    onUserResponseChanged (args) {
      this.updateViolationInfo(args)
      this.updateSupplementaryInfoVisibility(args)
      this.updateDependants(args)
      this.isValid = this.getChildQuestionValidationState()
      this.$emit('responseChanged')
      if (this.isReferenceQuestion) {
        this.$emit('reference-change')
      }
    },
    updateSupplementaryInfoVisibility (args) {
      this.displaySupplementaryInfo = (args && args.value)
      if (this.displaySupplementaryInfo) this.updateSupplementaryInfo(args)
    },
    updateSupplementaryInfo (args) {
      if (this.question.type === QUESTION_TYPE.RADIO) {
        let orgOption = this.question.responseOptions.find(q => q.internalComment.value !== '' ||
          q.externalComment.value !== '' || q.picture.value !== '')
        let selOption = this.question.responseOptions.find(q => q.value === args.value)

        if (orgOption) {
          selOption.internalComment.value = orgOption.internalComment.value
          selOption.externalComment.value = orgOption.externalComment.value
          selOption.picture.value = orgOption.picture.value

          orgOption.internalComment.value = ''
          orgOption.externalComment.value = ''
          orgOption.picture.value = ''
        }
      }
    },
    updateViolationInfo (args) {
      if (this.question.responseOptions.length > 0) {
        let responseOption = this.question.responseOptions.find(q => q.value === args.value)
        if (responseOption) {
          if (responseOption.provisions == null || responseOption.provisions.length === 0) {
            this.displayViolationInfo = false
          } else {
            this.loadProvisions(responseOption)
            this.displayViolationInfo = !this.isReferenceQuestion
          }
        } else {
          this.displayViolationInfo = false
        }
        this.selectedResponseOption = responseOption
        if (responseOption && responseOption.selectedProvisions) {
          this.selectedResponseOption.selectedProvisions = responseOption.selectedProvisions
        }
        // this.$emit('group-subtitle-change', this.getSelectedProvisionsId())
      }
    },
    updateDependants (args) {
      this.question.response = args.value
      if (this.question.dependants) {
        for (let i = 0; i < this.question.dependants.length; i++) {
          let dependentGuid = this.question.dependants[i].guid
          const question = this.getFlatListOfAllQuestions.find(x => x.guid === dependentGuid)
          this.updateChildQuestionOnDependencies(question)
        }
      }
    },
    updateChildQuestionOnDependencies (question) {
      if (question && question.dependencyGroups) {
        for (let i = 0; i < question.dependencyGroups.length; i++) {
          let group = question.dependencyGroups[i]

          let groupMatch = true
          for (let j = 0; j < group.questionDependencies.length; j++) {
            let dependancy = group.questionDependencies[j]
            let dependsOnQuestionGuid = dependancy.dependsOnQuestion.guid
            let dependsOnQuestion = this.getFlatListOfAllQuestions.find(x => x.guid === dependsOnQuestionGuid)

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
.selected {
    box-shadow: 0 0px 5px 0 rgba(255, 0, 0, 1);
    border-width: 1px;
    border-style: solid;
    border-color:  rgba(255, 0, 0, 1);
  }
  .truncated div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    padding: .5em;

    width: auto;
    max-width: 90%;
    -webkit-transition: max-width linear .5s;
    transition: max-width linear .5s;
  }
  .truncated:hover div {
    overflow: visible;
    white-space: normal;
    -ms-word-break: break-all;
    word-break: break-all;
    /* Non standard for webkit*/
      word-break: break-word;

  -webkit-hyphens: auto;
    -moz-hyphens: auto;
          hyphens: auto;

    max-width: 100%;
    width: 100%;
    z-index: 1; /* stack above subsequent cells */
  }
  .truncated:hover div:before {
    background-color: #d3e9f1ef;
    border: 1px solid #ddd;
    content: "";
    height: 100%;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    border-radius: 5px;
    position: absolute;
    z-index:-1; /* stack below truncated text */
  }

</style>
