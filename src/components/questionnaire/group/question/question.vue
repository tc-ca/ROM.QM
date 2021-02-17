<template>
  <v-expansion-panel
    v-show="isVisible"
    ref="qPanel"
    :active="isPanelActive"
    :class="getClassName"
  >
    <v-expansion-panel-header
      disable-icon-rotate
      ripple
    >
      <template
        #actions
      >
        <v-btn-toggle
          tile
          group
          dense
          active-class="btn-toggle-active"
        >
          <v-tooltip
            v-if="question.isSamplingAllowed"
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
                @click.native.stop="clickSampling"
              >
                <v-icon
                  color="blue"
                >
                  mdi-book-open-page-variant-outline
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('app.questionnaire.group.question.sampling.samplingTooltip') }}</span>
          </v-tooltip>

          <v-tooltip
            v-if="question.isRepeatable"
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
                @click.native.stop="repeatQuestion"
              >
                <v-icon
                  color="blue"
                >
                  mdi-plus
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('app.questionnaire.group.deleteGroup') }}</span>
          </v-tooltip>
          <v-tooltip
            v-if="question.isRepeated"
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
                @click.native.stop="deleteRepeatedQuestion"
              >
                <v-icon
                  color="blue"
                >
                  mdi-minus
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('app.questionnaire.group.question.repeatable.deleteQuestion') }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </template>

      <v-row>
        <v-col
          v-if="isValid === false"
          cols="auto"
        >
          <v-icon
            color="red"
          >
            mdi-exclamation
          </v-icon>
        </v-col>
        <v-col>
          <div
            :style="{fontSize:'16px !important'}"
          >
            <span class="text-break">{{ questionText }}</span>
          </div>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content
      eager
    >
      <div :class="{'mt-6': expand.value}">
        <response
          :question="question"
          :group="group"
          :read-only="readOnly"
          @change="onUserResponseChanged"
          @error="onError"
        />
      </div>
      <div v-if="displaySamplingRecord && !displayViolationInfo && !isReferenceQuestion">
        <sampling-record
          :question="question"
          :read-only="readOnly"
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
                :disabled="isViolationInfoReferenceIdDisabled || readOnly"
                :label="$t('app.questionnaire.group.question.referenceId')"
                :placeholder="$t('app.questionnaire.group.question.referenceIdPlaceHolder')"
                outline
              />
              <div v-if="displaySamplingRecord">
                <sampling-record
                  :question="question"
                  :read-only="readOnly"
                />
              </div>
              <div v-else>
                <v-text-field
                  v-model="question.violationInfo.violationCount"
                  :disabled="readOnly"
                  :label="$t('app.questionnaire.group.question.violationCount')"
                  :placeholder="$t('app.questionnaire.group.question.violationCountPlaceHolder')"
                  outline
                />
              </div>
            </v-sheet>
            <v-sheet class="pa-4">
              <v-text-field
                v-model="selectedResponseOption.searchProvisions"
                label="Search"
                :disabled="readOnly"
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
                  :disabled="readOnly"
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
                :selectable="!readOnly"
                :disabled="readOnly"
                item-key="id"
                :item-text="'title.' + lang"
                selection-type="leaf"
                :search="selectedResponseOption.searchProvisions"
                :filter="selectedResponseOption.filterProvisions"
                :items="treeDataProvisions"
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
        v-if="showSupplementaryInfo"
        :question="question"
        :selresponseoption="selectedResponseOption"
        :group="group"
        :read-only="readOnly"
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
            :parent="question"
            :is-child-question="true"
            :in-repeated-group="inRepeatedGroup"
            :expand="expand"
            :read-only="readOnly"
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
import BaseMixin from '../../../../mixins/base'
import Response from './response/response.vue'
import SupplementaryInfo from './supplementary-info/supplementary-info.vue'
import { QUESTION_TYPE } from '../../../../data/questionTypes'
import { onlyUnique, buildTreeFromFlatList, hydrateItems, GetAllChildrenQuestions, questionHasSupplementaryInfo } from '../../../../utils.js'
import BuilderService from '../../../../services/builderService'
import SamplingRecord from './sampling/sampling-record'

