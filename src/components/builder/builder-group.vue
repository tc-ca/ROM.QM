<template>
  <v-expansion-panel-content eager>
    <v-row @click="editGroup($event, group)">
      <v-col cols="12">
        <v-expansion-panels
          v-model="expansionPanels"
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
</template>

<script>
import { LANGUAGE } from '../../constants.js'
import { mapState } from 'vuex'
import BuilderQuestion from '../builder/builder-question'

export default {
  emits: ['editGroup', 'editQuestion', 'addQuestionToIndex', 'onRemovedQuestionFromIndex', 'confirmRemoveQuestion', 'addQuestion', 'confirmRemoveGroup'],
  name: 'BuilderGroup',
  components: {
    BuilderQuestion
  },
  props: {
    group: {
      type: Object,
      required: true
    },
    selectedQuestion: {
      type: Object,
      default: null
    },
    questionnaire: {
      type: Object,
      required: true
    },
    panelindex: {
      type: Array,
      required: false,
      default: null
    }
  },
  computed: {
    eng () {
      return LANGUAGE.ENGLISH
    },
    fr () {
      return LANGUAGE.FRENCH
    },
    expansionPanels: {
      get () {
        return this.panelindex
      },
      set (value) { return value }
    },
    ...mapState({
      lang: state => {
        if (!state || !state.settings) {
          return LANGUAGE.ENGLISH
        }
        return state.settings.settings.lang
      }
    })
  },
  watch: {
    panelindex: {
      handler () {
        console.log('group-builder index: ')
        console.log(this.panelindex)
        console.log(this.group)
      }
    }
  },
  methods: {
    editGroup ($event, group) {
      this.$emit('editGroup', $event, group)
    },
    editQuestion (group, question) {
      this.$emit('editQuestion', group, question)
    },
    addQuestionToIndex (question) {
      this.$emit('childQuestionAdded', question)
    },
    onRemovedQuestionFromIndex (question) {
      this.$emit('childQuestionRemoved', question)
    },
    confirmRemoveQuestion (group, question) {
      this.$emit('removeQuestion', group, question)
    },
    addQuestion ($event, group) {
      this.$emit('addQuestion', $event, group)
    },
    confirmRemoveGroup (group) {
      this.$emit('confirmRemoveGroup', group)
    }
  }
}
</script>

<style scoped>

</style>
