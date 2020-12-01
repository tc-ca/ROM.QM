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
    <v-expansion-panel-content eager>
      <div :class="{'mt-6': expand}">
        <response
          :question="question"
          :group="group"
          @change="onUserResponseChanged"
          @error="onError"
        />
      </div>

      <div v-if="displayViolationInfo">
        <div>
          <v-card
            class="mx-auto"
          >
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
            <v-card-text>
              <v-treeview
                v-model="selectedResponseOption.selectedProvisions"
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
        v-if="displaySupplementaryInfo"
        :question="question"
        :group="group"
        @error="onError"
      />

      <div>
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
import { mapState } from 'vuex'
import Response from './response/response.vue'
import SupplementaryInfo from './supplementary-info/supplementary-info.vue'

export default {
  emits: ['error', 'responseChanged', 'group-subtitle-change'],
  name: 'Question',
  components: { Response, SupplementaryInfo },

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
      provisions: []
    }
  },
  computed: {
    questionText () {
      // return `${this.index + 1}. ${this.question.text[this.lang]}`
      return `${this.question.text[this.lang]}`
    },
    expansionPanelsValue () {
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
    ...mapState({
      lang: state => {
        return 'en'
      }
    })
  },
  mounted () {
    this.question.childQuestions.sort((a, b) => a.sortOrder - b.sortOrder)
  },
  methods: {

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
    loadSelectedItems (responseOption) {
      let dictionnairyOfProvisions = this.$store.state.legislations.legislations
      // let provisionsToSelect = responseOption.responseOption
      let provisionsToDisplay = responseOption.provisions
      let hydratedItems = this.hydrateItems(provisionsToDisplay, dictionnairyOfProvisions)

      let cloneHydratedItems = _.cloneDeep(hydratedItems)
      // const uniqueParents = onlyUniqueObj(cloneHydratedItems, 'id')

      const hydratedParentIds = cloneHydratedItems.map(x => x.parentLegislationId)
      //
      const uniqHydratedParentIds = [...new Set(hydratedParentIds)]
      let hydratedParents = this.hydrateItems(uniqHydratedParentIds, dictionnairyOfProvisions)

      // set to the main root
      hydratedParents.forEach(x => {
        x.parentLegislationId = '-1'
      })
      // console.log('my hydrated parents', JSON.stringify(hydratedParents))

      const combinedHydratedItems = hydratedItems.concat(hydratedParents)
      let data = _.cloneDeep(combinedHydratedItems)

      const ids = data.map(x => x.id)
      const parentids = data.map(x => x.parentLegislationId)
      console.log('i', ids)
      console.log('p', parentids)

      const uniq = [...new Set(ids)]
      // const uniqP = [...new Set(parentids)];

      // [null, 1, 2, 5, 19]
      // console.log(uniqP)
      for (var i = 0; i < ids.length; i++) {
        if (uniq.includes(parentids[i])) {
          console.log('yes, parent is found', data[i].parentLegislationId)
        } else {
          console.log('no, parent is not found', data[i].parentLegislationId)
          // if you dont have a parent will will just set it to the root node
          data[i].parentLegislationId = -1
        }
      }

      // create a root node, set to some number and null for the below algorith to know its the root
      data.push({ id: '-1',
        parentLegislationId: null,
        'title': {
          'en': 'root',
          'fr': 'root'
        } })

      console.log('new data', data)

      const idMapping = data.reduce((acc, el, i) => {
        acc[el.id] = i
        return acc
      }, {})

      let root
      console.log(data.length)
      data.forEach(el => {
        console.log('el', el)
        // Handle the root element
        if (el.parentLegislationId === null) {
          root = el
          return
        }
        // Use our mapping to locate the parent element in our data array
        const parentEl = data[idMapping[el.parentLegislationId]]
        // Add our current el to its parent's `children` array
        parentEl.children = [...(parentEl.children || []), el]
      })
      console.log('new tree', JSON.stringify(root.children))
      console.log('provisions', JSON.stringify(this.provisions))
      this.provisions = root.children
      // console.log(JSON.stringify(answer))
    },
    onViolationsChange (args) {
      this.question.violationResponse = args
      this.$emit('group-subtitle-change')
    },
    onUserResponseChanged (args) {
      this.updateViolationInfo(args)
      this.updateSupplementaryInfoVisibility(args)
      this.updateDependants(args)
      this.isValid = this.getChildQuestionValidationState()
      this.$emit('responseChanged')
    },
    updateSupplementaryInfoVisibility (args) {
      this.displaySupplementaryInfo = (args && args.value)
    },
    updateViolationInfo (args) {
      if (this.question.responseOptions.length > 0) {
        let responseOption = this.question.responseOptions.find(q => q.value === args.value)
        if (responseOption) {
          if (responseOption.provisions == null) {
            this.displayViolationInfo = false
          } else {
            this.loadSelectedItems(responseOption)
            this.displayViolationInfo = true
          }
        } else {
          this.displayViolationInfo = false
        }
        this.selectedResponseOption = responseOption
        this.selectedResponseOption.selectedProvisions = responseOption.selectedProvisions
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