export default {
  emits: ['error', 'responseChanged', 'group-subtitle-change', 'reference-change', 'delete-repeated-question', 'update-group-question-count'],
  name: 'Question',
  components: { Response, SupplementaryInfo, SamplingRecord },
  mixins: [BaseMixin],
  props: {
    question: {
      type: Object,
      required: true
    },
    parent: {
      type: Object,
      required: true
    },
    isChildQuestion: {
      type: Boolean,
      default: false
    },
    group: {
      type: Object,
      required: true
    },
    inRepeatedGroup: {
      type: Boolean, required: true
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
  data () {
    return {
      displayViolationInfo: false,
      // displaySupplementaryInfo: false,
      isValid: null,
      selectedResponseOption: {},
      selResponses: [],
      treeDataProvisions: [], // to populate the tree control
      selProvisions: [],
      isReferenceQuestion: false,
      isReferenceQuestionInGroup: false,
      isViolationInfoReferenceIdDisabled: false,
      displaySamplingRecord: false,
      requireDependantQuestionToEnableVisibility: this.question.dependencyGroups.some(x => x.ruleType === 'visibility'),
      responseArgs: null,
      filteredInByProvisionSearch: true
    }
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters({
      getFlatListOfAllQuestions: 'getFlatListOfAllQuestions',
      provisionTagFilters: 'getAllAppliedTagProvisions'
    }),
    ...mapState({
      lang: state => {
        if (state == null || !state.settings) {
          return 'en'
        }
        return state.settings.settings.lang
      },
      provisionFilter: state => {
        return state.questionnaire.provisionFilter
      }
    }),
    questionText () {
      let text = ''
      if (this.question.isRepeated) {
        text = `(Copy # ${this.calculateRepeatedNumber()}) `
      }
      text += `${this.question.text[this.lang]}`
      return text
    },
    showSupplementaryInfo () {
      return (!_.isEmpty(this.selectedResponseOption)) && questionHasSupplementaryInfo(this.question)
      // return questionHasSupplementaryInfo(this.question)
    },
    provisions () {
      if (this.isFlatLegislationsDataAvailable) {
        let provisions = []
        let dictionnairyOfProvisions = this.$store.state.legislations.legislations
        this.question.responseOptions.forEach(option => {
          provisions = provisions.concat(option.provisions)
        })

        const uniqueProvisions = provisions.filter(onlyUnique)
        return hydrateItems(uniqueProvisions, dictionnairyOfProvisions)
      }
      return []
    },
    hasProvisions () {
      return this.provisions.length > 0
    },
    getClassName () {
      let selClass = this.$store.state.errors.errorNotification.qid === this.question.guid ? 'selected' : ''
      if (selClass === 'selected' && this.$refs.qPanel) this.$refs.qPanel.$el.scrollIntoView(true)
      return selClass
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
        if (this.expand.value) {
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
    // returns the source (origin/original) question object if the question is considered a repeat
    // i.e. the source of which this question has been copied from.
    sourceQuestion () {
      // if repeated group, find source group
      if (this.inRepeatedGroup || this.question.isRepeated) {
        // find the originial group (needed when group is repeated)
        const groupId = `${this.group.primaryKey}#000`// #000 is always identifies the origin of specific group
        // find question in the origin group, must get flat list all questions within group first (including children).
        const originQuestions = this.getFlatListOfAllQuestions(groupId)
        // find will return first occurence which statifies our search as the source will always be in the beginning of the array.
        const originQuestion = originQuestions.find(x => x.name === this.question.name)

        return originQuestion
      }
      return null
    },
    isVisible () {
      this.setQuestionVisibilityBasedOnAppliedTags()

      return this.question.isVisible && this.filteredInByProvisionSearch
    },
    selectedQuestionHasProvisions () {
      return this.question.responseOptions.some(option => option.provisions.length > 0)
    },
    samplingButtonColor () {
      if (this.displaySamplingRecord) return 'black'
      else return 'primary'
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
    isVisible () {
      this.$emit('update-group-question-count')
    }
  },
  mounted () {
    // keep this code on top of mounted method
    // so we can subscribe to mutation within this method
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case 'setFlatLegislations':
          // in theory this only should/need  be run once when legislations is finally loaded into the store (async method, data takes few seconds)
          // now safe to run methods dependant on legislations

          if (this.responseArgs !== null) {
            // running this method will initialize the selected responses
            this.onUserResponseChanged(this.responseArgs)
          }
          break
        case 'updateProvisionFilter':
          // to help performance only run when mutation occurs
          this.filteredInByProvisionSearch = this.isfilteredInByProvisionSearch()
          break
        default:
          break
      }
    })
    this.question.childQuestions.sort((a, b) => a.sortOrder - b.sortOrder)
    this.updateReferenceID()
  },
  methods: {
    calculateRepeatedNumber () {
      let text = ''
      if (this.question.isRepeated) {
        let questionnaire = this.$store.getters['getQuestionnaire']
        if (questionnaire !== null && this.parent !== null) {
          let collection = (this.parent.questions) ? this.parent.questions : this.parent.childQuestions
          if (collection) {
            let questionIdx = collection.findIndex(q => q.guid === this.question.guid)
            if (questionIdx > 0) {
              let count = 0
              for (let x = questionIdx - 1; x >= 0; x--) {
                if (collection[x].isRepeated && !collection[x].isRepeatable) {
                  count++
                } else if (collection[x].isRepeatable && !collection[x].isRepeated) {
                  count++
                  x = -1
                }
              }
              if (count > 0) {
                text = count.toString()
              }
            }
          }
        }
      }
      return text
    },
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
          let questionnaire = this.$store.getters['getQuestionnaire']
          let nQuestion = BuilderService.GenerateRepeatedQuestion(questionnaire, this.question.childQuestions[questionIdx])
          if (nQuestion) {
            for (let x = questionIdx + 1; x < this.question.childQuestions.length; x++) {
              this.question.childQuestions[x].sortOrder = this.question.childQuestions[x].sortOrder + 1
            }
            this.question.childQuestions.splice(questionIdx + 1, 0, nQuestion)
          } else {
            alert('Something went wrong, check the console')
            console.log(JSON.stringify(this.question))
          }
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
      findDeep(this.treeDataProvisions, item)
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
      let parentIds = provisions.map(x => x.parentLegislationId)
      // special case if node is top root and it has been selected because it contains no children, it therefore has no parent id, it should not be inmcluded as part of list if parent ids.
      // note the provison will still be included in the tree but attached to made up "root" node
      let uniqueParentIds = [...new Set(parentIds)].filter(x => x !== '')
      let potentialParentProvisions = hydrateItems(uniqueParentIds, dictionnairyOfProvisions)

      let additionalChildrenProvisions = []
      for (var x = 0; x < potentialParentProvisions.length; x++) {
        if (uniqueParentIds.includes(potentialParentProvisions[x].parentLegislationId)) {
        // if the node is considered a parent
        // check its parents/root id
        // if this id exit in the list of potential parents, remove it. as its is a child of that node and cannot be considered a parent
        // remove them from parent list and add them as children provisions list
          additionalChildrenProvisions.push(potentialParentProvisions[x])
          delete potentialParentProvisions[x]
        }
      }
      const rootNodeId = '-1'

      const parentProvisions = potentialParentProvisions.filter(Boolean) // removes any holes/ undefined values as above we use the delete operator
      // set the parent parent to non existant or else we will build up further the tree
      parentProvisions.forEach(x => {
        x.parentLegislationId = rootNodeId
      })

      const myProvisonstest = (additionalChildrenProvisions).concat(provisions)
      const childrenAndAsscociatedParentProvision = myProvisonstest.concat(parentProvisions)
      let data = _.cloneDeep(childrenAndAsscociatedParentProvision)

      parentIds = data.map(x => x.parentLegislationId)

      uniqueParentIds = [...new Set(parentIds)]

      for (var i = 0; i < provisions.length; i++) {
        if (uniqueParentIds.includes(provisions[i].parentLegislationId)) {
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

      this.treeDataProvisions = root.children
    },
    onViolationsChange (args) {
      this.question.violationResponse = args
    // this.$emit('group-subtitle-change', this.getSelectedProvisionsId())
    },
    onUserResponseChanged (args) {
      // store the response in data property for reference use
      this.responseArgs = args
      // the below code is dependant legislatons data loaded (retrieval time may delay
      // the process and therefore be empty when this method is executing)
      if (!this.isFlatLegislationsDataAvailable) { return }

      this.selectedResponseOption = this.question.responseOptions.find(q => q.value === args.value)
      if (this.selectedResponseOption) {
        this.selProvisions = this.selectedResponseOption.selectedProvisions
        this.updateViolationInfo(this.selectedResponseOption)
      }

      this.updateSupplementaryInfoVisibility(args)
      this.updateDependants(args)
      this.isValid = this.getChildQuestionValidationState()
      this.$emit('responseChanged')
      if (this.isReferenceQuestion) {
        this.$emit('reference-change')
      }
    },
    // updateSupplementaryInfoVisibility (args) {
    //   this.displaySupplementaryInfo = (args && args.value)
    //   if (this.displaySupplementaryInfo) this.updateSupplementaryInfo(args)
    // },
    updateSupplementaryInfoVisibility (args) {
      if (this.showSupplementaryInfo) this.updateSupplementaryInfo(args)
    },
    updateSupplementaryInfo (args) {
      if (this.question.type === QUESTION_TYPE.RADIO) {
        let originalOption = this.question.responseOptions.find(option => option.id === args.optionPreviousId)
        let selectedOption = this.question.responseOptions.find(option => option.id === args.optionCurrentId)

        // if user changes option
        if (args.optionCurrentId !== args.optionPreviousId) {
          // then pull the original values into the selected option
          selectedOption.internalComment.value = originalOption.internalComment.value
          selectedOption.externalComment.value = originalOption.externalComment.value
          selectedOption.picture.value = originalOption.picture.value
        }
      }
    },
    updateViolationInfo (responseOption) {
      if (this.question.responseOptions && this.question.responseOptions.length > 0) {
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
          const question = this.getFlatListOfAllQuestions().find(x => x.guid === dependentGuid)
          this.applyDependencyRuleOnQuestion(question)
        }
      }
    },
    /**
     * Sets rule dependency for question and returns an array of matched groups
     * todo: maybe refactor, find way split "responsibility "of method as it sets and returns values (making it more clear what the method does).
     */
    applyDependencyRuleOnQuestion (question) {
      if (question && question.dependencyGroups) {
        let groupMatchArray = []
        for (let i = 0; i < question.dependencyGroups.length; i++) {
          let group = question.dependencyGroups[i]

          let groupMatch = true
          for (let j = 0; j < group.questionDependencies.length; j++) {
            let dependancy = group.questionDependencies[j]
            let dependsOnQuestionGuid = dependancy.dependsOnQuestion.guid
            let dependsOnQuestion = this.getFlatListOfAllQuestions().find(x => x.guid === dependsOnQuestionGuid)

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

          groupMatchArray.push({ ruleType: group.ruleType, groupMatch })

          if (group.ruleType === 'visibility') {
            // when evaluating multiple groups of the same type each group will be examined as "or" conditionally
            // i.e only one group of rules must be valid for it to be enabled, in this case visibility set to true.
            const groupByRuleTypeVisibility = groupMatchArray.filter(x => x.ruleType === 'visibility')
            question.isVisible = groupByRuleTypeVisibility.some(x => x.groupMatch === true)
          } else if (group.ruleType === 'validation') {
            let rule = question.validationRules.find(rule => rule.name === group.childValidatorName)
            rule.enabled = groupMatch
          } else if (group.ruleType === 'validationValue' && groupMatch) {
            let rule = question.validationRules.find(rule => rule.name === group.childValidatorName)

            rule.value = group.questionDependencies[0].parentQuestion.response
          }
        }
        return groupMatchArray
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
    },
    setQuestionVisibility (visible) {
      this.question.isVisible = visible
    },

    questionFoundViaProvidedProvisions (provisions) {
      let question

      // if question is repeated find the origin that it was repeated from, as the repeated question guid is not found in the searchable provision array.
      // any logic applied the origin would also be applied to the repeated versions of the question.
      if (!this.question.isRepeated && !this.inRepeatedGroup) {
        question = this.question
      } else {
        question = this.sourceQuestion
      }

      if (provisions && provisions.length > 0) {
      // active search check to see if question should be shown or not
        let dependants = []
        let dependsArray = []

        if (question.dependants) {
          dependants = question.dependants.map(x => x.guid)
        }

        if (question.dependencyGroups) {
          dependsArray = []
          question.dependencyGroups.forEach(x => {
            x.questionDependencies.forEach(y => {
              dependsArray.push(y.dependsOnQuestion.guid)
            })
          })
        }

        let childrenGuids = GetAllChildrenQuestions(question).map(x => x.guid)

        const foundInQuestion = provisions.some(p => p.questions.includes(question.guid))
        const foundInDependants = provisions.some(p => p.questions.some(q => dependants.includes(q)))
        const foundInDepends = provisions.some(p => p.questions.some(q => dependsArray.includes(q)))
        const foundInChildren = provisions.some(p => p.questions.some(q => childrenGuids.includes(q)))

        const provisionFound = foundInQuestion || foundInDependants || foundInDepends || foundInChildren
        return { found: provisionFound,
          inQuestion: foundInQuestion,
          inDependants: foundInDependants,
          inDepends: foundInDepends,
          inChildren: foundInChildren }
      }
      // search resulted in no provisions found therefore return false
      return { found: false, inQuestion: false, inDependants: false, inDepends: false, inChildren: false }
    },
    /**
   *
   *Function will modify the question prop. and set the isVisible value to true or false based on tag/filtering logic
   *Note: The logic is built to keep structural integrity of the template intact regardless of filtering. Where it makes sense.
   *For example: provision only found in a child will display the question (although the question does not have any assoicated provisions).
   *
   */
    setQuestionVisibilityBasedOnAppliedTags () {
      const provisionFound = this.questionFoundViaProvidedProvisions(this.provisionTagFilters)

      // **** SCENARIO 1: QUESTION WITH NO PROVISIONS****
      // question has no provisions its visibility always be set to true unless it default is set to false, therefore pass in set value from json
      if (!this.selectedQuestionHasProvisions) {
        this.setQuestionVisibility(this.question.isVisible)
        return true
      }

      // **** SCENARIO 2: QUESTION WITH NO DEPENDANCIES****
      // question has provisions but has no dependency questions required to check to see if visibility should be set based on another question.
      // THEN==> check if the question is found in the applied provisions, visibility should be set to true else false
      if (!this.requireDependantQuestionToEnableVisibility) {
        // note 1: do not need to evaluate provisionFound.depends its irrelevant if the provision if found within the depends because the dependency logic must be evaluated.
        // note 2: in practise a question that does not require depenencies. provisionFound.depends will evaluate to false always, therefore irrelevant to evaluate

        const found = (provisionFound.inQuestion || provisionFound.inDependants || provisionFound.inChildren)
        this.setQuestionVisibility(found)
        return found
      } else {
        // **** SCENARIO 3a: QUESTION WITH DEPENDANCIES, NO PROVISION MATCHING****
        // question is dependent
        // question provision is not found in applied provisions via tags then returns false.
        // else question provision is found within the applied tags but we cannot assume it should be displayed as it depends on its dependencies rules beinng met

        if (!provisionFound.inQuestion && !provisionFound.inDependants && !provisionFound.inChildren) {
          this.setQuestionVisibility(false)
          return false
        }

        // **** SCENARIO 3b: QUESTION WITH DEPENDANCIES, WITH PROVISION MATCHING****

        // below code checking to see if depencies rules/conditions are statisfied in settting visibility
        // note: if the question is not answer, the groupMatchArray returns false and if the conditions do not match conditions of the rules it will return false

        const groupMatchArray = this.applyDependencyRuleOnQuestion(this.question)
        const groupByRuleTypeVisibility = groupMatchArray.filter(x => x.ruleType === 'visibility')
        const answerMatch = groupByRuleTypeVisibility.some(x => x.groupMatch === true)
        this.setQuestionVisibility(answerMatch)

        return answerMatch
      }
    },
    isfilteredInByProvisionSearch () {
      console.log('running filter provision search')
      if (this.provisionFilter === null) {
        // no active search display all questions
        return true
      }
      const provisionSearch = this.questionFoundViaProvidedProvisions(this.provisionFilter)
      return provisionSearch.found
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
  /* makes acitve class same color as non active, else the button will looked like its pressed at all times */
.btn-toggle-active{
  color:#f5f5f5 !important;
}

</style>
