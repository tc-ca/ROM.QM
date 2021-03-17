<template>
  <div>
    <v-row>
      <v-col cols="7">
        <div>
          <div v-if="!questionnaire || !questionnaire.groups">
            {{ $t('app.builder.loading') }}
          </div>
          <div v-else-if="!questionnaire.groups.length">
            {{ $t('app.builder.noGroups') }}
          </div>
          <v-expansion-panels
            v-else
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
                  <v-col
                    cols="9"
                    class="pl-1"
                  >
                    <h2 class="subtitle-1">
                      {{ getTitle(group) }}
                    </h2>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <builder-group
                :group="group"
                :selected-question="selectedQuestion"
                :questionnaire="questionnaire"
                :panelindex="questionPanels"
                @editGroup="editGroup"
                @editQuestion="editQuestion"
                @childQuestionAdded="addQuestionToIndex"
                @childQuestionRemoved="onRemovedQuestionFromIndex"
                @removeQuestion="confirmRemoveQuestion"
                @addQuestion="addQuestion"
                @confirmRemoveGroup="confirmRemoveGroup"
              />
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
          <v-row v-if="selectedGroup && !selectedQuestion">
            <v-col>
              <v-text-field
                v-model="selectedGroup.title[eng]"
                :label="$t('app.builder.group.englishText')"
              />
              <v-text-field
                v-model="selectedGroup.title[fr]"
                :label="$t('app.builder.group.frenchText')"
              />
              <v-text-field
                v-model="selectedGroup.sortOrder"
                dense
                type="number"
                :label="$t('app.builder.sortOrder')"
                @change="sortGroups(selectedGroup)"
              />
              <v-checkbox
                v-model="selectedGroup.isRepeatable"
                :label="$t('app.builder.isRepeatable')"
              />
            </v-col>
          </v-row>
          <v-row v-if="selectedQuestion">
            <v-col>
              <v-text-field
                v-model="selectedQuestion.text[eng]"
                :label="$t('app.builder.question.englishText')"
              />
              <v-text-field
                v-model="selectedQuestion.text[fr]"
                :label="$t('app.builder.question.frenchText')"
              />
              <v-select
                v-model="selectedQuestion.type"
                item-text="text"
                item-value="value"
                :items="questionTypes"
                :label="$t('app.builder.question.questionType')"
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
                  v-model="selectedQuestion.isSamplingAllowed"
                  dense
                  :label="$t('app.builder.question.samplingAllowed')"
                />
                <div v-if="isRepeatableVisible">
                  <v-checkbox
                    v-model="selectedQuestion.isRepeatable"
                    dense
                    :label="$t('app.builder.isRepeatable')"
                  />
                </div>
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
                        :label="$t('app.builder.responseOptions.englishText')"
                      />
                      <v-text-field
                        v-model="option.text[fr]"
                        dense
                        :label="$t('app.builder.responseOptions.frenchText')"
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
                          v-model="option.internalCommentRequirement"
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
                          v-model="option.externalCommentRequirement"
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
                          v-model="option.fileRequirement"
                          item-text="text"
                          item-value="value"
                          :items="optionTypes"
                          :label="$t('app.builder.file')"
                        >
                          <template v-slot:selection="{ item }">
                            <span>{{ item.text[lang] }}</span>
                          </template>
                          <template v-slot:item="{ item }">
                            <span>{{ item.text[lang] }}</span>
                          </template>
                        </v-select>
                        <v-select
                          v-model="option.pictureRequirement"
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
                        <v-list
                          dense
                          nav
                          color="#f5f5f5"
                        >
                          <v-list-group>
                            <template v-slot:activator>
                              <v-list-item-title
                                class="subtitle-1"
                                style="color:#757575"
                              >
                                <v-row>
                                  <v-col>
                                    {{ $t('app.builder.responseOptions.provisions.provisions') }}
                                  </v-col>
                                </v-row>
                              </v-list-item-title>
                            </template>
                            <v-list-item>
                              <v-list-item-content>
                                <v-card
                                  class="mx-auto"
                                >
                                  <v-sheet class="pa-4">
                                    <v-text-field
                                      v-model="searchProvisions"
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
                                      item-key="id"
                                      :item-text="displayTextLang"
                                      selection-type="leaf"
                                      :search="searchProvisions"
                                      :items="provisions"
                                      @input="updateSearchableProvisions()"
                                    >
                                      <template v-slot:label="{ item }">
                                        <div class="truncated">
                                          <div>{{ lang === eng ? item.DisplayEnglishText : item.DisplayFrenchText }}</div>
                                        </div>
                                      </template>
                                    </v-treeview>
                                  </v-card-text>
                                </v-card>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-group>
                        </v-list>
                      </div>
                    </div>
                    <div class="right">
                      <v-btn
                        small
                        @click="addResponseOption()"
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
                        :label="$t('app.builder.validators.englishMessage')"
                      />
                      <v-text-field
                        v-model="validationRule.errorMessage[fr]"
                        dense
                        :label="$t('app.builder.validators.frenchMessage')"
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
                            :label="$t('app.builder.validators.validator')"
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
                                  :item-text="'text.' + lang"
                                  item-value="guid"
                                  :items="questions"
                                  :label="$t('app.builder.dependsOn.question')"
                                  return-object
                                />
                                <v-select
                                  v-model="questionDependency.validationAction"
                                  dense
                                  item-text="text"
                                  item-value="value"
                                  :items="dependencyValidationActions"
                                  :label="$t('app.builder.dependsOn.tobe')"
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
                                  :label="$t('app.builder.dependsOn.to')"
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
                                        @click="removeQuestionDependency(dependencyGroup, questionDependency)"
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
import _ from 'lodash'
import { LANGUAGE } from '../constants.js'
import BUILDER from '../data/builderLookupTypes'
import BuilderGroup from '../components/builder/builder-group'
import BaseMixin from '../mixins/base'
import BuilderService from '../services/builderService'
import { mapState, mapGetters } from 'vuex'
import { QUESTION_TYPE } from '../data/questionTypes'

