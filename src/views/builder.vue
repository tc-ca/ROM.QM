<template>
  <div>
    <v-row>
      <v-col cols="7">
        <v-expansion-panels
          v-model="groupPanels"
          focusable
          multiple
          class="v-expansion-panel"
        >
          <v-expansion-panel
            v-for="(group, groupIndex) in questionnaire.groups"
            ref="questionGroup"
            :key="groupIndex"
            :group="group"
            :index="groupIndex"
            :class="{selected: group === selectedGroup}"
          >
            <v-expansion-panel-header
              disable-icon-rotate
              ripple
            >
              <template #actions>
                <v-icon
                  x-large
                  medium
                  color="primary"
                >
                  $expand
                </v-icon>
              </template>
              <v-row>
                <!-- Group Title -->
                <v-col
                  cols="9"
                  class="pl-1"
                >
                  <h2 class="subtitle-1">
                    {{ getTitle(group) }}
                  </h2>
                </v-col>
                <v-col cols="1">
                  <!-- Repeat button -->
                  <v-icon
                    v-if="group.isRepeatable=== true"
                    large
                    color="primary"
                  >
                    mdi-plus
                  </v-icon>
                </v-col>

                <v-col
                  cols="1"
                  class="mr-4"
                >
                  <!-- Remove button -->
                  <v-icon
                    v-if="group.isRepeatable === true"
                    large
                    color="primary"
                  >
                    mdi-minus
                  </v-icon>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content eager>
              <v-row @click="editGroup($event, group)">
                <v-col cols="12">
                  <v-expansion-panels
                    v-model="questionPanels"
                    hover
                    focusable
                    multiple
                  >
                    <builder-question
                      v-for="(question, questionIndex) in group.questions"
                      :key="questionIndex"
                      :question="question"
                      :selected-question="selectedQuestion"
                      :group="group"
                      :questionnaire="questionnaire"
                      :index="questionIndex"
                      @editQuestion="editQuestion"
                      @childQuestionAdded="addQuestionToIndex"
                      @childQuestionRemoved="onRemovedQuestionFromIndex"
                      @removeQuestion="confirmRemoveQuestion"
                    />
                    <v-expansion-panel>
                      <v-row
                        justify="center"
                        align="center"
                        class="ma-2"
                      >
                        <v-col
                          class="col-auto"
                        >
                          <v-btn @click="addQuestion($event, group)">
                            Add question
                          </v-btn>
                        </v-col>
                        <v-col
                          class="col-auto"
                        >
                          <v-tooltip
                            top
                            open-delay="300"
                          >
                            <template #activator="{ on, attrs }">
                              <v-btn
                                small
                                icon
                                @click="confirmRemoveGroup(group)"
                              >
                                <v-icon
                                  small
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  mdi-delete
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Remove group</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div
          class="mt-2 center"
        >
          <v-btn @click="addGroup()">
            Add group
          </v-btn>
        </div>
      </v-col>
      <v-col cols="5">
        <v-row justify="end">
          <v-col class="col-auto">
            <v-btn @click="load()">
              Load
            </v-btn>
            <v-btn @click="save()">
              Save
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="questionnaire.name"
              label="Questionnaire name"
            />
          </v-col>
        </v-row>
        <v-row v-if="selectedGroup">
          <v-col>
            <v-text-field
              v-model="selectedGroup.primaryKey"
              label="Group name"
            />
            <v-text-field
              v-model="selectedGroup.title[eng]"
              label="Group text En"
            />
            <v-text-field
              v-model="selectedGroup.title[fr]"
              label="Group text Fr"
            />
            <v-checkbox
              v-model="selectedGroup.isVisible"
              :label="'Is Visible'"
            />
            <v-checkbox
              v-model="selectedGroup.isRepeatable"
              :label="'Is Repeatable'"
            />
          </v-col>
        </v-row>
        <v-row v-if="selectedQuestion">
          <v-col>
            <v-text-field
              v-model="selectedQuestion.name"
              label="Question name"
            />
            <v-text-field
              v-model="selectedQuestion.text[eng]"
              label="Question text En"
            />
            <v-text-field
              v-model="selectedQuestion.text[fr]"
              label="Question text Fr"
            />
            <v-select
              v-model="selectedQuestion.type"
              item-text="text"
              item-value="value"
              :items="questionTypes"
              label="Question Type"
            >
              <template v-slot:selection="{ item }">
                <span>{{ item.text[lang] }}</span>
              </template>
              <template v-slot:item="{ item }">
                <span>{{ item.text[lang] }}</span>
              </template>
            </v-select>
            <v-text-field
              v-model="selectedQuestion.sortOrder"
              dense
              type="number"
              label="Sort Order"
              @change="sortQuestions(selectedQuestion)"
            />
            <v-select
              v-model="selectedQuestion.internalComment.option"
              item-text="text"
              item-value="value"
              :items="optionTypes"
              label="Internal Comments"
            >
              <template v-slot:selection="{ item }">
                <span>{{ item.text[lang] }}</span>
              </template>
              <template v-slot:item="{ item }">
                <span>{{ item.text[lang] }}</span>
              </template>
            </v-select>
            <v-select
              v-model="selectedQuestion.externalComment.option"
              item-text="text"
              item-value="value"
              :items="optionTypes"
              label="External Comments"
            >
              <template v-slot:selection="{ item }">
                <span>{{ item.text[lang] }}</span>
              </template>
              <template v-slot:item="{ item }">
                <span>{{ item.text[lang] }}</span>
              </template>
            </v-select>
            <v-select
              v-model="selectedQuestion.picture.option"
              item-text="text"
              item-value="value"
              :items="optionTypes"
              label="Picture(s)"
            >
              <template v-slot:selection="{ item }">
                <span>{{ item.text[lang] }}</span>
              </template>
              <template v-slot:item="{ item }">
                <span>{{ item.text[lang] }}</span>
              </template>
            </v-select>
            <v-checkbox
              v-model="selectedQuestion.isVisible"
              dense
              label="Visible by default"
            />

            <div
              v-if="selectedQuestion.type === 'select' || selectedQuestion.type === 'radio' "
            >
              <div>
                <v-btn
                  small
                  icon
                  @click="toggleOptions()"
                >
                  <v-icon v-if="optionsCollapsed">
                    mdi-menu-right
                  </v-icon>
                  <v-icon v-if="!optionsCollapsed">
                    mdi-menu-down
                  </v-icon>
                </v-btn>
                Response Options
              </div>
              <div v-show="!optionsCollapsed">
                <div
                  v-for="(option, index) in selectedQuestion.responseOptions"
                  :key="index"
                  class="bordered ml-2 pa-2 my-2"
                >
                  <v-text-field
                    v-model="option.text[eng]"
                    dense
                    label="Option text En"
                  />
                  <v-text-field
                    v-model="option.text[fr]"
                    dense
                    label="Oprion text Fr"
                  />
                  <v-text-field
                    v-model.number="option.sortOrder"
                    dense
                    label="Sort Order"
                  />
                  <v-text-field
                    v-model="option.value"
                    dense
                    label="value"
                  />
                  <div class="right">
                    <v-tooltip
                      top
                      open-delay="300"
                    >
                      <template #activator="{ on, attrs }">
                        <v-btn
                          small
                          icon
                          @click="removeResponseOption(option)"
                        >
                          <v-icon
                            small
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Remove response option</span>
                    </v-tooltip>
                  </div>
                  <div>
                    <div>
                      <v-btn
                        small
                        icon
                        @click="toggleProvisions(option)"
                      >
                        <v-icon v-if="!option.isProvisionCollapsed">
                          mdi-menu-right
                        </v-icon>
                        <v-icon v-if="option.isProvisionCollapsed">
                          mdi-menu-down
                        </v-icon>
                      </v-btn>
                      Provisions
                    </div>
                    <div v-show="option.isProvisionCollapsed">
                      <div>
                        <v-card
                          class="mx-auto"
                        >
                          <v-sheet class="pa-4">
                            <v-text-field
                              v-model="option.searchProvisions"
                              label="Search"
                              outlined
                              hide-details
                              clearable
                              clear-icon="mdi-close-circle-outline"
                            />
                          </v-sheet>
                          <v-card-text>
                            <v-treeview
                              v-model="option.selectedProvisions"
                              selectable
                              item-text="Text"
                              item-key="Text"
                              selection-type="leaf"
                              return-object
                              :search="option.searchProvisions"
                              :filter="option.filterProvisions"
                              :items="option.provisions"
                            />
                          </v-card-text>
                        </v-card>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <v-btn
                    small
                    @click="addOption()"
                  >
                    Add option
                  </v-btn>
                </div>
              </div>
            </div>
            <div>
              <div>
                <v-btn
                  small
                  icon
                  @click="toggleValidators()"
                >
                  <v-icon v-if="validatorsCollapsed">
                    mdi-menu-right
                  </v-icon>
                  <v-icon v-if="!validatorsCollapsed">
                    mdi-menu-down
                  </v-icon>
                </v-btn>
                Validators
              </div>
              <div
                v-show="!validatorsCollapsed"
              >
                <div
                  v-for="(validationRule, index) in selectedQuestion.validationRules"
                  :key="index"
                  class="bordered pa-2 ml-2 my-2"
                >
                  <v-text-field
                    v-model="validationRule.name"
                    dense
                    label="Name"
                  />
                  <v-checkbox
                    v-model="validationRule.enabled"
                    dense
                    label="Enabled"
                  />
                  <v-select
                    v-model="validationRule.type"
                    dense
                    item-text="text"
                    item-value="value"
                    :items="validatorTypes"
                    label="Type"
                  >
                    <template v-slot:selection="{ item }">
                      <span>{{ item.text[lang] }}</span>
                    </template>
                    <template v-slot:item="{ item }">
                      <span>{{ item.text[lang] }}</span>
                    </template>
                  </v-select>
                  <v-text-field
                    v-show="validationRule.type !== 'require'"
                    v-model="validationRule.value"
                    dense
                    label="value"
                  />
                  <v-text-field
                    v-model="validationRule.errorMessage[eng]"
                    dense
                    label="Error message"
                  />
                  <v-text-field
                    v-model="validationRule.errorMessage[fr]"
                    dense
                    label="Fr: Error message"
                  />
                  <div class="right">
                    <v-tooltip
                      top
                      open-delay="300"
                    >
                      <template #activator="{ on, attrs }">
                        <v-btn
                          small
                          icon
                          @click="removeValidator(validationRule)"
                        >
                          <v-icon
                            small
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Remove validatior</span>
                    </v-tooltip>
                  </div>
                </div>
                <div class="right">
                  <v-btn
                    small
                    @click="addValidator()"
                  >
                    Add validator
                  </v-btn>
                </div>
              </div>
              <div>
                <div>
                  <v-btn
                    small
                    icon
                    @click="toggleDependencies()"
                  >
                    <v-icon v-if="dependenciesCollapsed">
                      mdi-menu-right
                    </v-icon>
                    <v-icon v-if="!dependenciesCollapsed">
                      mdi-menu-down
                    </v-icon>
                  </v-btn>
                  Depends On
                </div>
                <div v-show="!dependenciesCollapsed">
                  <div>
                    <div
                      v-for="(dependencyGroup, index) in selectedQuestion.dependencyGroups"
                      :key="index"
                      class="bordered pa-2 ml-2 my-2"
                    >
                      <v-select
                        v-model="dependencyGroup.ruleType"
                        dense
                        :items="dependencyGroupTypes"
                        item-text="text"
                        item-value="value"
                        label="Type"
                      >
                        <template v-slot:selection="{ item }">
                          <span>{{ item.text[lang] }}</span>
                        </template>
                        <template v-slot:item="{ item }">
                          <span>{{ item.text[lang] }}</span>
                        </template>
                      </v-select>
                      <v-select
                        v-show="dependencyGroup.ruleType === 'validation' || dependencyGroup.ruleType === 'validationValue'"
                        v-model="dependencyGroup.childValidatorName"
                        dense
                        :items="selectedQuestion.validationRules"
                        item-text="name"
                        label="Validator"
                      />

                      <div
                        class="bordered pa-2"
                      >
                        <div
                          v-for="(questionDependency, i) in dependencyGroup.questionDependencies"
                          :key="i"
                        >
                          <div class="bordered pa-2 my-2">
                            <v-select
                              v-model="questionDependency.dependsOnQuestion"
                              dense
                              item-text="name"
                              :items="questions"
                              label="Question"
                              return-object
                            />
                            <v-select
                              v-model="questionDependency.validationAction"
                              dense
                              item-text="text"
                              item-value="value"
                              :items="dependencyValidationActions"
                              label="to be"
                            />
                            <v-text-field
                              v-model="questionDependency.validationValue"
                              dense
                              label="to"
                            />
                            <div class="right">
                              <v-tooltip
                                top
                                open-delay="300"
                              >
                                <template #activator="{ on, attrs }">
                                  <v-btn
                                    small
                                    icon
                                    @click="removeQuestoionDependency(dependencyGroup, questionDependency)"
                                  >
                                    <v-icon
                                      small
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      mdi-delete
                                    </v-icon>
                                  </v-btn>
                                </template>
                                <span>Remove question</span>
                              </v-tooltip>
                            </div>
                          </div>
                          <div
                            v-if="i < dependencyGroup.questionDependencies.length - 1"
                            class="ml-2"
                          >
                            and
                          </div>
                        </div>
                        <div class="right">
                          <v-btn
                            small
                            @click="addQuestionDependency(dependencyGroup)"
                          >
                            Add question
                          </v-btn>
                        </div>
                      </div>
                      <div class="right">
                        <v-tooltip
                          top
                          open-delay="300"
                        >
                          <template #activator="{ on, attrs }">
                            <v-btn
                              small
                              icon
                              @click="removeDependencyGroup(dependencyGroup)"
                            >
                              <v-icon
                                small
                                v-bind="attrs"
                                v-on="on"
                              >
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>Remove dependency group</span>
                        </v-tooltip>
                      </div>
                    </div>
                    <div class="right">
                      <v-btn
                        small
                        @click="addDependencyGroup()"
                      >
                        Add Dependency Group
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog
      v-model="confirmDialogOpen"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Delete?
        </v-card-title>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="error"
            text
            @click="confirmed()"
          >
            Yes
          </v-btn>

          <v-btn
            text
            @click="confirmDialogOpen = false"
          >
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { LANGUAGE } from '../constants.js'
import BUILDER from '../data/builderLookupTypes'
import BuilderQuestion from '../components/builder/builder-question'
import BuilderService from '../services/builderService'
import { mapState } from 'vuex'

