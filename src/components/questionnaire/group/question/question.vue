<template>
  <v-expansion-panel
    v-show="question.isVisible"
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
        <!-- eslint-disable vue/no-v-html -->
        <span class="text-break">{{ questionText }}</span>
      </div>
      <!--eslint-enable-->
    </v-expansion-panel-header>
    <v-expansion-panel-content
      eager
    >
      <v-layout
        v-if="!isReferenceQuestion && question.isSamplingAllowed"
        class="pt-2"
        justify-end
      >
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              rounded
              v-bind="attrs"
              v-on="on"
              @click="clickSampling"
            >
              <v-icon
                normal
              >
                mdi-book-open-page-variant-outline
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('app.questionnaire.group.question.sampling.samplingTooltip') }}</span>
        </v-tooltip>
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
                :item-text="'title.' + lang"
                item-key="id"
                selection-type="leaf"
                :search="selectedResponseOption.searchProvisions"
                :filter="selectedResponseOption.filterProvisions"
                :items="provisions"
              />
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
            v-for="(childQuestion, questionIndex) in question.childQuestions"
            ref="groupQuestion"
            :key="questionIndex"
            :question="childQuestion"
            :group="group"
            :index="questionIndex"
            :in-repeated-group="inRepeatedGroup"
            :expand="expand"
            @error="onChildError"
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
import { buildTreeFromFlatList, hydrateItems } from '../../../../utils.js'
import BuilderService from '../../../../services/builderService'
import SamplingRecord from './sampling/sampling-record'

export default {
  emits: ['error', 'responseChanged', 'group-subtitle-change', 'reference-change'],
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
    index: {
      type: Number,
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
    ...mapState({
      lang: state => {
        return 'en'
      }
    })
  },
  watch: {
    selProvisions: {
      handler () {
        this.selectedResponseOption.selectedProvisions = this.selProvisions
        this.selectedResponseOption.selectedProvisionsTitles = this.getSelectedProvisionsId()
        this.$emit('group-subtitle-change')
      },
      deep: true
    }
  },
  mounted () {
    this.question.childQuestions.sort((a, b) => a.sortOrder - b.sortOrder)
    this.updateReferenceID()
    this.selProvisions = this.selectedResponseOption.selectedProvisions
  },
  methods: {
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
    hydrateItems (itemToHydrate, dictionary) {
      let hydratedItems = []

      for (let index = 0; index < itemToHydrate.length; index++) {
        // get the key from array
        let key = itemToHydrate[index]
        // alert('provisionId' + provisionsToDisplay[index])

        // map to the value i want to extract
        console.log('rehydratedProvision', dictionary[key])
        // alert('rehydratedProvision' + JSON.stringify(dictionnairyOfProvisions[provisionId]))

        var rehydratedProvision = dictionary[key]
        hydratedItems.push(rehydratedProvision)
      }
      return hydratedItems
    },
    loadProvisions (responseOption) {
      // legs in store should be key, value form
      let dictionnairyOfProvisions = this.$store.state.legislations.legislations
      let provisions = hydrateItems(responseOption.provisions, this.$store.state.legislations.legislations)

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
      // this.displaySupplementaryInfo = (args && args.value) || (this.isReferenceQuestion)
      this.displaySupplementaryInfo = (args && args.value)
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
.selected {
    box-shadow: 0 0px 5px 0 rgba(255, 0, 0, 1);
    border-width: 1px;
    border-style: solid;
    border-color:  rgba(255, 0, 0, 1);
  }
</style>