export default {
  name: 'Builder',
  components: {
    BuilderGroup
  },
  mixins: [BaseMixin],
  props: {
    clearPropBuilder: {
      type: Boolean,
      default: false
    },
    savePropBuilder: {
      type: Boolean,
      default: false
    },
    fixItPropBuilder: {
      type: Boolean,
      default: false
    },
    updatePropBuilder: {
      type: Boolean,
      default: false
    }
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
      provisions: [],
      groupPanels: [],
      questionPanels: [],
      questionProvisions: [],
      flagTimer: null,
      reference: QUESTION_TYPE.REFERENCE,
      searchProvisions: null
    }
  },
  computed: {
    isRepeatableVisible () {
      if (this.selectedGroup && this.selectedQuestion) {
        return BuilderService.isParentAGroup(this.selectedGroup, this.selectedQuestion.guid)
      }
      return false
    },
    displayTextLang () {
      return (this.lang === 'eng') ? 'DisplayEnglishText' : 'DisplayFrenchText'
    },
    eng () {
      return LANGUAGE.ENGLISH
    },
    fr () {
      return LANGUAGE.FRENCH
    },
    filterProvisions () {
      return (item, search, textKey) => item[textKey].indexOf(search) > -1
    },
    selectedQuestionProvisions () {
      let provisions = []
      this.selectedQuestion.responseOptions.forEach(option => {
        provisions = provisions.concat(option.provisions)
      })
      return provisions
    },
    ...mapState({
      group: state => {
        if (!state || !state.group) {
          return [ { groups: [] } ]
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
  watch: {
    clearPropBuilder () {
      this.clearQuestionnaire()
    },
    savePropBuilder () {
      this.save()
    },
    fixItPropBuilder () {
      this.fixit()
    },
    updatePropBuilder () {
      this.updateQuestionnaire()
    }
  },
  async mounted () {
    // run this code first
    // so we can subscribe to mutation within this method
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case 'setQuestionnaire':
          this.questionnaire = state.questionnaire.questionnaire
          this.questions = this.getFlatListOfAllQuestions()
          this.$store.dispatch('objectstate/UpdateQuestionnaireState', _.cloneDeep(this.questionnaire))
          break
        case 'setTreeLegislations':
          this.provisions = this.$store.state.legislations.legislations
          break
        default:
          break
      }
    })

    let template = null
    // if env= dev and loadLocalData then set the questionnaire/template state to local copy else the state will be set explicility outside in app.vue
    if (this.envDev && this.loadLocalData) {
      if (!this.$store.getters.getModifiedinBuilder) {
        var templateToLoad = process.env.VUE_APP_TEMPLATE_TO_LOAD
        template = await BuilderService.GetMockQuestionnaireFromImportModule(templateToLoad)
        this.$store.dispatch('SetQuestionnaireState', { questionnaire: template, page: 'builder' })
      } else {
        template = this.$store.getters.getQuestionnaire
        this.$store.dispatch('SetQuestionnaireState', { questionnaire: template, page: 'builder' })
      }
    } else {
      // default to empty template
      template = BuilderService.createQuestionnaire()
      this.$store.dispatch('SetQuestionnaireState', { questionnaire: template, page: 'builder' })
    }
    // if env= dev load the provisions else the state will be set explicility outside in app.vue
    if (this.envDev) {
      this.$store.dispatch('SetTreeLegislationsStateToLocalData')
    }

    this.$store.dispatch('InitializeSearchableProvisionRef')
    this.isDirty()
  },
  methods: {
    isDirty () {
      this.$root.$children[0].isFormDirty = _.differenceWith([this.questionnaire], this.$store.state.objectstate.data.questionnaire, _.isEqual).length !== 0
      this.flagTimer = setTimeout(() => this.isDirty(), 3000)
      if (this.$root.$children[0].isFormDirty) clearTimeout(this.flagTimer)
    },
    addGroup () {
      this.questionnaire.groups.push(BuilderService.createGroup(this.questionnaire.groups.length))
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
            let qRf = BuilderService.createReferenceQuestion(group)
            if (group.questions.length > 0) {
              // Move every question one number up on the sort order
              group.questions.forEach((q) => { q.sortOrder += 1 })
            }
            group.questions.unshift(qRf)
            // Move question from the end to the start of the list
            const index = group.questions.findIndex(q => q.guid === this.selectedQuestion.guid)
            if (index > -1) {
              group.questions.splice(index, 1)
              group.expansionPanels = []
              group.questions.forEach(q => { group.expansionPanels.push(q.sortOrder) })
              this.selectedQuestion = qRf
            }
          } else {
            // Alert and return back to the text type, the closest type to Reference Question
            this.$store.dispatch('toast/show', { text: `Only one Reference question is allowed on a Group`, color: 'error', timeout: 5000 })
            this.selectedQuestion.type = QUESTION_TYPE.TEXT
          }
        } else {
          this.$store.dispatch('toast/show', { text: `A Reference question is only allowed on a Group Top Level, not as a Child Question`, color: 'error', timeout: 5000 })
          this.selectedQuestion.type = QUESTION_TYPE.TEXT
        }
      }
      this.selectedQuestion.responseOptions = []
      if (this.selectedQuestion.type === QUESTION_TYPE.RADIO) {
        this.selectedQuestion.responseOptions.push(BuilderService.createResponseOption(1, { [LANGUAGE.ENGLISH]: 'Yes', [LANGUAGE.FRENCH]: 'Oui' }, 'true'))
        this.selectedQuestion.responseOptions.push(BuilderService.createResponseOption(2, { [LANGUAGE.ENGLISH]: 'No', [LANGUAGE.FRENCH]: 'Non' }, 'false'))
      } else if (this.selectedQuestion.type === QUESTION_TYPE.SELECT) {
        this.selectedQuestion.responseOptions.push(BuilderService.createResponseOption(1, { [LANGUAGE.ENGLISH]: 'Option 1', [LANGUAGE.FRENCH]: 'Option 1' }, '1'))
        this.selectedQuestion.responseOptions.push(BuilderService.createResponseOption(2, { [LANGUAGE.ENGLISH]: 'Option 2', [LANGUAGE.FRENCH]: 'Option 2' }, '2'))
      } else {
        this.selectedQuestion.responseOptions.push(BuilderService.createResponseOption(1, null, ''))
      }
    },
    addQuestion ($event, group) {
      // don't propagate the event up to the group or else the group will gain focus over the question
      $event.stopPropagation()

      let question = BuilderService.createQuestion(group)
      if (group.questions.length > 0) {
        question.sortOrder = +group.questions.reduce((a, b) => a.sortOrder > b.sortOrder ? a : b).sortOrder + 1
      }
      group.questions.push(question)
      this.addQuestionToIndex(question)

      // group.expansionPanels = []
      // group.expansionPanels.push(group.questions.length)

      this.selectedGroup = group
      // this.selectedQuestion = question
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
      this.selectedGroup = group
      this.selectedQuestion = question
    },
    clearQuestionnaire () {
      this.questionnaire = BuilderService.createQuestionnaire()
      this.save()
    },
    save () {
      if (this.questionnaire) {
        const page = 'builder'
        const questionnaire = this.questionnaire
        this.$store.dispatch('SetQuestionnaireState', { questionnaire, page })
        this.$store.dispatch('SetModifiedInBuilder', true)
      }
    },
    fixit () {
      this.questionnaire = BuilderService.fixTemplate(this.questionnaire)
      this.save()
    },
    updateQuestionnaire () {
      this.questionnaire = BuilderService.updateTemplate(this.questionnaire)
      this.save()
    },
    addResponseOption () {
      const idx = this.selectedQuestion.responseOptions.length
      const ro = BuilderService.createGenericResponseOption()
      ro.sortOrder = idx + 1
      ro.value = idx + 1
      this.selectedQuestion.responseOptions.push(ro)
    },
    toggleOptions () {
      this.optionsCollapsed = !this.optionsCollapsed
    },
    removeResponseOption (option) {
      const idx = this.selectedQuestion.responseOptions.findIndex(ro => ro.guid === option.guid)
      if (idx > -1) {
        this.selectedQuestion.responseOptions.splice(idx, 1)
      }
    },
    addValidator () {
      const vr = BuilderService.createGenericValidationRule()
      this.selectedQuestion.validationRules.push(vr)
    },
    removeValidator (validationRule) {
      const idx = this.selectedQuestion.validationRules.findIndex(vr => vr.guid === validationRule.guid)
      if (idx > -1) {
        this.selectedQuestion.validationRules.splice(idx, 1)
      }
    },
    toggleValidators () {
      this.validatorsCollapsed = !this.validatorsCollapsed
    },
    toggleDependencies () {
      this.dependenciesCollapsed = !this.dependenciesCollapsed
    },
    addDependencyGroup () {
      const dg = BuilderService.createDependencyGroup()
      this.selectedQuestion.dependencyGroups.push(dg)
    },
    removeDependencyGroup (depGroup) {
      const idx = this.selectedQuestion.dependencyGroups.findIndex(dg => dg.guid === depGroup.guid)
      if (idx > -1) {
        this.selectedQuestion.dependencyGroups.splice(idx, 1)
      }
    },
    addQuestionDependency (dependencyGroup) {
      const qd = BuilderService.createGenericQuestionDependency()
      dependencyGroup.questionDependencies.push(qd)
    },
    removeQuestionDependency (dependencyGroup, questionDependency) {
      const idx = dependencyGroup.questionDependencies.findIndex(qd => qd.guid === questionDependency.guid)
      if (idx > -1) {
        dependencyGroup.questionDependencies.splice(idx, 1)
      }
    },
    sortGroups (group) {
      this.questionnaire.groups.sort((a, b) => a.order - b.order)
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
    updateSearchableProvisions () {
      const questionGuid = this.selectedQuestion.guid
      this.$store.dispatch('UpdateSearchableProvisionsState', { provisions: this.selectedQuestionProvisions, questionGuid })
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