export default {
  name: 'Builder',
  components: {
    BuilderQuestion
  },
  data () {
    return {
      questionnaire: null,
      selectedGroup: null,
      selectedQuestion: null,
      questionTypes: BUILDER.QUESTION_TYPES,
      optionTypes: BUILDER.OPTION_TYPES,
      optionsCollapsed: true,
      validatorTypes: BUILDER.VALIDATOR_TYPES,
      validatorsCollapsed: true,
      dependenciesCollapsed: true,
      dependencyGroupTypes: BUILDER.DEPENDENCY_GROUP_TYPES,
      dependencyValidationActions: BUILDER.DEPENDENCY_VALIDATION_ACTIONS,
      questions: [],
      confirmDialogOpen: false,
      confirmCallback: null,
      confirmCallbackArgs: null,
      violationsCollapsed: true,
      provisionsCollapsed: true,
      provisions: null,
      searchProvisions: null,
      groupPanels: [],
      questionPanels: [],
      selectedProvisions: [],
      questionProvisions: []
    }
  },
  computed: {
    eng () {
      return LANGUAGE.ENGLISH
    },
    fr () {
      return LANGUAGE.FRENCH
    },
    filterProvisions () {
      return (item, search, textKey) => item[textKey].indexOf(search) > -1
    },
    ...mapState({
      group: state => {
        if (!state || !state.group) {
          return []
        }
        return state.group
      },
      lang: state => {
        if (!state || !state.settings) {
          return LANGUAGE.ENGLISH
        }
        return state.settings.settings.lang
      }
    })
  },
  created () {
    this.provisions = require('../api/legislation-hierarchy-list.js').default.data[0].children.filter(
      (x) => {
        if (x.Label.trim() === '1.16') {
          return x.children
        }
      }
    )[0].children

    this.questionnaire = BuilderService.createQuestionnaire()
  },
  mounted () {

  },
  methods: {
    addGroup () {
      this.questionnaire.groups.push(BuilderService.createGroup(this.questionnaire))
    },
    confirmed () {
      this.confirmDialogOpen = false
      this.confirmCallback.apply(this, this.confirmCallbackArgs)
    },
    confirmRemoveGroup (group) {
      this.confirmDialogOpen = true
      this.confirmCallback = this.removeGroup
      this.confirmCallbackArgs = [group]
    },
    removeGroup (group) {
      for (let i = 0; i < this.questionnaire.groups.length; i++) {
        if (this.questionnaire.groups[i] === group) {
          this.questionnaire.groups.splice(i, 1)
          if (this.selectedGroup === group) {
            this.selectedGroup = null
          }
          break
        }
      }
    },
    addQuestion ($event, group) {
      // don't propagate the event up to the group or else the group will gain focus over the question
      $event.stopPropagation()

      let question = BuilderService.createQuestion(this.questionnaire)
      if (group.questions.length > 0) {
        question.sortOrder = +group.questions.reduce((a, b) => a.sortOrder > b.sortOrder ? a : b).sortOrder + 1
      }
      group.questions.push(question)

      this.addQuestionToIndex(question)

      this.questionPanels.push(question.sortOrder)
    },
    addQuestionToIndex (question) {
      this.questions.push(question)
      this.editQuestion(null, question)
    },
    confirmRemoveQuestion (group, question) {
      this.confirmDialogOpen = true
      this.confirmCallback = this.removeQuestion
      this.confirmCallbackArgs = [group, question]
    },
    removeQuestion (group, question) {
      if (this.selectedQuestion === question) {
        this.selectedQuestion = null
      }

      for (let i = 0; i < group.questions.length; i++) {
        if (group.questions[i] === question) {
          group.questions.splice(i, 1)
          break
        }
      }
      this.onRemovedQuestionFromIndex(question)
    },
    onRemovedQuestionFromIndex (question) {
      if (this.selectedQuestion === question) {
        this.selectedQuestion = null
      }
      for (let i = 0; i < this.questions.length; i++) {
        if (this.questions[i] === question) {
          this.questions.splice(i, 1)
          break
        }
      }
    },
    getTitle (group) {
      return group.title[this.lang]
    },
    editGroup ($event, group) {
      this.selectedGroup = group
      this.selectedQuestion = null
    },
    editQuestion (group, question) {
      this.selectedGroup = null
      this.selectedQuestion = question
    },
    load () {
      alert('Loading...')
    },
    save () {
      this.$store.dispatch('save', this.questionnaire)
    },
    addOption () {
      this.selectedQuestion.responseOptions.push(BuilderService.createResponseOption(this.selectedQuestion))
    },
    toggleOptions () {
      this.optionsCollapsed = !this.optionsCollapsed
    },
    removeResponseOption (option) {
      for (let i = 0; i < this.selectedQuestion.responseOptions.length; i++) {
        if (this.selectedQuestion.responseOptions[i] === option) {
          this.selectedQuestion.responseOptions.splice(i, 1)
          break
        }
      }
    },
    addValidator () {
      this.selectedQuestion.validationRules.push(BuilderService.createValidator())
    },
    removeValidator (validationRule) {
      for (let i = 0; i < this.selectedQuestion.validationRules.length; i++) {
        if (this.selectedQuestion.validationRules[i] === validationRule) {
          this.selectedQuestion.validationRules.splice(i, 1)
          break
        }
      }
    },
    toggleValidators () {
      this.validatorsCollapsed = !this.validatorsCollapsed
    },
    toggleDependencies () {
      this.dependenciesCollapsed = !this.dependenciesCollapsed
    },
    addDependencyGroup () {
      this.selectedQuestion.dependencyGroups.push(BuilderService.createDependencyGroup())
    },
    removeDependencyGroup (group) {
      for (let i = 0; i < this.selectedQuestion.dependencyGroups.length; i++) {
        if (this.selectedQuestion.dependencyGroups[i] === group) {
          this.selectedQuestion.dependencyGroups.splice(i, 1)
          break
        }
      }
    },
    addQuestionDependency (dependencyGroup) {
      dependencyGroup.questionDependencies.push({
        dependsOnQuestion: null,
        validationAction: null,
        validationValue: null
      })
    },
    removeQuestoionDependency (dependencyGroup, questionDependency) {
      for (let i = 0; i < dependencyGroup.questionDependencies.length; i++) {
        if (dependencyGroup.questionDependencies[i] === questionDependency) {
          dependencyGroup.questionDependencies.splice(i, 1)
          break
        }
      }
    },
    sortQuestions (question) {
      question.sortOrder = +question.sortOrder
      const group = this.questionnaire.groups.find(item => {
        if (item.questions.find(q => q === question)) {
          return item
        }
      })
      if (group) {
        group.questions.sort((a, b) => a.sortOrder - b.sortOrder)
      } else {
        // the question is a child question

        var parentQuestion = this.questions.find(q => {
          return !!q.childQuestions.find(c => c === question)
        })

        parentQuestion.childQuestions.sort((a, b) => a.sortOrder - b.sortOrder)
      }
    },
    onViolationInfoChanged ($event) {
      if (this.selectedQuestion.violationInfo.matchingType == null) {
        this.selectedQuestion.violationInfo.responseToMatch = null
      }
    },
    toggleViolations () {
      this.violationsCollapsed = !this.violationsCollapsed
    },
    toggleProvisions (option) {
      console.log(option)
      option.isProvisionCollapsed = !option.isProvisionCollapsed
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
  .bordered {
    border-width: 3px;
    border-style: solid;
    border-color: var(--v-secondary-darken1);
  }
  .right {
    text-align: right;
  }
  .center {
    text-align: center;
  }
</style>
