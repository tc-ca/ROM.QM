<template>
  <div>
    <v-row>
      <v-col cols="7">
        <div>
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
                              {{ $t('app.builder.group.question.addQuestion') }}
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
                              <span>{{ $t('app.builder.group.removeGroup') }}</span>
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
              {{ $t('app.builder.group.addGroup') }}
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col cols="5">
        <div style="position: fixed;left: 60%;top: 10%; width: 35%;max-height:85%;overflow-y: auto;overflow-x: hidden">
          <v-row
            v-if="envDev"
            justify="end"
          >
            <v-col class="col-auto">
              <v-btn @click="save()">
                {{ $t('app.builder.save') }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="questionnaire.name"
                :label="$t('app.builder.questionnaireName')"
              />
            </v-col>
          </v-row>
          <v-row v-if="selectedGroup">
            <v-col>
              <v-text-field
                v-model="selectedGroup.primaryKey"
                :label="$t('app.builder.group.groupName')"
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
                :disabled="selectedQuestion.type === reference"
                :label="$t('app.builder.questionName')"
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
                :label="$t('app.builder.questionType')"
                @change="changeQuestionType($event)"
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
                :disabled="selectedQuestion.type === reference"
                dense
                type="number"
                :label="$t('app.builder.sortOrder')"
                @change="sortQuestions(selectedQuestion)"
              />
              <div v-if="selectedQuestion.type !== reference">
                <v-checkbox
                  v-model="selectedQuestion.isVisible"
                  dense
                  :label="$t('app.builder.visibleByDefault')"
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
                    {{ $t('app.builder.responseOptions.responseOptions') }}
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
                        label="Option text Fr"
                      />
                      <v-text-field
                        v-model.number="option.sortOrder"
                        dense
                        :label="$t('app.builder.responseOptions.sortOrder')"
                      />
                      <v-text-field
                        v-model="option.value"
                        dense
                        :label="$t('app.builder.responseOptions.value')"
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
                          <span>{{ $t('app.builder.responseOptions.removResponseoption') }}</span>
                        </v-tooltip>
                      </div>
                      <div>
                        <v-select
                          v-model="option.internalComment.option"
                          item-text="text"
                          item-value="value"
                          :items="optionTypes"
                          :label="$t('app.builder.internalComments')"
                        >
                          <template v-slot:selection="{ item }">
                            <span>{{ item.text[lang] }}</span>
                          </template>
                          <template v-slot:item="{ item }">
                            <span>{{ item.text[lang] }}</span>
                          </template>
                        </v-select>
                        <v-select
                          v-model="option.externalComment.option"
                          item-text="text"
                          item-value="value"
                          :items="optionTypes"
                          :label="$t('app.builder.externalComments')"
                        >
                          <template v-slot:selection="{ item }">
                            <span>{{ item.text[lang] }}</span>
                          </template>
                          <template v-slot:item="{ item }">
                            <span>{{ item.text[lang] }}</span>
                          </template>
                        </v-select>
                        <v-select
                          v-model="option.picture.option"
                          item-text="text"
                          item-value="value"
                          :items="optionTypes"
                          :label="$t('app.builder.picture')"
                        >
                          <template v-slot:selection="{ item }">
                            <span>{{ item.text[lang] }}</span>
                          </template>
                          <template v-slot:item="{ item }">
                            <span>{{ item.text[lang] }}</span>
                          </template>
                        </v-select>
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
                          {{ $t('app.builder.responseOptions.provisions.provisions') }}
                        </div>
                        <div v-show="option.isProvisionCollapsed">
                          <div>
                            <v-card
                              class="mx-auto"
                            >
                              <v-sheet class="pa-4">
                                <v-text-field
                                  v-model="option.searchProvisions"
                                  :label="$t('app.builder.responseOptions.provisions.search')"
                                  outlined
                                  hide-details
                                  clearable
                                  clear-icon="mdi-close-circle-outline"
                                />
                              </v-sheet>
                              <v-card-text>
                                <v-treeview
                                  v-model="option.provisions"
                                  selectable
                                  item-text="DisplayEnglishText"
                                  item-key="id"
                                  selection-type="leaf"
                                  :search="option.searchProvisions"
                                  :filter="option.filterProvisions"
                                  :items="provisions"
                                  @input="updateSearchableProvisions($event)"
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
                        {{ $t('app.builder.responseOptions.addOption') }}
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
                    {{ $t('app.builder.validators.validators') }}
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
                        :label="$t('app.builder.validators.name')"
                      />
                      <v-checkbox
                        v-model="validationRule.enabled"
                        dense
                        :label="$t('app.builder.validators.enabled')"
                      />
                      <v-select
                        v-model="validationRule.type"
                        dense
                        item-text="text"
                        item-value="value"
                        :items="validatorTypes"
                        :label="$t('app.builder.validators.type')"
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
                        label="En: Error message"
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
                          <span>{{ $t('app.builder.validators.removeValidator') }}</span>
                        </v-tooltip>
                      </div>
                    </div>
                    <div class="right">
                      <v-btn
                        small
                        @click="addValidator()"
                      >
                        {{ $t('app.builder.validators.addValidator') }}
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
                      {{ $t('app.builder.dependsOn.dependsOn') }}
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
                            :label="$t('app.builder.dependsOn.type')"
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
                                  item-value="guid"
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
                                >
                                  <template v-slot:selection="{ item }">
                                    <span>{{ item.text[lang] }}</span>
                                  </template>
                                  <template v-slot:item="{ item }">
                                    <span>{{ item.text[lang] }}</span>
                                  </template>
                                </v-select>
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
                                    <span>{{ $t('app.builder.group.question.removeQuestion') }}</span>
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
                                {{ $t('app.builder.dependsOn.addQuestion') }}
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
                              <span>{{ $t('app.builder.dependsOn.removDependencyGroup') }}</span>
                            </v-tooltip>
                          </div>
                        </div>
                        <div class="right">
                          <v-btn
                            small
                            @click="addDependencyGroup()"
                          >
                            {{ $t('app.builder.dependsOn.addDependencyGroup') }}
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-model="confirmDialogOpen"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('app.builder.group.delete') }}
        </v-card-title>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="error"
            text
            @click="confirmed()"
          >
            {{ $t('app.builder.group.yes') }}
          </v-btn>

          <v-btn
            text
            @click="confirmDialogOpen = false"
          >
            {{ $t('app.builder.group.no') }}
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
import BaseMixin from '../mixins/base'
import BuilderService from '../services/builderService'
import { mapState, mapGetters } from 'vuex'
import { QUESTION_TYPE } from '../data/questionTypes'

