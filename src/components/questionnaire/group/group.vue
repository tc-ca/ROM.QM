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
        <!-- Group Title -->
        <v-col
          cols="9"
          class="pl-1"
        >
          <h2 class="subtitle-1">
            {{ groupTitle }}

            <span
              v-if="group.isRepeatable=== true"
              class="subtitle-1 text-truncate"
            >{{ ` ${repeatGroupTextDifferentiator}` }}</span>
          </h2>
        </v-col>
        <v-col cols="1">
          <!-- Repeat button -->
          <v-icon
            v-if="group.isRepeatable=== true"
            large
            color="primary"
            @click.native.stop="repeatGroup(group)"
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
            v-if="group.isRepeatable=== true && repeatedGroup"
            large
            color="primary"
            @click.native.stop="removeGroup(group, index)"
          >
            mdi-minus
          </v-icon>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content eager>
      <v-row>
        <v-col cols="12">
          <v-expansion-panels
            multiple
            focusable
            hover
            :value="expantionPanelsValue"
          >
            <question
              v-for="(question, questionIndex) in group.questions"
              ref="groupQuestion"
              :key="questionIndex"
              :question="question"
              :group="group"
              :index="questionIndex"
              :in-repeated-group="repeatedGroup"
              @responseChanged="onResponseChanged"
              @error="onError"
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

export default {

  components: { Question },

  props: {
    group: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },

  data: function () {
    return {
      // indicates if the group was created by using the repeat function i.e. not original
      repeatedGroup: false,
      valid: true
    }
  },

  computed: {
    groupTitle () {
      return `${this.index + 1}. ${this.group.title[this.lang]}`
    },
    repeatGroupTextDifferentiator () {
      return this.$store.getters.getResponsesToShowInGroupHeader(this.group.htmlElementId).join(', ')
    },
    // ...mapState(['groups']),
    ...mapState({
      lang: state => {
        if (!state || !state.app) {
          return 'en-US'
        }
        return state.app.settings.lang
      }
    }),
    expanded () {
      return [0, 1]
    },
    expantionPanelsValue () {
      const arr = []
      for (let i = 0; i < this.group.questions.length; i++) {
        arr.push(i)
      }
      return arr
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
    repeatGroup (group) {
      this.$store.dispatch('repeatGroup', group)
    },
    removeGroup (group) {
      this.$store.dispatch('removeGroup', group)
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