export default {
  name: 'Builder',
  components: {
    BuilderQuestion
  },
  mixins: [BaseMixin],
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
      questionProvisions: [],
      reference: QUESTION_TYPE.REFERENCE
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
      },
      // mix the getters into computed with object spread operator
      ...mapGetters([
        'getFlatListOfAllQuestions'
      // ...
      ])
    })
  },
  created () {
    this.questionnaire = this.$store.state.questionnaire.questionnaire
  },
  mounted () {
    // subscribe to mutation as a mutation will be called from App.vue when watch property detects a change.
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case 'setQuestionnaire':
          this.questionnaire = state.questionnaire.questionnaire
          this.questions = this.getFlatListOfAllQuestions
          this.$store.dispatch('InitializeRef')
          break
        case 'SetLegislations':
          this.provisions = this.$store.state.legislations.legislations
          break
        default:
          break
      }
    })
  },
  beforeDestroy () {
    this.$store.dispatch('notification/clearNotifications')
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
    changeQuestionType ($event) {
      if (this.selectedQuestion.type === QUESTION_TYPE.REFERENCE) {
        const group = BuilderService.findGroupForQuestionById(this.questionnaire.groups, this.selectedQuestion.guid)
        if (group) {
          if (!BuilderService.findReferenceQuestion(group, this.selectedQuestion.guid)) {
            let qRf = BuilderService.createReferenceQuestion(this.questionnaire)
            if (group.questions.length > 0) {
              // Move every question one number up on the sort order
              group.questions.forEach((q) => { q.sortOrder += 1 })
            }
            qRf.sortOrder = 1
            group.questions.unshift(qRf)
            // Move question from the end to the start of the list
            const index = group.questions.findIndex(q => q.guid === this.selectedQuestion.guid)
            if (index > -1) {
              group.questions.splice(index, 1)
              // Rebuidl the question Panels
              this.questionPanels = []
              group.questions.forEach(q => { this.questionPanels.push(q.sortOrder) })
              this.selectedQuestion = qRf
            }
          } else {
            // Alert and return back to the text type, the closest type to Reference Question
            this.$store.dispatch('notification/show', { text: `Only one Reference question is allowed on a Group`, color: 'error', timeout: 5000 })
            this.selectedQuestion.type = 'text'
          }
        } else {
          this.$store.dispatch('notification/show', { text: `A Reference question is only allowed on a Group Top Level, not as a Child Question`, color: 'error', timeout: 5000 })
          this.selectedQuestion.type = 'text'
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
      // In case that the question removed is a Reference Question
      if (question.type === QUESTION_TYPE.REFERENCE) {
        // Move all the sortOrder 1 position up
        if (group.questions.length > 0) {
          // Move every question one number down on the sort order
          group.questions.forEach((q) => { q.sortOrder -= 1 })
        }
      }
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
    async save (id) {
      const page = 'builder'
      console.log('Save...')
      console.log(this.questionnaire)
      const questionnaire = this.questionnaire
      this.$store.dispatch('SetQuestionnaireState', { questionnaire, page })
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
      option.isProvisionCollapsed = !option.isProvisionCollapsed
    },
    updateSearchableProvisions (provisions) {
      const questionGuid = this.selectedQuestion.guid
      this.$store.dispatch('UpdateSearchableProvisions', { provisions, questionGuid })
    }
  }
}
</script>

<style scoped>
  .selected {
    box-shadow: 0 0px 5px 0 rgb(10, 51, 39);
    border-width: 1px;
    border-style: solid;
    border-color:  rgb(10, 51, 39);
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
